import {
  format,
  parseISO,
  isValid,
  differenceInYears,
  differenceInDays,
  differenceInHours,
  differenceInMonths,
} from 'date-fns'

export const formatDate = (date: string | Date, formatString = 'dd/MM/yyyy'): string => {
  if (!date) return ''
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return isValid(parsedDate) ? format(parsedDate, formatString) : ''
}

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'HH:mm:ss dd/MM/yyyy')
}

export const calculateAge = (birthDate: string | Date): number => {
  if (!birthDate) return 0
  const parsedDate = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate
  return isValid(parsedDate) ? differenceInYears(new Date(), parsedDate) : 0
}

export const isValidDate = (date: string | Date): boolean => {
  if (!date) return false
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return isValid(parsedDate)
}

export const calculateDateDifference = (date1: string | Date, date2: string | Date) => {
  if (!date1 || !date2) return null

  date1 = new Date(date1)
  date1.setHours(0, 0, 0, 0)
  date2 = new Date(date2)
  date2.setHours(0, 0, 0, 0)

  const parsedDate1 = typeof date1 === 'string' ? parseISO(date1) : date1
  const parsedDate2 = typeof date2 === 'string' ? parseISO(date2) : date2

  if (!isValid(parsedDate1) || !isValid(parsedDate2)) return null

  if (parsedDate1 < parsedDate2) {
    return {
      is_expired: true,
      text: 'Hết hạn',
      item: {
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        decimal: {
          YEAR: 0,
          MONTH: 0,
          DAY: 0,
        },
      },
    }
  }

  const [laterDate, earlierDate] = [parsedDate1, parsedDate2]

  const startDate = new Date(earlierDate.getFullYear(), earlierDate.getMonth(), earlierDate.getDate(), 0, 0, 0)
  const endDate = new Date(laterDate.getFullYear(), laterDate.getMonth(), laterDate.getDate() + 1, 0, 0, 0)

  const totalMonths = differenceInMonths(endDate, startDate)
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  // Tính toán ngày còn lại sau khi trừ năm và tháng
  const afterMonthsDate = new Date(
    startDate.getFullYear() + years,
    startDate.getMonth() + months,
    startDate.getDate(),
    0,
    0,
    0
  )

  const remainingDays = differenceInDays(endDate, afterMonthsDate)
  const totalDays = differenceInDays(endDate, startDate)

  const parts: string[] = []
  const objs = {
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    decimal: {
      YEAR: +(totalMonths / 12).toFixed(2),
      MONTH: totalMonths,
      DAY: totalDays,
    },
  }

  if (years > 0) {
    objs.years = years
    parts.push(`${years} năm`)
  }
  if (months > 0) {
    objs.months = months
    parts.push(`${months} tháng`)
  }
  if (remainingDays > 0) {
    objs.days = remainingDays
    parts.push(`${remainingDays} ngày`)
  }

  // Tính giờ chỉ khi không có ngày/tháng/năm
  if (parts.length === 0) {
    const hours = differenceInHours(laterDate, earlierDate)
    if (hours > 0) {
      objs.hours = hours
      parts.push(`${hours} giờ`)
    }
  }

  if (parts.length === 0) {
    return {
      text: 'Ngày cuối cùng',
      item: objs,
    }
  }

  return {
    text: parts.join(' '),
    item: objs,
  }
}
