export function formatAddress(address: string, length: number = 6): string {
  if (address.length <= length * 2) {
    return address
  }
  return `${address.slice(0, length)}...${address.slice(-length)}`
}

export function formatAmount(amount: string, decimals: number = 6): string {
  const num = parseFloat(amount)
  if (isNaN(num)) return '0'
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num)
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
}

export function formatPhase(phase: string): string {
  const phaseMap: Record<string, string> = {
    'commitment': '承诺阶段',
    'reveal': '揭秘阶段',
    'settlement': '结算阶段'
  }
  return phaseMap[phase] || phase
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`
}
