import { prisma } from '$lib/server/prismaClient';

export const load = async ({ locals }) => {
  const { user } = await locals.requireLogin();
  const orders = prisma.order.findMany({
    orderBy: {
      updatedAt: 'desc'
    }
  });
  const vegetables = prisma.vegetable.findMany();
  const users = prisma.user.findMany({
    select: {
      id: true,
      name: true
    }
  });
  return { user, orders, vegetables, users };
};
