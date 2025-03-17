import { supabase } from '@/lib/supabaseClient';
import { parseWorkstreams } from '@/utils/scoring';
import { getStatusStyles } from '@/utils/statusStyles';

export default async function Home() {
  // 1. Fetch data from Supabase
  const { data: workstreams, error: wsError } = await supabase
    .from('workstreams')
    .select('*');
  const { data: activities, error: actError } = await supabase
    .from('activities')
    .select('*');

  if (wsError || actError) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
        <p>Error loading data.</p>
      </div>
    );
  }

  // 2. Compute readiness for each workstream
  const scoreboard = parseWorkstreams(workstreams || [], activities || []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">JWEG Readiness Scorecard</h1>
          <a
            href="/admin"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 font-medium underline"
          >
            Admin Portal
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Scorecard Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left font-semibold text-gray-600">Workstream</th>
                <th className="py-3 text-left font-semibold text-gray-600">Target Threshold</th>
                <th className="py-3 text-left font-semibold text-gray-600">Current Status</th>
                <th className="py-3 text-left font-semibold text-gray-600">Assessment</th>
              </tr>
            </thead>
            <tbody>
              {scoreboard.map((ws) => (
                <tr key={ws.id} className="border-b last:border-none">
                  <td className="py-3">{ws.name}</td>
                  <td className="py-3">{ws.target_threshold}%</td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                        ws.color
                      )}`}
                    >
                      {ws.readiness}%
                    </span>
                  </td>
                  <td className="py-3">{ws.assessment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Evaluation Criteria Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-lg font-bold mb-2 text-gray-800">Evaluation Criteria</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>
              Expansion is recommended if at least 80% of benchmarks meet the target threshold.
            </li>
            <li>
              Expansion is cautioned if 50-79% of benchmarks meet the target and requires
              mitigation strategies.
            </li>
            <li>
              Expansion is not recommended if less than 50% of benchmarks meet the target,
              indicating significant financial or operational risks.
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
