import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { mockRooms } from "../data/rooms";
import { mockStudents } from "../data/students";
import type { AppState, Room, Student, UserSession } from "../types";

const STORAGE_KEY = "hostel-allocation-state";
const AUTH_KEY = "hostel-allocation-auth";

interface AppContextValue {
  students: Student[];
  rooms: Room[];
  user: UserSession | null;
  loginStudent: (email: string, password: string) => string | null;
  loginAdmin: (email: string, password: string) => string | null;
  logout: () => void;
  selectRoom: (roomId: string) => void;
  togglePaymentStatus: (studentId: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const ADMIN_EMAIL = "admin@hostel.com";
const ADMIN_PASSWORD = "admin123";

const initialState: AppState = {
  students: mockStudents,
  rooms: mockRooms,
};

const buildStudentSession = (student: Student): UserSession => ({
  type: "student",
  id: student.id,
  name: student.name,
  email: student.email,
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = loadFromStorage<AppState>(STORAGE_KEY);
    if (!saved?.students) return initialState.students;

    const savedMap = new Map(
      saved.students.map((student) => [student.id, student]),
    );
    const merged = [...saved.students];

    for (const student of mockStudents) {
      if (!savedMap.has(student.id)) {
        merged.push(student);
      }
    }

    return merged;
  });
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = loadFromStorage<AppState>(STORAGE_KEY);
    if (!saved?.rooms) return initialState.rooms;

    const savedMap = new Map(saved.rooms.map((room) => [room.id, room]));
    const merged = [...saved.rooms];

    for (const room of mockRooms) {
      if (!savedMap.has(room.id)) {
        merged.push(room);
      }
    }

    return merged;
  });
  const [user, setUser] = useState<UserSession | null>(() => {
    return loadFromStorage<UserSession>(AUTH_KEY);
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEY, { students, rooms });
  }, [students, rooms]);

  useEffect(() => {
    if (user) {
      saveToStorage(AUTH_KEY, user);
    } else {
      window.localStorage.removeItem(AUTH_KEY);
    }
  }, [user]);

  const loginStudent = (email: string, password: string) => {
    const student = students.find((entry) => entry.email === email.trim());
    if (!student) return "No student account found for this email.";
    if (student.password !== password) return "Incorrect student password.";
    if (student.paymentStatus !== "paid")
      return "You have not paid your fees. Please contact administration.";
    const session = buildStudentSession(student);
    setUser(session);
    return null;
  };

  const loginAdmin = (email: string, password: string) => {
    if (email.trim() !== ADMIN_EMAIL) return "Admin email does not match.";
    if (password !== ADMIN_PASSWORD) return "Admin password is incorrect.";
    setUser({ type: "admin", name: "Hostel Admin", email: ADMIN_EMAIL });
    return null;
  };

  const logout = () => {
    setUser(null);
  };

  const selectRoom = (roomId: string) => {
    if (!user || user.type !== "student") return;
    const studentId = user.id;
    if (!studentId) return;

    setRooms((currentRooms) => {
      const updatedRooms = currentRooms.map((room) => {
        if (room.occupants.includes(studentId) && room.id !== roomId) {
          return {
            ...room,
            occupants: room.occupants.filter((id) => id !== studentId),
          };
        }
        if (room.id === roomId) {
          const alreadyAssigned = room.occupants.includes(studentId);
          if (!alreadyAssigned && room.occupants.length < room.capacity) {
            return { ...room, occupants: [...room.occupants, studentId] };
          }
        }
        return room;
      });
      return updatedRooms;
    });

    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === studentId ? { ...student, roomId } : student,
      ),
    );
  };

  const togglePaymentStatus = (studentId: string) => {
    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === studentId
          ? {
              ...student,
              paymentStatus:
                student.paymentStatus === "paid" ? "unpaid" : "paid",
            }
          : student,
      ),
    );
  };

  const value = useMemo(
    () => ({
      students,
      rooms,
      user,
      loginStudent,
      loginAdmin,
      logout,
      selectRoom,
      togglePaymentStatus,
    }),
    [students, rooms, user],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
