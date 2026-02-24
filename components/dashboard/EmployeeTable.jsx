// components/dashboard/EmployeeTable.jsx
import React from 'react';

export default function EmployeeTable() {
  const employees = [
    { id: 'EMP-01', name: 'Sarah Connor', role: 'Picker', efficiency: 104, status: 'Active' },
    { id: 'EMP-02', name: 'James Holden', role: 'Forklift Operator', efficiency: 98, status: 'Active' },
    { id: 'EMP-03', name: 'Amos Burton', role: 'Packer', efficiency: 112, status: 'Active' },
    { id: 'EMP-04', name: 'Naomi Nagata', role: 'Supervisor', efficiency: 100, status: 'On Break' },
    { id: 'EMP-05', name: 'Alex Kamal', role: 'Receiver', efficiency: 85, status: 'Active' },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700 transition-colors">
            <th className="py-4 px-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Employee Name</th>
            <th className="py-4 px-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Role</th>
            <th className="py-4 px-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Current Status</th>
            <th className="py-4 px-4 text-sm font-semibold text-slate-500 dark:text-slate-400 text-right">Efficiency (UPLH)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
              <td className="py-4 px-4">
                <p className="font-bold text-slate-800 dark:text-slate-100">{emp.name}</p>
                <p className="text-xs text-slate-400">{emp.id}</p>
              </td>
              <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-300 font-medium">
                {emp.role}
              </td>
              <td className="py-4 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  emp.status === 'Active' 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                }`}>
                  {emp.status}
                </span>
              </td>
              <td className="py-4 px-4 text-right font-extrabold text-slate-800 dark:text-slate-100">
                {emp.efficiency}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}