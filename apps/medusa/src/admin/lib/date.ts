import { format } from 'date-fns'

export function formatDate(
  date: string | Date | undefined,
  date_format: string = 'yyyy-MM-dd'
) {
  if (!date) {
    return 'unknown'
  }
  const value = new Date(date)
  value.setMinutes(value.getMinutes() - value.getTimezoneOffset())
  return format(value, date_format)
}
