import { prisma } from '$lib/server/prismaClient';

export const load = async ({ locals }) => {
  const { user } = await locals.requireLogin();
  const [orders, vegetables, users] = await Promise.all([
    prisma.order.findMany({
      orderBy: {
        updatedAt: 'desc'
      }
    }),
    prisma.vegetable.findMany(),
    prisma.user.findMany({
      select: {
        id: true,
        name: true
      }
    })
  ]);
  return { user, orders, vegetables, users };
};
