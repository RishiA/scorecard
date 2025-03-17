'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface ActivitiesClientProps {
  activities: any[];
  workstreams: any[];
  error?: string;
}

export default function ActivitiesClient({
  activities,
  workstreams,
  error,
}: ActivitiesClientProps) {
  // Read query params from the URL
  const searchParams = useSearchParams();
  const successParam = searchParams.get('success');
  const errorParam = searchParams.get('error');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Activities</h1>
      <Link href="/admin" className="text-blue-500 underline">
        Back to Dashboard
      </Link>

      {/* Display success/error alerts */}
      {successParam && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
          Activity created successfully!
        </div>
      )}
      {errorParam && (
        <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">
          Something went wrong. Please try again.
        </div>
      )}
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">
          Error: {error}
        </div>
      )}

      {/* List existing activities */}
      <div className="mt-6">
        {activities.length > 0 ? (
          <ul className="list-disc ml-4">
            {activities.map((act: any) => (
              <li key={act.id}>
                {act.name} (Workstream: {act.workstreams ? act.workstreams.name : act.workstream_id}, Weight: {act.weight}, Actual Points: {act.actual_points})
              </li>
            ))}
          </ul>
        ) : (
          <p>No activities found.</p>
        )}
      </div>

      {/* Add new activity form */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Add New Activity</h2>
        <form method="POST" action="/api/activities/create" className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Activity Name"
            className="border p-2 w-full"
            required
          />
          <select name="workstream_id" className="border p-2 w-full" required>
            <option value="">Select Workstream</option>
            {workstreams.map((ws: any) => (
              <option key={ws.id} value={ws.id}>
                {ws.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="weight"
            placeholder="Weight (%)"
            className="border p-2 w-full"
            required
          />
          <input
            type="number"
            name="actual_points"
            placeholder="Actual Points"
            className="border p-2 w-full"
            required
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Add Activity
          </button>
        </form>
      </div>
    </div>
  );
}
