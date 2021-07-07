import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function App({ categories }) {
  const data = categories
    .map((c) => ({
      ...c,
      _id: c._id ?? "misc",
    }))
    .sort((a, b) => b.total - a.total);
  return (
    <ResponsiveContainer width="95%" height={400}>
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="_id" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/*
const data = categories.map((c) => ({
    ...c,
    _id: c._id ?? "misc",
    total: Math.log10(c.total),
  }));
*/
