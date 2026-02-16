
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { GlassCard } from './GlassCard';
import { 
  Beef, 
  Wheat, 
  CircleDashed,
  Zap
} from 'lucide-react';
import { Meal } from '../types';

interface DashboardProps {
  user: any;
  onUpdateUser?: (newData: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onUpdateUser }) => {
  const meals = user?.mealHistory || [];
  
  const consumedMacros = useMemo(() => {
    return meals.reduce((acc: any, meal: Meal) => {
      if (meal.status !== 'completed') return acc;
      return {
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0),
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [meals]);

  const calorieGoal = user.goal === 'Bulking' ? 3000 : user.goal === 'Cutting' ? 2000 : 2400;
  const caloriePercentage = Math.min(100, Math.round((consumedMacros.calories / calorieGoal) * 100));

  const macroStats = [
    { label: 'Proteínas', consumed: consumedMacros.protein, goal: user.goal === 'Bulking' ? 200 : 180, icon: <Beef size={18} />, color: '#A855F7' },
    { label: 'Carbos', consumed: consumedMacros.carbs, goal: user.goal === 'Bulking' ? 400 : 250, icon: <Wheat size={18} />, color: '#22C55E' },
    { label: 'Gorduras', consumed: consumedMacros.fat, goal: 70, icon: <CircleDashed size={18} />, color: '#EAB308' },
  ];

  const chartData = [
    { value: caloriePercentage, color: '#3B82F6' },
    { value: 100 - caloriePercentage, color: 'rgba(255,255,255,0.05)' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <GlassCard className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-400/20 p-4 text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Zap size={18} className="text-blue-400" />
          </div>
          <div>
            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Status do Sistema</h4>
            <p className="text-[11px] font-bold text-white mt-0.5 leading-tight">Motor metabólico operando em {caloriePercentage}% da carga.</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="relative overflow-hidden pt-8 pb-6 text-center">
        <h3 className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-2">Energia Diária</h3>
        <div className="w-full h-40 relative flex items-center justify-center min-h-[160px] min-w-0">
          <ResponsiveContainer width="100%" height="100%" minHeight={160}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="80%"
                startAngle={180}
                endAngle={0}
                innerRadius={70}
                outerRadius={90}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((_entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={chartData[index].color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
            <span className="text-4xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent">{caloriePercentage}%</span>
            <span className="text-gray-600 text-[8px] uppercase tracking-widest mt-1">Concluído</span>
          </div>
        </div>
        <div className="flex flex-col items-center mt-[-10px]">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black">{consumedMacros.calories.toFixed(0)}</span>
            <span className="text-xs font-medium text-gray-500">/ {calorieGoal} kcal</span>
          </div>
        </div>
      </GlassCard>

      {/* Seção de Macronutrientes - Agora em lista vertical de largura total */}
      <div className="flex flex-col gap-4 text-left">
        {macroStats.map((macro) => (
          <GlassCard key={macro.label} className="p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/5" style={{color: macro.color}}>{macro.icon}</div>
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{macro.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-black">{macro.consumed.toFixed(0)}g</span>
                <span className="text-[9px] text-gray-600 uppercase font-bold">/ {macro.goal}g</span>
              </div>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.1)]" 
                style={{ 
                  width: `${Math.min(100, (macro.consumed / macro.goal) * 100)}%`, 
                  backgroundColor: macro.color 
                }} 
              />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
