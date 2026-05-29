import axios from "axios";
import { useEffect, useState } from "react";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { mockRooms } from "../data/rooms";
import { loginStudent as apiLoginStudent, loginAdmin as apiLoginAdmin } from "../api/auth";
import { getStudents, updateStudent } from "../api/students";
import { AppContext } from "./AppContextBase";
import type { AppState, Room, Student, UserSession } from "../types";

const STORAGE_KEY = "hostel-allocation-state";
const AUTH_KEY = "hostel-allocation-auth";


const initialState: AppState = {
  students: [],
  rooms: mockRooms,
};

const buildRoomsFromStudents = (students: Student[], rooms: Room[]) => {
  return rooms.map((room) => ({
    ...room,
    occupants: students.filter((student) => student.roomId === room.id).map((student) => student.id),
  }));
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = loadFromStorage<AppState>(STORAGE_KEY);
    if (!saved?.students) return initialState.students;
    return saved.students;
  });
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = loadFromStorage<AppState>(STORAGE_KEY);
    const baseRooms = saved?.rooms ?? initialState.rooms;
    const savedStudents = saved?.students ?? [];

    if (!savedStudents.length) {
      return baseRooms;
    }

    return buildRoomsFromStudents(savedStudents, baseRooms);
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
      const mappedStudent: Student = {
        id: student._id || student.id,
        name: student.name,
        email: student.email,
        password: "",
        paymentStatus: student.paymentStatus || "unpaid",
        matricNo: student.matricNo || "",
        roomId: student.roomId || null,
      };
      setUser(session);
      setStudents((currentStudents) => {
        const existing = currentStudents.find((item) => item.id === mappedStudent.id);
        const updated = existing
          ? currentStudents.map((item) => (item.id === mappedStudent.id ? mappedStudent : item))
          : [...currentStudents, mappedStudent];
        setRooms(buildRoomsFromStudents(updated, rooms));
        return updated;
      });
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
      const fetched = (studentsRes.data.students || []) as Array<{
        _id?: string;
        id?: string;
        name?: string;
        email?: string;
        paymentStatus?: "paid" | "unpaid";
        matricNo?: string;
        roomId?: string | null;
      }>;
      const mapped = fetched.map((s) => ({
        id: s._id || s.id || "",
        name: s.name || "",
        email: s.email || "",
        password: "",
        paymentStatus: s.paymentStatus || "unpaid",
        matricNo: s.matricNo || "",
        roomId: s.roomId || null,
      }));
        setStudents(mapped);
        setRooms(buildRoomsFromStudents(mapped, rooms));
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

  const selectRoom = async (roomId: string) => {
    if (!user || user.type !== "student") return;
    const studentId = user.id;
    if (!studentId) return;

    try {
      const res = await updateStudent(studentId, { roomId });
      const updatedStudent = res.data.student;
      const mappedStudent: Student = {
        id: updatedStudent._id || updatedStudent.id,
        name: updatedStudent.name || "",
        email: updatedStudent.email || "",
        password: "",
        paymentStatus: updatedStudent.paymentStatus || "unpaid",
        matricNo: updatedStudent.matricNo || "",
        roomId: updatedStudent.roomId || null,
      };
      setStudents((currentStudents) => {
        const updated = currentStudents.map((student) =>
          student.id === mappedStudent.id ? mappedStudent : student,
        );
        setRooms(buildRoomsFromStudents(updated, rooms));
        return updated;
      });
    } catch (error: unknown) {
      console.error("Failed to save room assignment", error);
    }
  };

  const togglePaymentStatus = async (studentId: string) => {
    const currentStudent = students.find((student) => student.id === studentId);
    if (!currentStudent) return;

    const nextStatus = currentStudent.paymentStatus === "paid" ? "unpaid" : "paid";

    try {
      const res = await updateStudent(studentId, { paymentStatus: nextStatus });
      const updatedStudent = res.data.student;
      const mappedStudent: Student = {
        id: updatedStudent._id || updatedStudent.id,
        name: updatedStudent.name || "",
        email: updatedStudent.email || "",
        password: "",
        paymentStatus: updatedStudent.paymentStatus || "unpaid",
        matricNo: updatedStudent.matricNo || "",
        roomId: updatedStudent.roomId || null,
      };
      setStudents((currentStudents) =>
        currentStudents.map((student) =>
          student.id === mappedStudent.id ? mappedStudent : student,
        ),
      );
    } catch (error: unknown) {
      console.error("Failed to update payment status", error);
    }
  };

  const value = {
    students,
    rooms,
    user,
    loginStudent,
    loginAdmin,
    logout,
    selectRoom,
    togglePaymentStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
