import "./globals.css";

export const metadata = {
  title: "Markdown Viewer",
  description: "View Markdown files with copyable code blocks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}