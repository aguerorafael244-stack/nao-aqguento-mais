
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Clock, Utensils, X, Search, Apple, ChevronRight, Check, AlertCircle, Scale, Box, Droplet } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { FoodItem, Meal } from '../types';
import { SYSTEM_FOODS } from '../foodData';

interface DietProps {
  user: any;
  onUpdateUser?: (newData: any) => void;
}

const Diet: React.FC<DietProps> = ({ user, onUpdateUser }) => {
  const [showMealModal, setShowMealModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState<string | null>(null);
  const [newMeal, setNewMeal] = useState({ name: '', time: '08:00' });
  const [foodSearch, setFoodSearch] = useState('');
  const [quantity, setQuantity] = useState<number>(100);
  const [selectedUnit, setSelectedUnit] = useState<'g' | 'un' | 'ml'>('g');
  const [baseFood, setBaseFood] = useState<FoodItem | null>(null);
  const [newFood, setNewFood] = useState({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 });

  const meals = user?.mealHistory || [];
  const userLibrary = user?.foodDatabase || [];

  const allAvailableFoods = useMemo(() => [...SYSTEM_FOODS, ...userLibrary], [userLibrary]);

  const totals = useMemo(() => {
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

  const isMealTime = (mealTime: string) => {
    const now = new Date();
    const [hours, minutes] = mealTime.split(':').map(Number);
    const mealDate = new Date();
    mealDate.setHours(hours, minutes, 0, 0);
    return now >= mealDate;
  };

  const updateMealStatus = (mealId: string, status: 'completed' | 'failed' | 'pending') => {
    const updatedMeals = meals.map((m: Meal) => {
      if (m.id === mealId) {
        return { ...m, status, lastStatusDate: new Date().toISOString() };
      }
      return m;
    });
    onUpdateUser?.({ ...user, mealHistory: updatedMeals });
  };

  const addMeal = () => {
    if (!newMeal.name) return;
    const meal: Meal = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMeal.name,
      time: newMeal.time,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      status: 'pending',
      items: []
    };
    onUpdateUser?.({ ...user, mealHistory: [...meals, meal] });
    setShowMealModal(false);
  };

  const removeMeal = (id: string) => {
    onUpdateUser?.({ ...user, mealHistory: meals.filter((m: Meal) => m.id !== id) });
  };

  const addFood = (mealId: string) => {
    if (!newFood.name) return;
    const updatedMeals = meals.map((m: Meal) => {
      if (m.id === mealId) {
        const foodWithQty = { ...newFood, name: `${newFood.name} (${quantity}${selectedUnit})` };
        const items = [...(m.items || []), { ...foodWithQty, id: Math.random().toString() }];
        return {
          ...m,
          items,
          calories: items.reduce((sum: number, i: any) => sum + (i.calories || 0), 0),
          protein: items.reduce((sum: number, i: any) => sum + (i.protein || 0), 0),
          carbs: items.reduce((sum: number, i: any) => sum + (i.carbs || 0), 0),
          fat: items.reduce((sum: number, i: any) => sum + (i.fat || 0), 0),
        };
      }
      return m;
    });
    onUpdateUser?.({ ...user, mealHistory: updatedMeals });
    setFoodSearch('');
    setBaseFood(null);
    setShowFoodModal(null);
  };

  const removeFood = (mealId: string, foodId: string) => {
    const updatedMeals = meals.map((m: Meal) => {
      if (m.id === mealId) {
        const items = (m.items || []).filter(i => i.id !== foodId);
        return {
          ...m,
          items,
          calories: items.reduce((sum: number, i: any) => sum + (i.calories || 0), 0),
          protein: items.reduce((sum: number, i: any) => sum + (i.protein || 0), 0),
          carbs: items.reduce((sum: number, i: any) => sum + (i.carbs || 0), 0),
          fat: items.reduce((sum: number, i: any) => sum + (i.fat || 0), 0),
        };
      }
      return m;
    });
    onUpdateUser?.({ ...user, mealHistory: updatedMeals });
  };

  useEffect(() => {
    if (baseFood) {
      let multiplier = (selectedUnit === 'g' || selectedUnit === 'ml') 
        ? quantity / 100 
        : (quantity * (baseFood.gramsPerUnit || 100)) / 100;
        
      setNewFood({
        name: baseFood.name,
        calories: Math.round(baseFood.calories * multiplier),
        protein: parseFloat((baseFood.protein * multiplier).toFixed(1)),
        carbs: parseFloat((baseFood.carbs * multiplier).toFixed(1)),
        fat: parseFloat((baseFood.fat * multiplier).toFixed(1))
      });
    }
  }, [quantity, selectedUnit, baseFood]);

  const filteredFoods = useMemo(() => {
    if (!foodSearch || baseFood) return [];
    return allAvailableFoods.filter(f => f.name.toLowerCase().includes(foodSearch.toLowerCase())).slice(0, 10);
  }, [foodSearch, baseFood, allAvailableFoods]);

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom duration-500 pb-28">
      <GlassCard className="p-5 bg-gradient-to-br from-blue-900/10 to-transparent border-blue-500/10">
        <h4 className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-4">Consumo Concluído (Check-in)</h4>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div><p className="text-lg font-black">{totals.calories}</p><p className="text-[8px] text-gray-500 uppercase font-bold">Kcal</p></div>
          <div><p className="text-lg font-black text-purple-400">{totals.protein.toFixed(0)}g</p><p className="text-[8px] text-gray-500 uppercase font-bold">Prot</p></div>
          <div><p className="text-lg font-black text-green-400">{totals.carbs.toFixed(0)}g</p><p className="text-[8px] text-gray-500 uppercase font-bold">Carb</p></div>
          <div><p className="text-lg font-black text-yellow-500">{totals.fat.toFixed(1)}g</p><p className="text-[8px] text-gray-500 uppercase font-bold">Gord</p></div>
        </div>
      </GlassCard>

      <div className="flex flex-col gap-4">
        {meals.map((m: Meal) => {
          const ready = isMealTime(m.time);
          const isCompleted = m.status === 'completed';
          const isFailed = m.status === 'failed';

          return (
            <GlassCard 
              key={m.id} 
              className={`p-0 overflow-hidden border-2 transition-all duration-500 ${
                isCompleted ? 'border-green-500/40 bg-green-500/5' : 
                isFailed ? 'border-red-500/40 bg-red-500/5' : 
                'border-white/5'
              }`}
            >
              <div className="p-4 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isCompleted ? 'bg-green-500/20 text-green-400' : isFailed ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {isCompleted ? <Check size={18} /> : isFailed ? <AlertCircle size={18} /> : <Utensils size={18} />}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">{m.name}</h5>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <Clock size={10} /> {m.time}
                      {!ready && <span className="ml-1 text-[8px] text-blue-400 font-black uppercase tracking-tighter">(Em breve)</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="block text-xs font-black text-blue-400">{m.calories.toFixed(0)} kcal</span>
                  </div>
                  <button onClick={() => removeMeal(m.id)} className="p-2 text-gray-700 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>

              <div className="px-4 py-3 bg-white/[0.01] border-y border-white/[0.03] flex justify-between items-center">
                <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Ações de Check-in:</p>
                <div className="flex gap-2">
                  <button 
                    disabled={!ready}
                    onClick={() => updateMealStatus(m.id, 'completed')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                      isCompleted ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 
                      'bg-white/5 text-gray-500 hover:text-green-400 disabled:opacity-30'
                    }`}
                  >
                    <Check size={12} /> Concluir
                  </button>
                  <button 
                    disabled={!ready}
                    onClick={() => updateMealStatus(m.id, 'failed')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                      isFailed ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 
                      'bg-white/5 text-gray-500 hover:text-red-400 disabled:opacity-30'
                    }`}
                  >
                    <X size={12} /> Fracasso
                  </button>
                </div>
              </div>

              <div className="p-4 flex flex-col gap-2">
                {m.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0 group">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-300">{item.name}</span>
                      <span className="text-[9px] text-gray-600 uppercase font-bold">{item.calories.toFixed(0)} kcal • {item.protein}g P</span>
                    </div>
                    <button onClick={() => removeFood(m.id, item.id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-700 hover:text-red-400 transition-all"><X size={12} /></button>
                  </div>
                ))}
                {!isCompleted && !isFailed && (
                  <button 
                    onClick={() => { setShowFoodModal(m.id); setFoodSearch(''); setBaseFood(null); setQuantity(100); }}
                    className="mt-2 w-full py-2 border border-dashed border-white/10 rounded-xl text-[9px] font-bold uppercase text-gray-500 hover:text-blue-400 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={12} /> Adicionar Alimento
                  </button>
                )}
              </div>
            </GlassCard>
          );
        })}

        <button 
          onClick={() => setShowMealModal(true)} 
          className="w-full h-20 glass rounded-[28px] border-dashed border-2 border-blue-500/20 flex flex-col items-center justify-center gap-2 text-blue-400 hover:bg-blue-500/5 transition-all active:scale-[0.98]"
        >
          <Plus size={20} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Nova Refeição</span>
        </button>
      </div>

      {showFoodModal && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <GlassCard className="w-full max-w-[340px] p-6 border-white/10 shadow-2xl flex flex-col gap-5 overflow-visible">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Apple size={18} className="text-blue-400" />
                <h3 className="text-sm font-black uppercase tracking-widest">Adicionar Item</h3>
              </div>
              <button onClick={() => setShowFoodModal(null)} className="p-1 text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
            </div>

            <div className="flex flex-col gap-4">
              {!baseFood ? (
                <div className="flex flex-col gap-2 relative">
                  <label className="text-[8px] text-gray-500 uppercase font-black tracking-widest ml-1">Pesquisar na Biblioteca</label>
                  <div className="glass rounded-xl flex items-center px-4 py-3 border-white/10 bg-white/5 focus-within:border-blue-500/50 transition-all">
                    <Search size={16} className="text-gray-500 mr-3 shrink-0" />
                    <input 
                      autoFocus
                      className="bg-transparent flex-1 text-sm focus:outline-none placeholder:text-gray-600"
                      placeholder="Ex: Frango, Arroz..."
                      value={foodSearch}
                      onChange={e => setFoodSearch(e.target.value)}
                    />
                  </div>
                  
                  {filteredFoods.length > 0 && (
                    <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-[110] glass rounded-xl border-white/10 overflow-hidden shadow-2xl max-h-[200px] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                      {filteredFoods.map(food => (
                        <button 
                          key={food.id} 
                          onClick={() => { setBaseFood(food); setSelectedUnit(food.unit || 'g'); }}
                          className="w-full p-4 text-left border-b border-white/5 hover:bg-white/10 flex justify-between items-center group active:bg-blue-500/20"
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">{food.name}</span>
                            <span className="text-[9px] text-gray-500 uppercase">{food.calories} kcal / {food.unit === 'un' ? 'un' : food.unit === 'ml' ? '100ml' : '100g'}</span>
                          </div>
                          <ChevronRight size={14} className="text-gray-700" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                  <div className="glass p-4 rounded-2xl border-blue-500/20 bg-blue-500/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                        {selectedUnit === 'un' ? <Box size={16} /> : selectedUnit === 'ml' ? <Droplet size={16} /> : <Scale size={16} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white">{baseFood.name}</h4>
                        <p className="text-[9px] text-gray-500 uppercase font-bold">Ajuste a porção abaixo</p>
                      </div>
                    </div>
                    <button onClick={() => setBaseFood(null)} className="p-1 text-gray-500 hover:text-red-400">
                      <RotateCcw size={14} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[8px] text-gray-500 uppercase font-black tracking-widest ml-1">Quantidade</label>
                    <div className="glass rounded-2xl flex items-center p-2 border-white/10 bg-white/5">
                      <input 
                        type="number" 
                        className="bg-transparent flex-1 py-3 text-xl font-black focus:outline-none tracking-tighter px-2 min-w-0" 
                        value={quantity} 
                        onChange={e => setQuantity(parseFloat(e.target.value) || 0)} 
                      />
                      <div className="flex bg-white/5 p-1 rounded-xl gap-0.5 border border-white/5 shrink-0">
                        <button 
                          onClick={() => setSelectedUnit('g')} 
                          className={`px-2.5 py-1.5 rounded-lg text-[7px] font-black uppercase transition-all ${selectedUnit === 'g' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}
                        >G</button>
                        <button 
                          onClick={() => setSelectedUnit('ml')} 
                          className={`px-2.5 py-1.5 rounded-lg text-[7px] font-black uppercase transition-all ${selectedUnit === 'ml' ? 'bg-blue-400 text-white shadow-lg' : 'text-gray-500'}`}
                        >ML</button>
                        <button 
                          onClick={() => setSelectedUnit('un')} 
                          className={`px-2.5 py-1.5 rounded-lg text-[7px] font-black uppercase transition-all ${selectedUnit === 'un' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500'}`}
                        >UN</button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 py-2">
                    <div className="text-center"><p className="text-xs font-black">{newFood.calories}</p><p className="text-[7px] text-gray-500 uppercase">kcal</p></div>
                    <div className="text-center"><p className="text-xs font-black text-purple-400">{newFood.protein}g</p><p className="text-[7px] text-gray-500 uppercase">prot</p></div>
                    <div className="text-center"><p className="text-xs font-black text-green-400">{newFood.carbs}g</p><p className="text-[7px] text-gray-500 uppercase">carb</p></div>
                    <div className="text-center"><p className="text-xs font-black text-yellow-500">{newFood.fat}g</p><p className="text-[7px] text-gray-500 uppercase">gord</p></div>
                  </div>

                  <button 
                    onClick={() => addFood(showFoodModal)} 
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-500/20 active:scale-95 transition-all mt-2"
                  >
                    Salvar Item
                  </button>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      )}

      {showMealModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <GlassCard className="w-full max-w-xs p-6 border-white/10 shadow-2xl">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-center">Configurar Refeição</h3>
            <div className="flex flex-col gap-4">
              <input className="bg-white/5 rounded-xl p-3 text-sm focus:outline-none ring-1 ring-white/5" placeholder="Nome (ex: Almoço)" value={newMeal.name} onChange={e => setNewMeal({...newMeal, name: e.target.value})} />
              <input type="time" className="bg-white/5 rounded-xl p-3 text-sm focus:outline-none ring-1 ring-white/5" value={newMeal.time} onChange={e => setNewMeal({...newMeal, time: e.target.value})} />
              <button onClick={addMeal} className="w-full py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white mt-2 active:scale-95 transition-all">Criar Agora</button>
              <button onClick={() => setShowMealModal(false)} className="w-full py-2 text-[10px] font-bold uppercase text-gray-500">Cancelar</button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

const RotateCcw = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export default Diet;
