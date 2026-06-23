"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";

export function DailyViewsChart({ data }: { data: any[] }) {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis dataKey="dateStr" tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip 
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            cursor={{ fill: "#f8fafc", stroke: "#e2e8f0" }}
          />
          <Line 
            type="monotone" 
            dataKey="views" 
            name="Page Views"
            stroke="var(--color-primary)" 
            strokeWidth={3} 
            dot={{ r: 4, fill: "var(--color-primary)", strokeWidth: 2, stroke: "#fff" }} 
            activeDot={{ r: 6 }} 
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LocationBarChart({ data }: { data: any[] }) {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" tick={{ fill: "#334155", fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} width={120} />
          <Tooltip 
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            cursor={{ fill: "#f1f5f9" }}
          />
          <Bar dataKey="views" name="Views" fill="#d97706" radius={[0, 4, 4, 0]} barSize={24} animationDuration={1500} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
