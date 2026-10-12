import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useStore } from '../store/AppStore';
import { skillScores } from '../lib/stats';

export function SkillRadar() {
  const { s, js } = useStore();
  const data = skillScores(s, js);
  const best = [...data].sort((a, b) => b.score - a.score)[0];
  const weak = [...data].sort((a, b) => a.score - b.score)[0];
  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="label">Profil de grappler</p>
        <span className="text-xs text-slate-400">évolue avec tes validations</span>
      </div>
      <div className="h-64 w-full sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <defs>
              <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.25} />
              </linearGradient>
            </defs>
            <PolarGrid stroke="rgba(148,163,184,.18)" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: '#CBD5E1', fontSize: 12, fontFamily: 'Barlow Condensed', fontWeight: 600 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} tickCount={5} />
            <Tooltip
              contentStyle={{ background: '#0F172A', border: '1px solid rgba(56,189,248,.3)', borderRadius: 12, color: '#E2E8F0' }}
              formatter={(v: number) => [`${v} / 100`, 'Score']}
            />
            <Radar dataKey="score" stroke="#38BDF8" strokeWidth={2} fill="url(#radarFill)" dot={{ r: 3, fill: '#22D3EE' }} isAnimationActive />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl bg-success/10 px-3 py-2 text-success">
          Point fort : <b>{best.score ? best.skill : '—'}</b>
        </div>
        <div className="rounded-xl bg-warning/10 px-3 py-2 text-warning">
          À travailler : <b>{weak.skill}</b>
        </div>
      </div>
    </div>
  );
}
