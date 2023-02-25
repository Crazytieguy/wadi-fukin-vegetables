import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const { session } = await parent();
  if (!session?.user) throw error(401, 'not signed in');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!session?.user.isAdmin) throw error(403, 'not an admin');
  return {};
};
