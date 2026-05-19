import { useMemo } from "react";
import { FaCircle, FaDoorOpen, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { RoomCard } from "../components/RoomCard";
import type { Room } from "../types";

export const StudentDashboard = () => {
  const { user, rooms, students, selectRoom, logout } = useAppContext();
  const navigate = useNavigate();
  const blocks = useMemo(() => {
    return rooms.reduce<Record<string, Room[]>>((acc, room) => {
      acc[room.block] = acc[room.block] ?? [];
      acc[room.block].push(room);
      return acc;
    }, {});
  }, [rooms]);
  if (!user) return null;

  const student = students.find((item) => item.id === user.id);
  const studentRoomId = student?.roomId ?? null;

  return (
    <DashboardLayout
      title={`Welcome back, ${user.name}`}
      subtitle="Browse hostel blocks, review real-time availability, and choose your room assignment."
      actions={
        <div className="flex flex-col gap-2 text-sm text-slate-300 sm:flex-row sm:items-center sm:gap-4">
          <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-4 py-2 text-slate-300">
            <FaHome /> Assigned room: {studentRoomId ?? "None"}
          </span>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
          >
            <FaDoorOpen /> Sign out
          </button>
        </div>
      }
    >
      <section className="grid gap-8">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-xl shadow-slate-950/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Current status
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                Room availability
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-4 py-3 text-slate-300">
              <FaCircle /> The interface updates instantly when you choose a
              room.
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {Object.entries(blocks).map(([block, blockRooms]) => (
            <div key={block} className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                    Block {block}
                  </p>
                  <h3 className="text-xl font-semibold text-white">
                    Rooms in block {block}
                  </h3>
                </div>
                <div className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-slate-300">
                  {blockRooms.length} rooms
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {blockRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    studentRoomId={studentRoomId}
                    onSelect={selectRoom}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
};
