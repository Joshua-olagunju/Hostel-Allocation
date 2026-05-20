import { FaBed } from "react-icons/fa";
import type { Room } from "../types";

interface RoomCardProps {
  room: Room;
  studentRoomId: string | null;
  onSelect: (roomId: string) => void;
}

export const RoomCard = ({ room, studentRoomId, onSelect }: RoomCardProps) => {
  const available = room.capacity - room.occupants.length;
  const isFull = available === 0;
  const selected = studentRoomId === room.id;

  return (
    <article
      className={`group flex flex-col gap-4 rounded-md border p-5 sm:p-6 transition ${
        isFull
          ? "border-slate-200 bg-slate-50 text-slate-500/80"
          : selected
            ? "border-emerald-400 bg-emerald-50"
            : "border-slate-200 bg-white"
      } `}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-[500] text-slate-900">{room.name}</h3>
          <p className="mt-1 text-xs text-slate-600">Block {room.block}</p>
        </div>
        <div className="rounded-sm bg-slate-50 px-3 py-2 text-xs   text-slate-700">
          {available} free
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <span className="inline-flex items-center text-xs gap-2 rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
          <FaBed /> {room.occupants.length} / {room.capacity} occupied
        </span>
        {isFull ? (
          <span className="rounded-sm bg-red-500/10 px-3 text-xs py-2 text-red-500">
            Full
          </span>
        ) : selected ? (
          <span className="rounded-sm bg-emerald-500/10 px-3 py-2  text-xs text-emerald-500">
            Selected
          </span>
        ) : null}
      </div>

      <button
        type="button"
        disabled={isFull}
        onClick={() => onSelect(room.id)}
        className={`mt-auto rounded-md px-4 py-3 !text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
          isFull
            ? "cursor-not-allowed bg-slate-100 text-slate-400"
            : selected
              ? "bg-emerald-500 text-white hover:bg-emerald-400"
              : "bg-slate-100 text-slate-950 hover:bg-slate-200"
        }`}
      >
        {isFull ? "Unavailable" : selected ? "Room Selected" : "Select Room"}
      </button>
    </article>
  );
};
