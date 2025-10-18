import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
function readPredictionHistory() {
  try {
    const raw = localStorage.getItem("prediction_history");
    return raw ? JSON.parse(raw) : [];
    // if (!raw) return [];
    // return JSON.parse(raw);
  } catch {
    return [];
  }
}
const COLORS = ["#10B981", "#EF4444", "#3B82F6"];
function PerformancePage() {
  const [status, setStatus] = useState(null);
  const history = useMemo(() => readPredictionHistory(), []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/health/")
      .then((r) => setStatus(r.data))
      .catch((e) => setStatus(null));
  }, []);

  const counts = useMemo(() => {
    const map = {};
    history.forEach((p) => {
      const key = String(p.label ?? p.prediction ?? p);
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [history]);
  return (
    <div className="mt-17 md:mt-0">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 flex items-center justify-center px-4 py-10">
        <motion.div
          className="max-w-5xl w-full bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl p-8"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h2 className="text-3xl font-bold text-teal-400 text-center">
            Model Performance Dashboard
          </h2>
          <div className="grid grid-cols-1 mt-5 gap-6">
            <center>
              <div className="bg-gray-900/50 border border-gray-700 p-5 rounded-xl shadow-inner flex flex-col justify-center items-center max-w-xs">
                <h3 className="text-xl font-semibold text-white mb-3 ">
                  Backend connection status
                </h3>
                <p className={status ? "text-green-500" : "text-red-500"}>
                  {status ? "Online" : "Offline"}
                </p>
              </div>
            </center>
            <div className="bg-gray-900/50 border border-gray-700 p-5 rounded-xl shadow-inner">
              <h3 className="text-xl font-semibold text-white mb-3">
                Prediction History
              </h3>
              {counts && counts.length > 0 ? (
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-full md:w-1/2 h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        {" "}
                        <Pie
                          dataKey="value"
                          data={counts}
                          nameKey="name"
                          outerRadius={80}
                          label
                        >
                          {counts.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            border: "1px solid #374151",
                            color: "#f9fafb",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>{" "}
                  </div>
                  <div className="flex-1 w-full bg-gray-800/60 border border-gray-700 p-3 rounded-lg">
                    <h4 className="text-white mb-2 font-semibold">Counts</h4>
                    <ul className="text-gray-300 text-sm">
                      {counts.map((c) => (
                        <li
                          key={c.name}
                          className="flex justify-between border-b border-gray-700 py-1"
                        >
                          <span>{c.name}</span>
                          <strong>{c.value}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-sm">
                  No local prediction history found. Make predictions from the
                  predict page - results will be stored locally and displayed
                  here.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PerformancePage;
