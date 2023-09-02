import { prisma } from '$lib/server/prismaClient';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const updateUserSchema = z.object({
  userId: z.string(),
  isAdmin: z.boolean().default(undefined as unknown as boolean)
});

export const actions = {
  default: async ({ request, locals }) => {
    const { user } = await locals.requireAdmin();
    const form = await superValidate(request, updateUserSchema);
    if (!form.valid) {
      return fail(400, { form });
    }
    if (form.data.userId === user.id) {
      return fail(400, { form: { ...form, message: 'You cannot change your own admin status' } });
    }
    await prisma.user.update({
      where: { id: form.data.userId },
      data: { isAdmin: form.data.isAdmin }
    });
    return { form };
  }
};

export const load = async ({ request, locals }) => {
  const { user } = await locals.requireAdmin();
  const users = await prisma.user.findMany({ orderBy: { name: 'asc' } });
  return {
    user: { id: user.id },
    users,
    form: superValidate(request, updateUserSchema)
  };
};
