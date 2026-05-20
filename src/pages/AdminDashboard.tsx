import { useMemo } from 'react'
import { useAppContext } from '../context/AppContext'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { StudentRow } from '../components/StudentRow'

export const AdminDashboard = () => {
  const { students, rooms, togglePaymentStatus } = useAppContext()

  const roomsById = useMemo(
    () => rooms.reduce<Record<string, string>>((mapping, room) => {
      mapping[room.id] = room.name
      return mapping
    }, {}),
    [rooms],
  )

  return (
    <DashboardLayout
      title="Admin control panel"
      subtitle="Review every student, manage payment status, and check room assignments in one place."
    >
      <div className="grid gap-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Student roster</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">All registered students</h2>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-700">
              {students.length} students
            </div>
          </div>
        </section>

        <div className="overflow-x-auto rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-800 text-left">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-4 text-sm font-semibold uppercase tracking-[0.25em]">Name</th>
                <th className="px-4 py-4 text-sm font-semibold uppercase tracking-[0.25em]">Email</th>
                <th className="px-4 py-4 text-sm font-semibold uppercase tracking-[0.25em]">Payment</th>
                <th className="px-4 py-4 text-sm font-semibold uppercase tracking-[0.25em]">Assigned room</th>
                <th className="px-4 py-4 text-sm font-semibold uppercase tracking-[0.25em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {students.map((student) => (
                <StudentRow
                  key={student.id}
                  student={{ ...student, roomId: student.roomId ? roomsById[student.roomId] ?? student.roomId : null }}
                  onTogglePayment={togglePaymentStatus}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
