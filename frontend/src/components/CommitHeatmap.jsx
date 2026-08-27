import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { formatNumber } from '../utils/format.js';

function makeLevelFn(max) {
  return (count) => {
    if (!count) return 0;
    if (max <= 4) return Math.min(4, count);
    return Math.min(4, Math.ceil((count / max) * 4));
  };
}

export default function CommitHeatmap({ data }) {
  const values = data?.heatmap || [];
  const max = values.reduce((m, v) => Math.max(m, v.count), 0);
  const level = makeLevelFn(max);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  const analyzed = data?.reposAnalyzed || [];

  return (
    <section className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-100">Commit Activity</h3>
        <span className="text-xs text-slate-400 font-mono">
          {formatNumber(data?.totalCommits || 0)} commits · 12 months
        </span>
      </div>

      {values.length === 0 ? (
        <p className="text-sm text-slate-500 italic py-8 text-center">
          No commit activity available. GitHub may still be computing stats for these repos — try
          again in a few seconds.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto pb-2">
            <CalendarHeatmap
              startDate={startDate}
              endDate={endDate}
              values={values}
              gutterSize={2}
              classForValue={(v) => (v && v.count > 0 ? `color-scale-${level(v.count)}` : 'color-empty')}
              titleForValue={(v) =>
                v && v.count ? `${v.date}: ${v.count} commit${v.count > 1 ? 's' : ''}` : 'No commits'
              }
              showWeekdayLabels
            />
          </div>

          <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400">
            <span>Less</span>
            <span className="w-3 h-3 rounded-sm bg-slate-800" />
            <span className="w-3 h-3 rounded-sm bg-[#0e4429]" />
            <span className="w-3 h-3 rounded-sm bg-[#006d32]" />
            <span className="w-3 h-3 rounded-sm bg-[#26a641]" />
            <span className="w-3 h-3 rounded-sm bg-[#39d353]" />
            <span>More</span>
          </div>

          {analyzed.length > 0 && (
            <p className="text-[11px] text-slate-500 truncate">
              Aggregated from top {analyzed.length} repo{analyzed.length > 1 ? 's' : ''}:{' '}
              <span className="font-mono text-slate-400">
                {analyzed.map((name) => name.split('/')[1]).join(', ')}
              </span>
            </p>
          )}
        </div>
      )}
    </section>
  );
}
