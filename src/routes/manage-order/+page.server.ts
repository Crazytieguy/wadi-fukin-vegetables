import { prisma } from '$lib/server/prismaClient';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';

const createOrderSchema = z.object({
  vegetableIds: z.array(z.string()).nonempty()
});
const closeOrderSchema = z.object({
  id: z.string()
});

export const actions = {
  createOrder: async ({ request, locals }) => {
    await locals.requireAdmin();
    const form = await superValidate(request, createOrderSchema, {
      id: 'create-order-form'
    });
    if (!form.valid) {
      return fail(400, { form });
    }
    await prisma.order.create({
      data: {
        orderVegetables: {
          create: form.data.vegetableIds.map((id) => ({
            vegetableId: id
          }))
        }
      }
    });
    return { form };
  },
  closeOrder: async ({ request, locals }) => {
    await locals.requireAdmin();
    const form = await superValidate(request, closeOrderSchema, {
      id: 'close-order-form'
    });
    if (!form.valid) {
      return fail(400, { form });
    }
    await prisma.order.update({
      data: { isActive: false },
      where: { id: form.data.id }
    });
    return { form };
  }
};

export const load = async ({ request, locals }) => {
  const requireAdmin = await locals.requireAdmin();
  const mostRecentOrder = await prisma.order.findFirst({
    orderBy: { createdAt: 'desc' },
    include: { orderVegetables: true }
  });
  const defaultVegetables =
    mostRecentOrder?.orderVegetables.map(({ vegetableId }) => vegetableId) || [];
  const createOrderSchemaWithDefault = z.object({
    vegetableIds: createOrderSchema.shape.vegetableIds.default(
      defaultVegetables as [string, ...string[]]
    )
  });
  return {
    ...requireAdmin,
    vegetables: prisma.vegetable.findMany(),
    mostRecentOrder,
    createOrderForm: superValidate(request, createOrderSchemaWithDefault, {
      id: 'create-order-form'
    }),
    closeOrderForm: superValidate(request, closeOrderSchema, { id: 'close-order-form' })
  };
};
