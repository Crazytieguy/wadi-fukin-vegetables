import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const { session } = await parent();
  if (!session?.user) throw error(401, 'not signed in');
  if (!session?.user.isAdmin) throw error(403, 'not an admin');
  return {};
};
