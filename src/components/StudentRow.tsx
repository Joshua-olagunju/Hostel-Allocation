import type { Student } from '../types'

interface StudentRowProps {
  student: Student
  onTogglePayment: (studentId: string) => void
}

export const StudentRow = ({ student, onTogglePayment }: StudentRowProps) => {
  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50">
      <td className="px-4 py-3 text-sm text-slate-900">{student.name}</td>
      <td className="px-4 py-3 text-sm text-slate-700">{student.email}</td>
      <td className="px-4 py-3 text-sm">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            student.paymentStatus === 'paid'
              ? 'bg-emerald-500/15 text-emerald-700'
              : 'bg-rose-500/15 text-rose-700'
          }`}
        >
          {student.paymentStatus}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-slate-700">
        {student.roomId ?? 'Unassigned'}
      </td>
      <td className="px-4 py-3 text-sm">
        <button
          type="button"
          className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
            student.paymentStatus === 'paid'
              ? 'bg-rose-500 text-white hover:bg-rose-400'
              : 'bg-emerald-500 text-white hover:bg-emerald-400'
          }`}
          onClick={() => onTogglePayment(student.id)}
        >
          Mark {student.paymentStatus === 'paid' ? 'Unpaid' : 'Paid'}
        </button>
      </td>
    </tr>
  )
}
