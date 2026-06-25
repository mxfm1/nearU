export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const months: Record<string, number> = {
  Ene: 0, Feb: 1, Mar: 2, Abr: 3, May: 4, Jun: 5,
  Jul: 6, Ago: 7, Sep: 8, Oct: 9, Nov: 10, Dic: 11,
}

export function parseEventDate(dateStr: string): Date | null {
  const parts = dateStr.split(' ')
  if (parts.length < 2) return null
  const day = parseInt(parts[0].split('-')[0], 10)
  const month = months[parts[1]]
  const year = parseInt(parts[parts.length - 1], 10)
  if (isNaN(day) || month === undefined || isNaN(year)) return null
  return new Date(year, month, day)
}
