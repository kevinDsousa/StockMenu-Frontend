import type { Company } from '@/entities'

export interface CreateCompanyDto {
  tradeName: string
  corporateName?: string | null
  cnpj: string
  whatsapp?: string | null
  active?: boolean
}

export interface UpdateCompanyDto {
  tradeName?: string
  corporateName?: string | null
  cnpj?: string
  whatsapp?: string | null
  active?: boolean
}

export type CompanyListResponse = Company[]
