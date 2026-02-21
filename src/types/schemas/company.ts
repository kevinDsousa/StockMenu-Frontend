import { z } from 'zod'

export const createCompanySchema = z.object({
  tradeName: z.string().min(1).max(150),
  corporateName: z.string().max(150).nullable().optional(),
  cnpj: z.string().length(14),
  whatsapp: z.string().max(20).nullable().optional(),
  active: z.boolean().optional().default(true),
})

export const updateCompanySchema = createCompanySchema.partial()

export type CreateCompanySchema = z.infer<typeof createCompanySchema>
export type UpdateCompanySchema = z.infer<typeof updateCompanySchema>
