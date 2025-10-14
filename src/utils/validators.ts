import { ValidationResult } from '@/types/common'

export function isValidAddress(address: string): ValidationResult {
  const pattern = /^cosmwasm[a-z0-9]{38}$/
  if (!pattern.test(address)) {
    return {
      valid: false,
      error: 'Invalid address format'
    }
  }
  return { valid: true }
}

export function isValidAmount(amount: string): ValidationResult {
  const num = parseFloat(amount)
  if (isNaN(num) || num <= 0) {
    return {
      valid: false,
      error: 'Amount must be a positive number'
    }
  }
  if (num < 1000) {
    return {
      valid: false,
      error: 'Amount must be at least 1000'
    }
  }
  if (num > 1000000) {
    return {
      valid: false,
      error: 'Amount must not exceed 1000000'
    }
  }
  return { valid: true }
}

export function isValidLuckyNumber(number: number): ValidationResult {
  if (number < 0 || number > 999) {
    return {
      valid: false,
      error: 'Lucky number must be between 0 and 999'
    }
  }
  return { valid: true }
}

export function isValidRandomSeed(seed: string): ValidationResult {
  if (seed.length < 1 || seed.length > 100) {
    return {
      valid: false,
      error: 'Random seed must be between 1 and 100 characters'
    }
  }
  return { valid: true }
}

export function isValidCommitmentHash(hash: string): ValidationResult {
  const pattern = /^[a-f0-9]{64}$/
  if (!pattern.test(hash)) {
    return {
      valid: false,
      error: 'Invalid commitment hash format'
    }
  }
  return { valid: true }
}
