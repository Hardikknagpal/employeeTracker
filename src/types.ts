export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  role: string
  isPresent: boolean
  department?: string
}

export interface EmployeeStats {
  total: number
  present: number
  absent: number
  departments: { [key: string]: number }
}
