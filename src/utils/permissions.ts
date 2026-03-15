import type { AuthUser } from '@/store/auth'

export type AppRole = AuthUser['role']

export function canAccessCompanies(role: AppRole | undefined): boolean {
  return role === 'SUPER_ADMIN'
}

export function canManageCompanyUsers(role: AppRole | undefined): boolean {
  return role === 'COMPANY_ADMIN'
}

export function mustUseOwnCompany(role: AppRole | undefined): boolean {
  return role === 'COMPANY_ADMIN' || role === 'WAITER'
}

export function getNoPermissionMessage(page: 'companies' | 'users'): string {
  switch (page) {
    case 'companies':
      return 'Esta ação é restrita ao super administrador. Você não tem permissão para realizá-la.'
    case 'users':
      return 'Esta área é restrita ao administrador da empresa. Você não tem permissão para acessá-la.'
    default:
      return 'Você não tem permissão para acessar este recurso.'
  }
}

export function getNoCompanyMessage(): string {
  return 'Você não está vinculado a uma empresa. Entre em contato com o administrador para acessar os dados.'
}

export function getCompanyIdForData(user: AuthUser | null): string | undefined {
  if (!user) return undefined
  if (mustUseOwnCompany(user.role)) {
    return user.companyId ?? undefined
  }
  return user.companyId ?? undefined
}
