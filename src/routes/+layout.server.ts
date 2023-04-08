export const load = async ({ locals }) => {
  return {
    session: locals.getSession()
  };
};
