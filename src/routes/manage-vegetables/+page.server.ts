import { prisma } from '$lib/server/prismaClient';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';

const createVegetableSchema = z.object({
  name: z.string(),
  unit: z.enum(['Kg', 'G', 'Unit']),
  pricePerUnit: z.number().multipleOf(0.01).positive()
});

const uploadFile = async (image: File) => {
  const imageBuffer = Buffer.from(await image.arrayBuffer());
  const dataUrl = `data:${image.type};base64,${imageBuffer.toString('base64')}`;
  return await cloudinary.uploader.upload(dataUrl, {
    folder: 'wadi-fukin-vegetables'
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
    const { public_id, width, height } = await uploadFile(image);
    await prisma.vegetable.create({
      data: {
        name,
        unit,
        pricePerUnit,
        imagePublicId: public_id,
        imageOriginalHeight: height,
        imageOriginalWidth: width
      }
    });
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
