import type { Room, Student, UserSession } from "../types";

export interface AppContextValue {
  students: Student[];
  rooms: Room[];
  user: UserSession | null;
  loginStudent: (email: string, password: string) => Promise<string | null>;
  loginAdmin: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  selectRoom: (roomId: string) => Promise<void>;
  togglePaymentStatus: (studentId: string) => Promise<void>;
}
