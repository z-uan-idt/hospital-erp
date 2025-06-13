export const useFormRules = () => {
  return {
    required: (value: string | number) => {
      if ((typeof value === 'number' && value) || value === 0) return true
      return !!value || 'Vui lòng nhập thông tin'
    },
  }
}
