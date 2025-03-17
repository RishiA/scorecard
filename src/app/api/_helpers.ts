import { cookies } from 'next/headers';

/**
 * Checks if the current request includes the admin_auth cookie.
 * Returns true if it's present.
 */
export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const c = cookieStore.get('admin_auth');
  return c?.value === 'true';
}