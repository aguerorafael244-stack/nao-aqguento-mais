
import React, { useState, useMemo } from 'react';
import { GlassCard } from './GlassCard';
import { GoalType } from '../types';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, Target } from 'lucide-react';

interface GoalsProps {
  user: any;
}

const Goals: React.FC<GoalsProps> = ({ user }) => {
  const [selectedGoal, setSelectedGoal] = useState<GoalType>(GoalType.MAINTENANCE);
  const [currentWeight, setCurrentWeight] = useState<number>(user?.weight || 85.5);
  const [targetWeight, setTargetWeight] = useState<number>(78.0);
  const [showInputs, setShowInputs] = useState(false);

  const weightDiff = useMemo(() => Math.abs(currentWeight - targetWeight), [currentWeight, targetWeight]);
  
  const recommendedPace = useMemo(() => {
    if (selectedGoal === GoalType.CUTTING) return 0.7;
    if (selectedGoal === GoalType.BULKING) return 0.3;
    return 0;
  }, [selectedGoal]);

  const estimatedWeeks = useMemo(() => {
    if (recommendedPace === 0) return 0;
    return Math.ceil(weightDiff / recommendedPace);
  }, [weightDiff, recommendedPace]);

  const projectionData = useMemo(() => {
    const data = [];
    const weeksToShow = Math.max(8, estimatedWeeks);
    for (let i = 0; i <= weeksToShow; i++) {
      let projectedWeight;
      if (selectedGoal === GoalType.CUTTING) {
        projectedWeight = Math.max(targetWeight, currentWeight - (i * recommendedPace));
      } else if (selectedGoal === GoalType.BULKING) {
        projectedWeight = Math.min(targetWeight, currentWeight + (i * recommendedPace));
      } else {
        projectedWeight = currentWeight;
      }
      data.push({
        week: `S${i}`,
        weight: parseFloat(projectedWeight.toFixed(1))
      });
    }
    return data;
  }, [currentWeight, targetWeight, selectedGoal, recommendedPace, estimatedWeeks]);

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right duration-500 pb-24">
      <div className="flex gap-2 p-1 glass rounded-2xl">
        {Object.values(GoalType).map((goal: string) => (
          <button
            key={goal}
            onClick={() => setSelectedGoal(goal as GoalType)}
            className={`flex-1 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all duration-300 ${
              selectedGoal === goal 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {goal}
          </button>
        ))}
      </div>

      {!showInputs ? (
        <button 
          onClick={() => setShowInputs(true)}
          className="w-full aspect-[2/1] glass rounded-[28px] border-dashed border-2 border-blue-500/20 flex flex-col items-center justify-center gap-4 group hover:bg-blue-500/5 transition-all"
        >
          <Plus size={32} className="text-blue-500" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400">Nova Meta</h3>
        </button>
      ) : (
        <GlassCard className="flex flex-col gap-6 relative">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-blue-500" />
            <h4 className="text-[10px] text-gray-500 uppercase font-bold">Parâmetros de Peso</h4>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] text-gray-500 uppercase font-bold ml-1">Atual</span>
              <input 
                type="number" 
                value={currentWeight}
                onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
                className="bg-white/5 rounded-xl p-3 font-bold text-sm focus:outline-none focus:ring-1 ring-blue-500/50"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] text-gray-500 uppercase font-bold ml-1">Meta</span>
              <input 
                type="number" 
                value={targetWeight}
                onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
                className="bg-white/5 rounded-xl p-3 font-bold text-sm focus:outline-none focus:ring-1 ring-blue-500/50"
              />
            </div>
          </div>
        </GlassCard>
      )}

      <GlassCard className="h-72 p-2 flex flex-col min-h-[288px]">
        <div className="px-4 py-2">
           <h4 className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Projeção Estimada</h4>
        </div>
        <div className="flex-1 w-full min-h-0 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                labelStyle={{ fontSize: '10px', color: '#6B7280' }}
              />
              <Area type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};

export default Goals;
