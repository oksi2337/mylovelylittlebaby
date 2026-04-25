import { z } from 'zod';

export const petInfoSchema = z.object({
  name: z
    .string()
    .min(1, '이름을 입력해주세요')
    .max(20, '이름은 20자 이하로 입력해주세요'),
  type: z.enum(['dog', 'cat', 'other'] as const),
  breed: z.string().max(50).optional(),
  age: z.number().min(0).max(20),
  gender: z.enum(['male', 'female'] as const),
  isAdopted: z.boolean(),
  adoptedAt: z.string().optional(),
  personality: z.array(z.string()).max(3),
  favoritePlace: z.enum(['park', 'window', 'sofa', 'garden', 'kitchen', 'unknown'] as const).optional(),
  messageFromOwner: z.string().max(200, '200자 이하로 입력해주세요').optional(),
});

export type PetInfoFormValues = z.infer<typeof petInfoSchema>;
