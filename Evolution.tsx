
import React, { useMemo } from 'react';
import { GlassCard } from './GlassCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, ShieldCheck, Zap, TrendingUp, TrendingDown } from 'lucide-react';

interface EvolutionProps {
  user: any;
}

const Evolution: React.FC<EvolutionProps> = ({ user }) => {
  const weightHistory = useMemo(() => user?.weightHistory || [], [user?.weightHistory]);
  const currentWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : (user?.weight || 0);
  const startWeight = weightHistory.length > 0 ? weightHistory[0].weight : (user?.weight || 0);
  const totalLoss = startWeight - currentWeight;

  return (
    <div className="flex flex-col gap-6 animate-in zoom-in-95 duration-500 pb-28">
      <GlassCard className="h-80 flex flex-col gap-4 relative overflow-hidden p-5 min-h-[320px] min-w-0">
        <div className="flex items-center justify-between z-10 shrink-0 text-left">
          <div>
            <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Histórico de Peso</h4>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black">{currentWeight} <span className="text-xs font-normal text-gray-500">kg</span></span>
              {weightHistory.length > 1 && (
                <span className={`text-[10px] font-bold flex items-center gap-0.5 ${totalLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalLoss >= 0 ? <TrendingDown size={10} /> : <TrendingUp size={10} />} 
                  {Math.abs(totalLoss).toFixed(1)}kg
                </span>
              )}
            </div>
          </div>
          <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500"><Activity size={18} /></div>
        </div>

        <div className="flex-1 z-10 -ml-4 min-h-0 min-w-0">
          {weightHistory.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <LineChart data={weightHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 10}} />
                <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Line type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-center px-6">
              <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest leading-relaxed">
                Registre seu peso para visualizar sua evolução.
              </p>
            </div>
          )}
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 gap-4 text-left">
        <GlassCard className="p-4 flex flex-col gap-2 border-white/5">
          <ShieldCheck size={18} className="text-blue-500 mb-1" />
          <span className="text-[9px] text-gray-500 uppercase font-bold">Gordura Corporal</span>
          <span className="text-xl font-black">{user?.bodyFat || 0}%</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col gap-2 border-white/5">
          <Zap size={18} className="text-purple-500 mb-1" />
          <span className="text-[9px] text-gray-500 uppercase font-bold">Consistência Dieta</span>
          <span className="text-xl font-black">0%</span>
        </GlassCard>
      </div>
    </div>
  );
};

export default Evolution;
