import { useMemo, useState } from "react";
import { useAppContext } from "../context/useAppContext";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { StudentRow } from "../components/StudentRow";

const STUDENTS_PER_PAGE = 5;

export const AdminDashboard = () => {
  const [page, setPage] = useState(1);
  const { students, rooms, togglePaymentStatus } = useAppContext();

  const roomsById = useMemo(
    () =>
      rooms.reduce<Record<string, string>>((mapping, room) => {
        mapping[room.id] = room.name;
        return mapping;
      }, {}),
    [rooms],
  );

  const totalPages = Math.max(1, Math.ceil(students.length / STUDENTS_PER_PAGE));
  const firstIndex = (page - 1) * STUDENTS_PER_PAGE;
  const paginatedStudents = students.slice(firstIndex, firstIndex + STUDENTS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setPage(Math.min(Math.max(newPage, 1), totalPages));
  };

  return (
    <DashboardLayout
      title="Admin control panel"
      subtitle="Review every student, manage payment status, and check room assignments in one place."
    >
      <div className="grid gap-8">
        <section className="border-b border-slate-200 bg-white py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Student roster
              </p>
              <h4 className="mt-3 text-2xl font-[500] text-slate-900">
                All registered students
              </h4>
            </div>
            <div className="rounded-sm bg-slate-50 px-4 py-2 text-xs text-slate-700">
              {students.length} students
            </div>
          </div>
        </section>

        <div className="overflow-x-auto rounded-sm border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-800 text-left">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.25em]">
                  Name
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.25em]">
                  Email
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.25em]">
                  Payment
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.25em]">
                  Assigned room
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.25em]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 !text-xs">
              {paginatedStudents.map((student) => (
                <StudentRow
                  key={student.id}
                  student={{
                    ...student,
                    roomId: student.roomId
                      ? (roomsById[student.roomId] ?? student.roomId)
                      : null,
                  }}
                  onTogglePayment={togglePaymentStatus}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            Showing {firstIndex + 1} to {Math.min(firstIndex + STUDENTS_PER_PAGE, students.length)} of {students.length} students
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <div className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </div>
            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
