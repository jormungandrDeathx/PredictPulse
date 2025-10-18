import { use, useMemo } from "react";
import { motion } from "motion/react";
import {
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
const COLORS = ["#10B981", "#EF4444", "#3B82F6", "#F59E0B", "#8B5CF6"];
function getPreview() {
  try {
    const raw = localStorage.getItem("uploaded_preview");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function ChartPage() {
  const preview = getPreview();
  var { targetDistribution, ageBins } = useMemo(() => {
    if (!preview || !preview.preview)
      return { targetDistribution: null, ageBins: null };

    const rows = preview.preview;
    const cols = preview.coloumns || (rows.length ? Object.keys(rows[0]) : []);

    const targetNames = [
      "target",
      "outcome",
      "Outcome",
      "Target",
      "diagnosis",
      "label",
    ];
    const targetCol = cols.find((c) => targetNames.includes(c)) || null;
    const ageCol = cols.find((c) => /age/i.test(c) || null);

    let targetDistribution = null;
    if (targetCol) {
      const counts = {};
      rows.forEach((r) => {
        const v = r[targetCol];
        const k = v === null || v === undefined ? "null" : String(v);
        counts[k] = (counts[k] || 0) + 1;
      });
      targetDistribution = Object.entries(counts).map(([name, value]) => ({
        name,
        value,
      }));
    }

    let ageBins = null;
    if (ageCol) {
      const ages = rows.map((r) => Number(r[ageCol]) || 0);
      const bins = {};
      ages.forEach((a) => {
        const floor = Math.floor(a / 10) * 10;
        const label = `${floor}-${floor + 9}`;
        bins[label] = (bins[label] || 0) + 1;
      });
      ageBins = Object.entries(bins)
        .map(([ name, value ])=>({name,value}))
        .sort((a, b) => parseInt(a.name, 10) - parseInt(b.name, 10));
    }
    return { targetDistribution, ageBins };
  }, [preview]);

  return (
    <div className="min-h-[60vh] p-6 mt-17 bg-[#F5F5F5]">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-5xl mx-auto"
      >
        <div className="rounded-2xl bg-gray-900/60 border border-gray-700 p-6 shadow-xl">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Charts and Insights
          </h2>
          {!preview && (
            <div className="p-6 rounded bg-gray-800 text-gray-300">
              No uploaded dataset found. Go to Upload page and uplaod a CSV to
              visualize charts.
            </div>
          )}
          {preview && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded">
                <h3 className="text-white mb-3">Target distribution</h3>
                {targetDistribution ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={targetDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {targetDistribution.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={COLORS[idx % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-sm text-gray-300">
                    No target column detected in preview.
                  </div>
                )}
              </div>
              <div className="bg-gray-800 p-4 rounded">
                <h3 className="text-white mb-3">Age bins</h3>
                {ageBins ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={ageBins}>
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-sm text-gray-300">
                    No age column detected in preview
                  </div>
                )}
              </div>
              <div className="bg-gray-800 p-4 rounded md:col-span-2">
                <h3 className="text-white mb-3">Raw preview (first rows)</h3>
                <div className="overflow-auto max-h-64 border-t border-gray-700 pt-2">
                {preview.preview && preview.preview.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        {Object.keys(preview.preview[0]).map((col) => (
                          <th
                            key={col}
                            className="text-left px-2 py-1 text-xs text-gray-300 uppercase"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.preview.map((row, i) => (
                        <tr
                          key={i}
                          className={
                            i % 2 === 0 ? "bg-gray-900/40" : "bg-transparent"
                          }
                        >
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="px-2 py-1 text-gray-200">
                              {String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <pre className="text-sm text-gray-200">
                    {JSON.stringify(preview, null, 2)}
                  </pre>
                )}
              </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ChartPage;
