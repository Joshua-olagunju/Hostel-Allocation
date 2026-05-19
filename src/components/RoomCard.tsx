import { FaBed } from 'react-icons/fa'
import type { Room } from '../types'

interface RoomCardProps {
  room: Room
  studentRoomId: string | null
  onSelect: (roomId: string) => void
}

export const RoomCard = ({ room, studentRoomId, onSelect }: RoomCardProps) => {
  const available = room.capacity - room.occupants.length
  const isFull = available === 0
  const selected = studentRoomId === room.id

  return (
    <article
      className={`group flex flex-col gap-4 rounded-3xl border p-5 sm:p-6 shadow-xl transition ${
        isFull
          ? 'border-slate-700 bg-slate-950 text-slate-500 opacity-80'
          : selected
          ? 'border-emerald-400 bg-emerald-950/20'
          : 'border-slate-700 bg-slate-900'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{room.name}</h3>
          <p className="mt-1 text-sm text-slate-400">Block {room.block}</p>
        </div>
        <div className="rounded-2xl bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200">
          {available} free
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-2">
          <FaBed /> {room.occupants.length} / {room.capacity} occupied
        </span>
        {isFull ? (
          <span className="rounded-full bg-red-500/10 px-3 py-2 font-medium text-red-300">Full</span>
        ) : selected ? (
          <span className="rounded-full bg-emerald-500/10 px-3 py-2 font-medium text-emerald-300">Selected</span>
        ) : null}
      </div>

      <button
        type="button"
        disabled={isFull}
        onClick={() => onSelect(room.id)}
        className={`mt-auto rounded-2xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
          isFull
            ? 'cursor-not-allowed bg-slate-700 text-slate-500'
            : selected
            ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
            : 'bg-slate-100 text-slate-950 hover:bg-slate-200'
        }`}
      >
        {isFull ? 'Unavailable' : selected ? 'Room Selected' : 'Select Room'}
      </button>
    </article>
  )
}
