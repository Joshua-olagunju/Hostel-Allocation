import { useMemo } from "react";
import { FaCircle,  } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { RoomCard } from "../components/RoomCard";
import type { Room } from "../types";
import { FiHome } from "react-icons/fi";

// ==============================
// Student Dashboard Component
// ==============================
export const StudentDashboard = () => {
  const { user, rooms, students, selectRoom } = useAppContext();
  // const navigate = useNavigate();
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

  // ==============================
  // Rendered Components
  // ==============================
  return (
    <DashboardLayout
      title={`Welcome back, ${user.name}`}
      subtitle="Browse hostel blocks, review real-time availability, and choose your room assignment."
      actions={
        <div className="flex flex-col gap-2 text-sm text-slate-700 sm:flex-row sm:items-center sm:gap-4">
          <span className="w-fit inline-flex items-center gap-2 !text-xs rounded-sm bg-slate-50 px-4 py-2 text-slate-700">
            <FiHome size={16} /> Assigned room: {studentRoomId ?? "None"}
          </span>
          {/* <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-fit inline-flex items-center gap-2 rounded-sm bg-rose-500 px-4 py-2 !text-xs font-semibold !text-white transition hover:bg-rose-400"
          >
            <FaDoorOpen /> Sign out
          </button> */}
        </div>
      }
    >
      <section className="grid gap-8">
        <div className="  border-b border-slate-200 bg-white py-6  ">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Current status
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-blue-400">
                Room availability
              </h2>
            </div>
            <div className="text-xs inline-flex items-center gap-2 rounded-sm bg-slate-50 px-4 py-3 text-slate-700">
              <FaCircle size={10} className="text-blue-400 animate-pulse" />{" "}
              The interface updates instantly when you choose a room.
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
                  <h3 className="text-xl font-[500] text-slate-900">
                    Rooms in block {block}
                  </h3>
                </div>
                <div className="rounded-sm bg-slate-50 px-4 py-2 text-xs text-slate-700">
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
