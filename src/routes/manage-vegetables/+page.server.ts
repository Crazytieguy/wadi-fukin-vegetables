import { prisma } from '$lib/server/prismaClient';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { getValidatedFormData } from '$lib/server/actions';

const createVegetableSchema = z.object({
  name: z.string(),
  unit: z.string(),
  image: z.instanceof(File)
});

const fileToDataUrl = async (image: File) => {
  const imageBuffer = Buffer.from(await image.arrayBuffer());
  return `data:${image.type};base64,${imageBuffer.toString('base64')}`;
};

export const actions = {
  default: async ({ request, locals }) => {
    await locals.requireAdmin();
    const result = await getValidatedFormData(createVegetableSchema, request);
    if (!result.success) return result.fail;
    const { image, name, unit } = result.data;
    const imageUrl = await fileToDataUrl(image);
    await prisma.vegetable.create({ data: { name, unit, imageUrl } });
    return { success: true };
  }
} satisfies Actions;

export const load = (async ({ locals }) => {
  return {
    ...(await locals.requireAdmin()),
    vegetables: await prisma.vegetable.findMany()
  };
}) satisfies PageServerLoad;
