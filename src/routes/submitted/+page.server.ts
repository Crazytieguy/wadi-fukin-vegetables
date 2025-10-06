import { prisma } from '$lib/server/prismaClient';

export const load = async ({ locals }) => {
  const { user } = await locals.requireLogin();

  const lastOrder = await prisma.order.findFirst({
    orderBy: { createdAt: 'desc' },
    where: { isActive: true },
    include: {
      userOrderVegetables: {
        where: {
          userId: user.id,
          quantity: { gt: 0 }
        },
        include: {
          vegetable: true
        }
      }
    }
  });

  return {
    order: lastOrder
  };
};
