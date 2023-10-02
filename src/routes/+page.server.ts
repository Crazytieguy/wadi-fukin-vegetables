import { prisma } from '$lib/server/prismaClient';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const getLastOrderAndSchema = async (userId: string) => {
  const lastOrder = await prisma.order.findFirst({
    orderBy: { createdAt: 'desc' },
    include: {
      orderVegetables: { include: { vegetable: true } },
      userOrderVegetables: { where: { userId } }
    }
  });
  if (!lastOrder) {
    return { lastOrder: null, schema: null };
  }
  const quantities = Object.fromEntries(
    lastOrder.userOrderVegetables.map(({ vegetableId, quantity }) => [vegetableId, quantity])
  );
  const schema = z
    .object({
      orderId: z.literal(lastOrder.id).default(lastOrder.id),
      ...Object.fromEntries(
        lastOrder.orderVegetables.map(({ vegetableId, vegetable }) => [
          vegetableId,
          z
            .number()
            .nonnegative()
            .multipleOf({ Kg: 0.5, G: 50, Unit: 1 }[vegetable.unit])
            .default(quantities[vegetableId] || 0)
        ])
      )
    })
    .catchall(z.number());
  return { lastOrder, schema };
};

export const load = async ({ request, locals }) => {
  const { user } = await locals.requireLogin();
  const { lastOrder, schema } = await getLastOrderAndSchema(user.id);
  return lastOrder
    ? { user, lastOrder, form: await superValidate(request, schema) }
    : { user, lastOrder };
};

export const actions = {
  default: async ({ request, locals }) => {
    const { user } = await locals.requireLogin();
    const { lastOrder, schema } = await getLastOrderAndSchema(user.id);
    if (!lastOrder || !lastOrder.isActive) {
      return fail(400, { message: 'No order is currently active.' });
    }
    const form = await superValidate(request, schema);
    if (!form.valid) {
      return fail(400, { form });
    }
    const { orderId, ...vegetableAmounts } = form.data;
    const promises = Object.entries(vegetableAmounts).map(async ([vegetableId, quantity]) => {
      const userId_orderId_vegetableId = {
        userId: user.id,
        orderId,
        vegetableId
      };
      return await prisma.userOrderVegetable.upsert({
        where: { userId_orderId_vegetableId },
        update: { quantity },
        create: {
          ...userId_orderId_vegetableId,
          quantity
        }
      });
    });
    await Promise.all(promises);
    throw redirect(303, '/submitted');
  }
};
