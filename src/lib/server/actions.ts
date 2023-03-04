import { fail, type ActionFailure } from '@sveltejs/kit';
import type { z } from 'zod';

type ValidationResult<T> =
  | {
      success: false;
      fail: ActionFailure<{ errors: z.ZodIssue[] }>;
    }
  | {
      success: true;
      data: T;
    };

export const getValidatedFormData = async <T extends z.ZodTypeAny>(
  schema: T,
  request: Request
): Promise<ValidationResult<z.infer<T>>> => {
  const rawFormData = await request.formData();
  const formData = Object.fromEntries(rawFormData);
  const parseResult = schema.safeParse(formData);
  return parseResult.success
    ? { success: true, data: parseResult.data }
    : { success: false, fail: fail(400, { errors: parseResult.error.errors }) };
};
