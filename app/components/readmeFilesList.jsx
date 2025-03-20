import Link from "next/link";

export default function ReadmeList({ files }) {
  return (
    <div className="w-full max-w-xl p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Markdown Files</h1>
      {files.length > 0 ? (
        <ul className="space-y-3">
          {files.map((file) => (
            <li key={file}>
              <Link href={`/readme/${file}`} className="text-blue-500 hover:underline">
                {file}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No markdown files found.</p>
      )}
    </div>
  );
}