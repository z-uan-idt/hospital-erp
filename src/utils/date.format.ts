import { format, parseISO, isValid, differenceInYears } from 'date-fns'

export const formatDate = (
  date: string | Date,
  formatString = 'dd/MM/yyyy'
): string => {
  if (!date) return ''
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return isValid(parsedDate) ? format(parsedDate, formatString) : ''
}

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm')
}

export const calculateAge = (birthDate: string | Date): number => {
  if (!birthDate) return 0
  const parsedDate =
    typeof birthDate === 'string' ? parseISO(birthDate) : birthDate
  return isValid(parsedDate) ? differenceInYears(new Date(), parsedDate) : 0
}

export const isValidDate = (date: string | Date): boolean => {
  if (!date) return false
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return isValid(parsedDate)
}
