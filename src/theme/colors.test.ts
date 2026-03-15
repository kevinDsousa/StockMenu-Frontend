import { describe, it, expect } from 'vitest'
import {
  BRAND_PRIMARY,
  SUCCESS,
  ERROR,
  themeColors,
} from './colors'

describe('colors', () => {
  it('deve exportar constantes em formato hex', () => {
    expect(BRAND_PRIMARY).toMatch(/^#[0-9a-fA-F]{6}$/)
    expect(SUCCESS).toMatch(/^#[0-9a-fA-F]{6}$/)
    expect(ERROR).toMatch(/^#[0-9a-fA-F]{6}$/)
  })

  it('themeColors deve conter chaves semânticas esperadas', () => {
    expect(themeColors.brandPrimary).toBe(BRAND_PRIMARY)
    expect(themeColors.success).toBe(SUCCESS)
    expect(themeColors.error).toBe(ERROR)
  })
})
