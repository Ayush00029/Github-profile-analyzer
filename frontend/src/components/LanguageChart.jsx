import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { colorForLanguage, OTHER_COLOR } from '../utils/languageColors.js';
import { formatBytes } from '../utils/format.js';

const TOP_N = 8;

function buildData(languages) {
  const entries = Object.entries(languages || {}).filter(([, bytes]) => bytes > 0);
  if (entries.length === 0) return null;

  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
  entries.sort((a, b) => b[1] - a[1]);

  const top = entries.slice(0, TOP_N);
  const rest = entries.slice(TOP_N);

  const data = top.map(([name, bytes], i) => ({
    name,
    bytes,
    pct: +((bytes / total) * 100).toFixed(1),
    color: colorForLanguage(name, i),
  }));

  if (rest.length) {
    const restBytes = rest.reduce((sum, [, bytes]) => sum + bytes, 0);
    data.push({
      name: 'Other',
      bytes: restBytes,
      pct: +((restBytes / total) * 100).toFixed(1),
      color: OTHER_COLOR,
      other: rest.length,
    });
  }
  return data;
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
      <strong className="text-slate-100 font-semibold">{d.name}</strong>
      <div className="text-slate-300">
        {d.pct}% · {formatBytes(d.bytes)}
      </div>
      {d.other ? <div className="text-slate-500 text-[11px]">{d.other} more languages</div> : null}
    </div>
  );
}

export default function LanguageChart({ languages, sampledFrom }) {
  const data = buildData(languages);

  return (
    <section className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-100">Language Breakdown</h3>
        {sampledFrom ? (
          <span className="text-xs text-slate-400">top {sampledFrom} repos by code size</span>
        ) : null}
      </div>

      {!data ? (
        <p className="text-sm text-slate-500 italic py-8 text-center">
          No language data available for this user.
        </p>
      ) : (
        <div className="w-full">
          <ResponsiveContainer width="100%" height={Math.max(220, data.length * 36)}>
            <BarChart layout="vertical" data={data} margin={{ top: 4, right: 48, bottom: 4, left: 0 }}>
              <XAxis type="number" domain={[0, 'dataMax']} hide />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
              <Bar dataKey="pct" radius={[0, 4, 4, 0]} barSize={16} isAnimationActive={false}>
                {data.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
                <LabelList
                  dataKey="pct"
                  position="right"
                  formatter={(v) => `${v}%`}
                  fill="#94a3b8"
                  fontSize={11}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
