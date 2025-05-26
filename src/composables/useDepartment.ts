import type { IDepartment } from '~/types/department.types'

export const useDepartment = () => {
  const departments = ref<IDepartment[]>([])
  const department = ref<IDepartment | null>({
    id: 1,
    code: '123',
    name: 'Khoa 1',
    dean: null,
    description: 'Khoa 1',
    created_at: '2021-01-01',
    updated_at: '2021-01-01',
    updated_by: null,
    created_by: null,
    staff_count: 10,
    warehouse_count: 10,
    direct_staffs: [
      {
        code: '123',
        full_name: 'Nhân viên 1',
        gender: {
          label: 'Nam',
          value: 'MALE',
        },
        role: {
          label: 'Nhân viên',
          value: 'STAFF',
        },
        phone_number: '0909090909',
        email: 'test@test.com',
        avatar: 'https://via.placeholder.com/150',
        avatar_file: null,
        is_active: true,
        created_at: '2021-01-01',
        updated_at: '2021-01-01',
        updated_by: null,
      },
    ],
    direct_warehouses: [],
  })

  return {
    departments,
    department,
  }
}
