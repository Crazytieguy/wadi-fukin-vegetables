import { prisma } from '$lib/server/prismaClient';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { error, fail, redirect } from '@sveltejs/kit';

const closeOrderSchema = z.object({
  id: z.string()
});

export const actions = {
  default: async ({ request, locals }) => {
    await locals.requireAdmin();
    const form = await superValidate(request, closeOrderSchema);
    if (!form.valid) {
      return fail(400, { form });
    }
    await prisma.order.update({
      data: { isActive: false },
      where: { id: form.data.id }
    });
    throw redirect(303, '/submitted');
  }
};

export const load = async ({ request, locals, params }) => {
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
  if (!order) {
    throw error(404, 'Order not found');
  }
  return { order, form: superValidate(request, closeOrderSchema) };
};
