import Link from "next/link";

export default function ReadmeNav() {
  return (
    <div className="w-full max-w-4xl px-6 pt-6">
      <Link href="/" className="text-blue-600 hover:underline">
        ← Back to Home
      </Link>
    </div>
  );
}