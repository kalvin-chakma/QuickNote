import fs from "fs";
import path from "path";
import ReadmeList from "@/app/components/readmeFilesList";
import Link from "next/link";

export default async function Home() {
  const publicDir = path.join(process.cwd(), "public");
  let files = [];
  try {
    files = fs.readdirSync(publicDir).filter((file) => file.endsWith(".md"));
  } catch (error) {
    console.error("Error reading public directory:", error);
  }

  return (
    <main className="flex flex-col justify-center items-center min-h-screen">
      <Link href="/note-editor" className="flex text-blue-500 hover:underline mb-5">Note</Link>
      <ReadmeList files={files} />
    </main>
  );
}