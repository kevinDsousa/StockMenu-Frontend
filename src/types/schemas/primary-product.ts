import { z } from 'zod'

export const createPrimaryProductSchema = z.object({
  companyId: z.string().uuid(),
  name: z.string().min(1).max(100),
  currentStock: z.number().min(0).optional().default(0),
  unit: z.string().min(1).max(20),
  lowStockAlert: z.number().min(0).nullable().optional(),
  expirationDate: z.string(),
  productType: z.string().max(50).nullable().optional(),
})

export const updatePrimaryProductSchema = createPrimaryProductSchema.partial().omit({ companyId: true })

export type CreatePrimaryProductSchema = z.infer<typeof createPrimaryProductSchema>
export type UpdatePrimaryProductSchema = z.infer<typeof updatePrimaryProductSchema>
