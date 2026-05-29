import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { mockRooms } from "../data/rooms";
import { loginStudent as apiLoginStudent, loginAdmin as apiLoginAdmin } from "../api/auth";
import { getStudents } from "../api/students";
import type { AppState, Room, Student, UserSession } from "../types";

const STORAGE_KEY = "hostel-allocation-state";
const AUTH_KEY = "hostel-allocation-auth";

interface AppContextValue {
  students: Student[];
  rooms: Room[];
  user: UserSession | null;
  loginStudent: (email: string, password: string) => Promise<string | null>;
  loginAdmin: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  selectRoom: (roomId: string) => void;
  togglePaymentStatus: (studentId: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const initialState: AppState = {
  students: [],
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
    return saved.students;
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

  const loginStudent = async (email: string, password: string) => {
    try {
      const res = await apiLoginStudent({ email, password });
      const student = res.data.student;
      if (!student) {
        return "Student login failed.";
      }
      const session: UserSession = {
        type: "student",
        id: student._id || student.id,
        name: student.name,
        email: student.email,
      };
      setUser(session);
      return null;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data?.message || "Student login failed.";
      }
      return "Student login failed.";
    }
  };

  const loginAdmin = async (email: string, password: string) => {
    try {
      const res = await apiLoginAdmin({ email, password });
      const admin = res.data.admin;
      if (!admin) {
        return "Admin login failed.";
      }
      setUser({ type: "admin", name: "Hostel Admin", email: admin.email });

      // Fetch real students from backend for admin view
      try {
        const studentsRes = await getStudents();
        const fetched: any[] = studentsRes.data.students || [];
        const mapped = fetched.map((s) => ({
          id: s._id || s.id,
          name: s.name || "",
          email: s.email || "",
          password: "",
          paymentStatus: s.paymentStatus || "unpaid",
          matricNo: s.matricNo || "",
          roomId: s.roomId || null,
        }));
        setStudents(mapped);
      } catch (err) {
        // ignore fetch errors here; admin still logged in
        console.warn("Failed to fetch students after admin login", err);
      }

      return null;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return error.response?.data?.message || "Admin login failed.";
      }
      return "Admin login failed.";
    }
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
