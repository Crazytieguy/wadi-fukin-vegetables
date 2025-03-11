import { prisma } from '$lib/server/prismaClient';
import { fail } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const createVegetableSchema = z.object({
  replaceId: z.string().optional(),
  name: z.string(),
  unit: z.enum(['Kg', 'G', 'Unit']),
  pricePerUnit: z.number().multipleOf(0.01).positive(),
  sellerName: z.string(),
  category: z.string()
});

const deleteVegetablesSchema = z.object({
  vegetableIds: z.array(z.string())
});

const uploadFile = async (image: File) => {
  const imageBuffer = Buffer.from(await image.arrayBuffer());
  const dataUrl = `data:${image.type};base64,${imageBuffer.toString('base64')}`;
  const { public_id, width, height } = await cloudinary.uploader.upload(dataUrl, {
    folder: 'wadi-fukin-vegetables'
  });
  return {
    imagePublicId: public_id,
    imageOriginalWidth: width,
    imageOriginalHeight: height
  };
};

export const actions = {
  create: async ({ request, locals }) => {
    await locals.requireAdmin();
    const formData = await request.formData();
    const form = await superValidate(formData, createVegetableSchema);
    if (!form.valid) {
      return fail(400, { form });
    }

    const { replaceId, ...data } = form.data;
    data.sellerName = data.sellerName.trim();
    data.name = data.name.trim();
    data.category = data.category.trim();
    const oldVegetable = replaceId
      ? await prisma.vegetable.update({
          where: { id: replaceId },
          data: { hidden: true },
          select: {
            createdAt: true,
            imagePublicId: true,
            imageOriginalWidth: true,
            imageOriginalHeight: true
          }
        })
      : undefined;
    const image = formData.get('image');
    const newImageInfo =
      image instanceof File && image.size > 0 ? await uploadFile(image) : undefined;
    const imageInfo = newImageInfo || oldVegetable;
    if (!imageInfo) {
      return fail(400, { form });
    }
    await prisma.vegetable.create({
      data: {
        ...data,
        ...imageInfo,
        createdAt: oldVegetable?.createdAt
      }
    });
    return { form };
  },

  delete: async ({ request, locals }) => {
    await locals.requireAdmin();

    const deleteForm = await superValidate(request, deleteVegetablesSchema, { id: 'delete' });

    if (!deleteForm.valid) {
      return fail(400, { deleteForm });
    }

    const { vegetableIds } = deleteForm.data;

    if (vegetableIds.length === 0) {
      return fail(400, { deleteForm, error: 'No vegetables selected' });
    }

    await prisma.vegetable.updateMany({
      where: {
        id: {
          in: vegetableIds
        }
      },
      data: {
        hidden: true
      }
    });

    return { deleteForm };
  }
};

export const load = async (event) => {
  const form = superValidate(event, createVegetableSchema);
  const deleteForm = superValidate(event, deleteVegetablesSchema, { id: 'delete' });

  return {
    ...(await event.locals.requireAdmin()),
    vegetables: prisma.vegetable.findMany({
      where: { hidden: false },
      orderBy: { createdAt: 'asc' }
    }),
    form,
    deleteForm
  };
};
