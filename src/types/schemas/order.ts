import { z } from 'zod'

export const createOrderSchema = z.object({
  companyId: z.string().uuid(),
  tableId: z.string().uuid().nullable().optional(),
  paymentMethodId: z.string().uuid().nullable().optional(),
  type: z.string().min(1).max(50),
  customerName: z.string().max(100).nullable().optional(),
  deliveryAddress: z.string().max(255).nullable().optional(),
  totalAmount: z.number().min(0).optional().default(0),
  invoiced: z.boolean().optional().default(false),
})

export const updateOrderSchema = createOrderSchema.partial().omit({ companyId: true })

export type CreateOrderSchema = z.infer<typeof createOrderSchema>
export type UpdateOrderSchema = z.infer<typeof updateOrderSchema>
