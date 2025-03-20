Let's reorganize this code into an industry-standard MVC architecture with validation. Here's a comprehensive solution:

### Folder Structure
```
project-root/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth].js
│   │   │   └── register/
│   │   │       └── route.js
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── register/
│   │       └── page.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── models/
│   │   └── User.js
│   ├── services/
│   │   ├── authService.js
│   │   └── dbService.js
│   ├── utils/
│   │   ├── validation.js
│   │   └── constants.js
│   ├── components/
│   │   ├── LoginForm.jsx
│   │   ├── RegistrationForm.jsx
│   │   ├── SocialLogins.jsx
│   │   └── Logout.jsx
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── lib/
│       └── mongo.js
├── .env
├── package.json
└── next.config.js
```

### Key Files

1. **src/app/api/auth/[...nextauth].js**
```javascript
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { authService } from "@/services/authService";
import { dbConnect } from "@/lib/mongo";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        return authService.authorizeCredentials(credentials);
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/",
    error: "/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
};

export default NextAuth(authOptions);
```

2. **src/models/User.js**
```javascript
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
```

3. **src/controllers/authController.js**
```javascript
import { authService } from "@/services/authService";
import { validateLogin, validateRegister } from "@/utils/validation";

export const authController = {
  async login(req) {
    const formData = await req.formData();
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const errors = validateLogin(credentials);
    if (Object.keys(errors).length) {
      return { error: errors };
    }

    return authService.login(credentials);
  },

  async register(req) {
    const { name, email, password } = await req.json();
    const data = { name, email, password };

    const errors = validateRegister(data);
    if (Object.keys(errors).length) {
      return { error: errors, status: 400 };
    }

    return authService.register(data);
  },

  async socialLogin(formData) {
    return authService.socialLogin(formData);
  },

  async logout() {
    return authService.logout();
  },
};
```

4. **src/services/authService.js**
```javascript
import { signIn, signOut } from "next-auth/react";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";
import { dbConnect } from "@/lib/mongo";

export const authService = {
  async authorizeCredentials(credentials) {
    if (!credentials?.email || !credentials?.password) return null;

    await dbConnect();
    const user = await User.findOne({ email: credentials.email });

    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return {
      id: user._id,
      email: user.email,
      name: user.name,
    };
  },

  async login(credentials) {
    try {
      const response = await signIn("credentials", {
        ...credentials,
        redirect: false,
      });
      return response;
    } catch (error) {
      throw new Error("Login failed");
    }
  },

  async register({ name, email, password }) {
    await dbConnect();
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return { id: user._id, email: user.email, name: user.name };
  },

  async socialLogin(formData) {
    const action = formData.get("action");
    await signIn(action, { redirectTo: "/home" });
  },

  async logout() {
    await signOut({ redirectTo: "/" });
  },
};
```

5. **src/utils/validation.js**
```javascript
export const validateLogin = ({ email, password }) => {
  const errors = {};

  if (!email) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = "Invalid email format";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

export const validateRegister = ({ name, email, password }) => {
  const errors = validateLogin({ email, password });

  if (!name) {
    errors.name = "Name is required";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  return errors;
};
```

6. **src/components/LoginForm.jsx**
```jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authController } from "@/controllers/authController";
import SocialLogins from "./SocialLogins";

const LoginForm = () => {
  const router = useRouter();
  const [errors, setErrors] = useState({});

  async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const response = await authController.login({ formData });
      if (response?.error) {
        setErrors(response.error);
      } else {
        router.push("/home");
      }
    } catch (e) {
      setErrors({ general: "An error occurred during login" });
    }
  }

  return (
    <div className="flex flex-col items-center">
      {errors.general && (
        <div className="text-xl text-red-500 mb-4">{errors.general}</div>
      )}
      <form
        onSubmit={onSubmit}
        className="my-5 flex flex-col w-96 border p-6 rounded-md"
      >
        <div className="my-2">
          <label htmlFor="email" className="block mb-1">
            Email Address
          </label>
          <input
            className="w-full border p-2 rounded"
            type="email"
            name="email"
            id="email"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
        </div>

        <div className="my-2">
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            className="w-full border p-2 rounded"
            type="password"
            name="password"
            id="password"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white mt-4 p-2 rounded w-full"
        >
          Login
        </button>
      </form>
      <SocialLogins />
    </div>
  );
};

export default LoginForm;
```

7. **src/app/api/register/route.js**
```javascript
import { NextResponse } from "next/server";
import { authController } from "@/controllers/authController";

export async function POST(request) {
  try {
    const result = await authController.register(request);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status || 400 });
    }

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Key Improvements
1. **MVC Architecture**: Separated concerns into Models, Views (Components), and Controllers
2. **Validation**: Added robust input validation with error messages
3. **Security**: Increased bcrypt salt rounds to 10, added proper error handling
4. **Consistency**: Standardized API responses and error handling
5. **Scalability**: Modular structure makes it easy to add new features
6. **Type Safety**: Added proper schema validation in Mongoose
7. **UI/UX**: Improved form styling and error display

### Environment Variables (.env)
```
MONGO_DB_CONNECTION_STRING=your_mongodb_uri
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret
```

This structure follows industry best practices with proper separation of concerns, validation, and error handling while maintaining the original functionality. The code is now more maintainable, scalable, and production-ready.