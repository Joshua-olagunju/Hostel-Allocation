export type PaymentStatus = 'paid' | 'unpaid'

export interface Student {
  id: string
  name: string
  email: string
  password: string
  paymentStatus: PaymentStatus
  roomId: string | null
}

export interface Room {
  id: string
  block: string
  name: string
  capacity: number
  occupants: string[]
}

export interface UserSession {
  type: 'student' | 'admin'
  id?: string
  name: string
  email: string
}

export interface AppState {
  students: Student[]
  rooms: Room[]
}
