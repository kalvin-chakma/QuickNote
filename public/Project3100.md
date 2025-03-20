# TrendyTrade - Trade Products and Services

## Team Members
| Roll Number      | Name            | Email                               | Role                    |
|------------------|-----------------|--------------------------           |-------------------------|
| 20220104031      | Ifti              | farhan.cse.20220104031@aust.edu     | Lead (FullStack)       |
| 20220104037      | Turjo   | turjo.cse.20220104037@aust.edu              | Frontend+Backend      |
| 20220104038      | kalvin | kalvin.cse.20220104038@aust.edu             | Frontend          |
| 20220104041      | Limon     |asaduzzaman.cse.20220104041@aust.edu             | Backend     |

---

## Project Overview

### Project Title
**TrendyTrade: A Modern Trading Platform**

### Objective
TrendyTrade aims to provide a platform where users can trade products and services efficiently. It serves as a one-stop solution for managing, searching, and exchanging items within a community.

### Target Audience
Individuals, small businesses, and freelancers looking to trade items and services in a modern, user-friendly environment.

### Tech Stack
- **Backend:** Laravel (using Sanctum for authentication)
- **Frontend:** React (with Vite)
- **Rendering Method:** Client-Side Rendering (CSR)

### UI Design
A modern and intuitive UI design has been created using Figma. The design focuses on providing a seamless user experience for trading activities.
 You can view the design here:
[TrendyTrade Figma Design](https://www.figma.com/design/2JDqlWCyEQUfr7uX3otESA/CSE-3100?node-id=53-153&t=IvbhMvdUg6Ud94IN-1)

---

## Project Features

### Core Features
1. **User Authentication:**
   - Registration
   - Login (with Sanctum-based token authentication)
   - Profile management
   - Mobile verification

2. **Trading Items:**
3. - **Barter System**: Swap market or Auction like system
   - **CRUD Operations:** Create, Read, Update, Delete items and services.
   - Search and filter functionality.

3. **Secure Transactions:**
   - User-to-user messaging for deal negotiation.
   - User rating and feedback system.

4. **Admin Features:**
   - Manage user accounts and reported items.
   - Monitor trade activity.

5. **Responsive UI:**
   - Fully responsive design for mobile, tablet, and desktop.

### API Endpoints
| Method | Endpoint         | Description                        |
|--------|-------------------|------------------------------------|
| GET    | /api/items        | Fetch all items.                  |
| POST   | /api/items        | Create a new item.                |
| PUT    | /api/items/{id}   | Update item details.              |
| DELETE | /api/items/{id}   | Delete an item.                   |
| POST   | /api/auth/login   | User login.                       |
| POST   | /api/auth/logout  | User logout.                      |
| POST   | /api/auth/register| User registration.                |
| Post   | /api/history      | User history                      |    
---

## Milestones

### Milestone 1: **Project Setup & Basic Features**
- Set up the Laravel backend and configure Sanctum for authentication.
- Initialize the React frontend with Vite.
- Design database schema and implement migrations.
- Implement basic authentication routes (login, register, mobile verification).
- Create mock data for trades.

### Milestone 2: **Core Features Implementation**
- Develop CRUD operations for items and services.
- Integrate the frontend with the backend using Axios.
- Implement search and filter functionality.
- Add basic user-to-user messaging.

### Milestone 3: **Polishing & Deployment**
- Add user rating and feedback features.
- Implement admin management panel.
- Optimize for mobile and desktop responsiveness.
- Deploy the application to a live server.

---

---


