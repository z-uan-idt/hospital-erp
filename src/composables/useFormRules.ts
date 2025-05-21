export const useFormRules = () => {
  return {
    required: (value: string) => {
      return !!value || 'Vui lòng nhập thông tin'
    },
  }
}
