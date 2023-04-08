import { prisma } from '$lib/server/prismaClient';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';

const createVegetableSchema = z.object({
  name: z.string(),
  unit: z.string(),
  pricePerUnit: z.number().multipleOf(0.01).positive()
});

const fileToUrl = async (image: File) => {
  const imageBuffer = Buffer.from(await image.arrayBuffer());
  const dataUrl = `data:${image.type};base64,${imageBuffer.toString('base64')}`;
  const { public_id } = await cloudinary.uploader.upload(dataUrl, {
    folder: 'wadi-fukin-vegetables'
  });
  return cloudinary.url(public_id, {
    width: 400,
    height: 400,
    crop: 'fill'
  });
};

export const actions = {
  default: async ({ request, locals }) => {
    await locals.requireAdmin();
    const formData = await request.formData();
    const form = await superValidate(formData, createVegetableSchema);
    if (!form.valid) {
      return fail(400, { form });
    }
    const image = formData.get('image');
    if (!(image instanceof File)) {
      return fail(400, { form });
    }
    const { name, unit, pricePerUnit } = form.data;
    const imageUrl = await fileToUrl(image);
    await prisma.vegetable.create({ data: { name, unit, imageUrl, pricePerUnit } });
    return { form };
  }
};

export const load = async (event) => {
  const form = superValidate(event, createVegetableSchema);
  return {
    ...(await event.locals.requireAdmin()),
    vegetables: prisma.vegetable.findMany(),
    form
  };
};
