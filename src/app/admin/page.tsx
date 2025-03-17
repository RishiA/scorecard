import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  // Check for the admin_auth cookie on the server side
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get('admin_auth');

  if (!adminCookie || adminCookie.value !== 'true') {
    // Redirect to login if the cookie isn't valid
    redirect('/admin/login');
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <nav className="mb-6">
        <Link href="/admin/workstreams" className="text-blue-500 underline mr-4">
          Manage Workstreams
        </Link>
        <Link href="/admin/activities" className="text-blue-500 underline">
          Manage Activities
        </Link>
      </nav>
      <p>Welcome, Admin! Use the navigation above to manage your data.</p>
    </div>
  );
}