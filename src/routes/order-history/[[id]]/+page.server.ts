import { prisma } from '$lib/server/prismaClient';

export const load = async ({ locals, params }) => {
  await locals.requireLogin();
  const order = params.id
    ? prisma.order.findUnique({
        where: { id: params.id },
        include: { userOrderVegetables: true }
      })
    : prisma.order.findFirst({
        orderBy: { updatedAt: 'desc' },
        include: { userOrderVegetables: true }
      });
  return { order };
};
