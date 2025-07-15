import React from "react";
// If recharts is not installed, you can swap to chart.js or another library
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const getMonthlyDonationData = (appointments) => {
  // Only count appointments with status 'donated'
  const donations = appointments.filter(a => a.status === "donated");
  if (!donations.length) return [];
  // Get last 12 months
  const now = new Date();
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth() + 1}`,
      label: d.toLocaleString(undefined, { month: 'short', year: '2-digit' }),
      count: 0,
    });
  }
  donations.forEach(a => {
    const date = new Date(a.time_schedule?.event?.date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const month = months.find(m => m.key === key);
    if (month) month.count += 1;
  });
  return months;
};

const AnalyticsChart = ({ appointments = [] }) => {
  const data = getMonthlyDonationData(appointments);

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded shadow text-gray-500 h-full min-h-[220px]">
        <span className="text-2xl mb-2">📊</span>
        <div className="font-semibold text-lg">No Donation Data</div>
        <div className="text-sm">Your donation history will appear here.</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow p-4 h-full min-h-[220px]">
      <div className="font-semibold mb-2">Donations (Last 12 Months)</div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart; 