import { useMemo, useState } from "react";
import {
  FiBarChart2,
  FiCalendar,
  FiTrendingUp,
  FiUsers,
  FiShoppingCart,
} from "react-icons/fi";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

/* =======================
   DATA SIMULADA
======================= */

const WEEK_DAYS = [
  { label: "Lun", value: 900 },
  { label: "Mar", value: 1100 },
  { label: "Mié", value: 1250 },
  { label: "Jue", value: 1400 },
  { label: "Vie", value: 1600 },
  { label: "Sáb", value: 1350 },
  { label: "Dom", value: 1500 },
];

const MONTHS = [
  { label: "Ene", value: 45231 },
  { label: "Feb", value: 39800 },
  { label: "Mar", value: 50100 },
  { label: "Abr", value: 47200 },
  { label: "May", value: 41000 },
  { label: "Jun", value: 45500 },
  { label: "Jul", value: 52000 },
  { label: "Ago", value: 49000 },
  { label: "Sep", value: 47000 },
  { label: "Oct", value: 51000 },
  { label: "Nov", value: 49800 },
  { label: "Dic", value: 53500 },
];

const YEARS = [
  { label: "2022", value: 8500000 },
  { label: "2023", value: 9800000 },
  { label: "2024", value: 10500000 },
  { label: "2025", value: 4500000 },
];

export default function Dashboard() {
  const [filter, setFilter] = useState("dia"); // dia | mes | anio

  const chartData = useMemo(() => {
    if (filter === "dia") return WEEK_DAYS; // semana (7 días)
    if (filter === "mes") return MONTHS;
    return YEARS;
  }, [filter]);

  const money = (n) =>
    (Number(n) || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Dashboard de Ventas y Analytics
          </h2>
          <p className="text-neutral-400 text-sm">
            Resumen de ventas y comportamiento.
          </p>
        </div>
      </div>

      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card icon={<FiCalendar />} title="Ventas Último Día" value="$ 1.250" />
        <Card icon={<FiBarChart2 />} title="Ventas por Mes" value="$ 45.231" />
        <Card icon={<FiTrendingUp />} title="Ventas por Año" value="$ 485.450" />
        <Card icon={<FiUsers />} title="Número de Clientes" value="1.234" />
      </div>

      {/* ================= RESUMEN DE VENTAS (FULL WIDTH) ================= */}
      <div className="bg-neutral-900/80 border border-neutral-700 rounded-2xl p-4 shadow-lg w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-neutral-200">
            Resumen de Ventas
          </h3>

          <div className="flex gap-2">
            <FilterButton
              active={filter === "dia"}
              onClick={() => setFilter("dia")}
            >
              Día
            </FilterButton>
            <FilterButton
              active={filter === "mes"}
              onClick={() => setFilter("mes")}
            >
              Mes
            </FilterButton>
            <FilterButton
              active={filter === "anio"}
              onClick={() => setFilter("anio")}
            >
              Año
            </FilterButton>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: "#a3a3a3", fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: "#a3a3a3", fontSize: 12 }}
                tickFormatter={(v) => money(v)}
              />
              <Tooltip
                formatter={(v) => money(v)}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 8,
                }}
              />

              {/* ✅ BARRAS MAS DELGADAS */}
              <Bar
                dataKey="value"
                fill="#22c55e"
                radius={[6, 6, 0, 0]}
                barSize={42} // <--- MÁS DELGADAS (ajusta 32-48 si quieres)
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= ABAJO: PRODUCTOS + GRAFICA SEMANAL LINEA ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* PRODUCTOS */}
        <div className="bg-neutral-900/80 border border-neutral-700 rounded-2xl p-4 shadow-lg col-span-1">
          <div className="flex justify-between mb-3">
            <h3 className="text-sm font-semibold text-neutral-200">
              Productos (2025)
            </h3>
            <FiShoppingCart className="text-neutral-400" />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-neutral-300">Producto más vendido</p>
              <p className="text-lg font-semibold text-green-400">
                Arroz Integral Orgánico
              </p>
              <div className="mt-2 h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[80%]" />
              </div>
            </div>

            <div>
              <p className="text-sm text-neutral-300">Producto menos vendido</p>
              <p className="text-lg font-semibold text-red-400">
                Harina de Almendras
              </p>
              <div className="mt-2 h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-[25%]" />
              </div>
            </div>
          </div>
        </div>

        {/* ✅ GRAFICA SEMANAL SIEMPRE (LINEA) */}
        <div className="bg-neutral-900/80 border border-neutral-700 rounded-2xl p-4 shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-neutral-200">
              Ventas de Semana
            </h3>
            <FiTrendingUp className="text-neutral-400" />
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEK_DAYS} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />

                {/* ABAJO DÍAS */}
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#a3a3a3", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
                  tickLine={{ stroke: "rgba(255,255,255,0.15)" }}
                />

                {/* IZQUIERDA VALORES */}
                <YAxis
                  tick={{ fill: "#a3a3a3", fontSize: 12 }}
                  tickFormatter={(v) => money(v)}
                  axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
                  tickLine={{ stroke: "rgba(255,255,255,0.15)" }}
                />

                <Tooltip
                  formatter={(v) => money(v)}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: 8,
                  }}
                />

                {/* ✅ LINEA COMO LA DIBUJASTE */}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTES ================= */

function Card({ icon, title, value }) {
  return (
    <div className="bg-neutral-900/80 border border-neutral-700 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center gap-2 text-neutral-300 text-sm mb-2">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-neutral-800">
          {icon}
        </span>
        {title}
      </div>
      <div className="text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function FilterButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-lg text-xs ${
        active ? "bg-blue-600 text-white" : "bg-neutral-800 text-neutral-300"
      }`}
    >
      {children}
    </button>
  );
}
