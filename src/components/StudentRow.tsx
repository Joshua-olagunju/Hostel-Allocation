import type { Student } from "../types";

interface StudentRowProps {
  student: Student;
  onTogglePayment: (studentId: string) => void;
}

export const StudentRow = ({ student, onTogglePayment }: StudentRowProps) => {
  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50">
      <td className="px-4 py-3 text-xs text-slate-900">{student.name}</td>
      <td className="px-4 py-3 text-xs text-slate-700">{student.email}</td>
      <td className="px-4 py-3 text-xs">
        <span
          className={`inline-flex rounded-lg px-3 py-1 text-xs   ${
            student.paymentStatus === "paid"
              ? "bg-blue-400/15 text-blue-700"
              : "bg-rose-500/15 text-rose-700"
          }`}
        >
          {student.paymentStatus.charAt(0).toUpperCase() + student.paymentStatus.slice(1)}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-slate-700">
        {student.roomId ?? "Unassigned"}
      </td>
      <td className="px-4 py-3 text-xs">
        <button
          type="button"
          className={`rounded-lg px-3 py-1 text-xs  transition ${
            student.paymentStatus === "paid"
              ? "bg-rose-500 text-white hover:bg-rose-400"
              : "bg-blue-400 text-white hover:bg-blue-400/90"
          }`}
          onClick={() => onTogglePayment(student.id)}
        >
          Mark {student.paymentStatus === "paid" ? "Unpaid" : "Paid"}
        </button>
      </td>
    </tr>
  );
};
