'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Workstream {
  id: number;
  name: string;
  target_threshold: number;
}

interface WorkstreamsClientProps {
  workstreams: Workstream[];
  error?: string;
}

export default function WorkstreamsClient({
  workstreams,
  error,
}: WorkstreamsClientProps) {
  const searchParams = useSearchParams();
  const successParam = searchParams.get('success');
  const errorParam = searchParams.get('error');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Workstreams</h1>
      <Link href="/admin" className="text-blue-500 underline">
        Back to Dashboard
      </Link>

      {successParam && (
        <div className="mb-4 bg-green-100 text-green-800 p-2 rounded">
          Workstream created successfully!
        </div>
      )}
      {errorParam && (
        <div className="mb-4 bg-red-100 text-red-800 p-2 rounded">
          Something went wrong. Please try again.
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-100 text-red-800 p-2 rounded">
          Error: {error}
        </div>
      )}

      <div className="mt-6">
        {workstreams.length > 0 ? (
          <ul className="list-disc ml-4">
            {workstreams.map((ws) => (
              <li key={ws.id}>
                {ws.name} (Target: {ws.target_threshold}%)
              </li>
            ))}
          </ul>
        ) : (
          <p>No workstreams found.</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Add New Workstream</h2>
        <form method="POST" action="/api/workstreams/create" className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Workstream Name"
            className="border p-2 w-full"
            required
          />
          <input
            type="number"
            name="target_threshold"
            placeholder="Target Threshold (e.g., 80)"
            className="border p-2 w-full"
            required
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Add Workstream
          </button>
        </form>
      </div>
    </div>
  );
}
