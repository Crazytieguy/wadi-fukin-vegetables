export const load = async ({ locals }) => {
  return await locals.requireAdmin();
};
