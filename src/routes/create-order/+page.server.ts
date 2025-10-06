import { prisma } from '$lib/server/prismaClient';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';

const createOrderSchema = z.object({
  vegetableIds: z.array(z.string()).nonempty()
});

export const actions = {
  default: async ({ request, locals }) => {
    await locals.requireAdmin();
    const form = await superValidate(request, createOrderSchema);
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
    redirect(303, '/submitted');
  }
};

export const load = async ({ request, locals }) => {
  const requireAdmin = await locals.requireAdmin();
  const mostRecentOrder = await prisma.order.findFirst({
    orderBy: { createdAt: 'desc' },
    include: { orderVegetables: true }
  });
  if (mostRecentOrder?.isActive) {
    redirect(303, '/order-history');
  }
  let defaultVegetables =
    mostRecentOrder?.orderVegetables.map(({ vegetableId }) => vegetableId) || [];
  
  if (mostRecentOrder) {
    const recentlyUpdatedVegetables = await prisma.vegetable.findMany({
      where: {
        hidden: false,
        updatedAt: {
          gt: mostRecentOrder.createdAt
        }
      },
      select: { id: true }
    });
    
    const recentlyUpdatedIds = recentlyUpdatedVegetables.map(v => v.id);
    defaultVegetables = [...new Set([...defaultVegetables, ...recentlyUpdatedIds])];
  }
  
  const createOrderSchemaWithDefault = z.object({
    vegetableIds: createOrderSchema.shape.vegetableIds.default(
      defaultVegetables as [string, ...string[]]
    )
  });
  const [vegetables, form] = await Promise.all([
    prisma.vegetable.findMany({
      where: { hidden: false }
    }),
    superValidate(request, createOrderSchemaWithDefault)
  ]);

  return {
    ...requireAdmin,
    vegetables,
    mostRecentOrder,
    form
  };
};
