import { describe, it, expect } from 'vitest'
import { extractApiErrorMessage } from './api-error'

describe('extractApiErrorMessage', () => {
  it('deve retornar fallback quando erro não é AxiosError', () => {
    expect(extractApiErrorMessage(null)).toBe('Ocorreu um erro. Tente novamente.')
    expect(extractApiErrorMessage(undefined)).toBe('Ocorreu um erro. Tente novamente.')
    expect(extractApiErrorMessage('string')).toBe('Ocorreu um erro. Tente novamente.')
    expect(extractApiErrorMessage(new Error('outro'))).toBe('Ocorreu um erro. Tente novamente.')
  })

  it('deve usar fallback customizado quando erro não é AxiosError', () => {
    expect(extractApiErrorMessage(123, 'Erro customizado')).toBe('Erro customizado')
  })

  it('deve retornar message de response.data quando existir', () => {
    const error = {
      response: { data: { message: 'CNPJ já cadastrado' } },
      message: 'Request failed',
    }
    expect(extractApiErrorMessage(error)).toBe('CNPJ já cadastrado')
  })

  it('deve retornar primeiro item de errors quando message não existir', () => {
    const error = {
      response: { data: { errors: ['Campo tradeName é obrigatório', 'Campo cnpj inválido'] } },
    }
    expect(extractApiErrorMessage(error)).toBe('Campo tradeName é obrigatório')
  })

  it('deve retornar error.message quando data não tiver message nem errors', () => {
    const error = { response: { data: {} }, message: 'Network Error' }
    expect(extractApiErrorMessage(error)).toBe('Network Error')
  })

  it('deve retornar fallback quando data.message não for string', () => {
    const error = {
      response: { data: { message: 123 } },
      message: 'Request failed',
    }
    expect(extractApiErrorMessage(error)).toBe('Request failed')
  })
})
