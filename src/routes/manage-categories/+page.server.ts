import { prisma } from '$lib/server/prismaClient';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const updateCategoriesSchema = z.object({
  categories: z
    .object({
      id: z.string(),
      category: z.string().nullable()
    })
    .array()
});

export const actions = {
  default: async ({ request, locals }) => {
    await locals.requireAdmin();
    const form = await superValidate(request, updateCategoriesSchema);
    if (!form.valid) {
      return fail(400, { form });
    }
    for (const { id, category } of form.data.categories) {
      if (category) {
        await prisma.vegetable.update({
          where: { id },
          data: { category }
        });
      }
    }
    return { form };
  }
};

export const load = async ({ locals }) => {
  await locals.requireAdmin();
  const vegetables = await prisma.vegetable.findMany({
    where: { hidden: false },
    orderBy: { createdAt: 'asc' }
  });
  return {
    vegetables,
    form: superValidate({ categories: vegetables }, updateCategoriesSchema)
  };
};
