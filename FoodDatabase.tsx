
import React, { useState, useMemo } from 'react';
import { GlassCard } from './GlassCard';
import { FoodItem } from '../types';
import { Plus, Trash2, Search, Apple, BookOpen, Scale, Box, Droplet } from 'lucide-react';
import { SYSTEM_FOODS } from '../foodData';

interface FoodDatabaseProps {
  user: any;
  onUpdateUser: (newData: any) => void;
}

const FoodDatabase: React.FC<FoodDatabaseProps> = ({ user, onUpdateUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFood, setNewFood] = useState({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0, unit: 'g' as 'g' | 'un' | 'ml' });

  const userLibrary = user?.foodDatabase || [];

  const combinedLibrary = useMemo(() => {
    const systemMapped = SYSTEM_FOODS.map(f => ({ ...f, source: 'system' }));
    const userMapped = userLibrary.map((f: FoodItem) => ({ ...f, source: 'user' }));
    return [...systemMapped, ...userMapped];
  }, [userLibrary]);

  const filteredDatabase = combinedLibrary.filter((f: any) => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addFoodToLibrary = () => {
    if (!newFood.name) return;
    const food: FoodItem = {
      ...newFood,
      id: Math.random().toString(36).substr(2, 9)
    };
    onUpdateUser({ ...user, foodDatabase: [...userLibrary, food] });
    setNewFood({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0, unit: 'g' });
    setShowAddModal(false);
  };

  const removeFoodFromLibrary = (id: string) => {
    onUpdateUser({ ...user, foodDatabase: userLibrary.filter((f: FoodItem) => f.id !== id) });
  };

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right duration-500 pb-28">
      <div className="px-1 mt-2">
        <h2 className="text-xl font-black tracking-tight text-white">Minha Biblioteca</h2>
        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Alimentos base cadastrados</p>
      </div>

      <GlassCard className="bg-blue-500/5 border-blue-500/20 py-4 px-5">
        <div className="flex gap-3">
          <BookOpen size={16} className="text-blue-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Todos os itens abaixo podem ser buscados na aba <b>Dieta</b>. O sistema identifica se devem ser medidos em gramas, unidades ou mililitros.
          </p>
        </div>
      </GlassCard>

      <div className="flex gap-2">
        <div className="flex-1 glass rounded-2xl flex items-center px-3 border-white/5">
          <Search size={16} className="text-gray-500 mr-2" />
          <input 
            className="bg-transparent flex-1 py-3 text-sm focus:outline-none" 
            placeholder="Buscar na biblioteca..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {filteredDatabase.length === 0 ? (
          <div className="py-12 text-center opacity-30">
            <Apple size={40} className="mx-auto mb-4" />
            <p className="text-xs font-bold uppercase">Biblioteca vazia</p>
          </div>
        ) : (
          filteredDatabase.map((food: any) => (
            <GlassCard key={food.id} className={`p-4 flex items-center justify-between border-white/5 transition-all ${food.source === 'system' ? 'bg-blue-500/5' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${food.source === 'system' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                  {food.unit === 'un' ? <Box size={14} /> : food.unit === 'ml' ? <Droplet size={14} /> : <Scale size={14} />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{food.name}</h4>
                  <p className="text-[9px] text-gray-500 uppercase font-bold">
                    {food.calories} kcal • {food.unit === 'un' ? 'Unidade' : food.unit === 'ml' ? '100ml' : '100g'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                 <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${food.source === 'system' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                   {food.source === 'system' ? 'Sistema' : 'Manual'}
                 </span>
                 {food.source === 'user' && (
                    <button onClick={() => removeFoodFromLibrary(food.id)} className="p-2 text-gray-700 hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                 )}
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <GlassCard className="w-full max-w-sm p-6 border-white/10 shadow-2xl">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6">Cadastrar Alimento</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[8px] text-gray-500 uppercase font-bold ml-1">Nome do Alimento</label>
                <input 
                  autoFocus
                  className="bg-white/5 rounded-xl p-3 text-sm focus:outline-none ring-1 ring-white/5"
                  value={newFood.name}
                  onChange={e => setNewFood({...newFood, name: e.target.value})}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8px] text-gray-500 uppercase font-bold ml-1">Medida Principal</label>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => setNewFood({...newFood, unit: 'g'})}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${newFood.unit === 'g' ? 'bg-blue-600' : 'bg-white/5'}`}
                  >Gramas</button>
                  <button 
                    onClick={() => setNewFood({...newFood, unit: 'ml'})}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${newFood.unit === 'ml' ? 'bg-blue-400' : 'bg-white/5'}`}
                  >ML</button>
                  <button 
                    onClick={() => setNewFood({...newFood, unit: 'un'})}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${newFood.unit === 'un' ? 'bg-purple-600' : 'bg-white/5'}`}
                  >Unidades</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] text-gray-500 uppercase font-bold ml-1">Kcal ({newFood.unit === 'un' ? 'Unid' : '100g/ml'})</label>
                  <input type="number" className="bg-white/5 rounded-xl p-3 text-sm focus:outline-none" value={newFood.calories} onChange={e => setNewFood({...newFood, calories: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] text-gray-500 uppercase font-bold ml-1">Proteína (g)</label>
                  <input type="number" className="bg-white/5 rounded-xl p-3 text-sm focus:outline-none" value={newFood.protein} onChange={e => setNewFood({...newFood, protein: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] text-gray-500 uppercase font-bold ml-1">Carbo (g)</label>
                  <input type="number" className="bg-white/5 rounded-xl p-3 text-sm focus:outline-none" value={newFood.carbs} onChange={e => setNewFood({...newFood, carbs: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] text-gray-500 uppercase font-bold ml-1">Gordura (g)</label>
                  <input type="number" className="bg-white/5 rounded-xl p-3 text-sm focus:outline-none" value={newFood.fat} onChange={e => setNewFood({...newFood, fat: parseFloat(e.target.value) || 0})} />
                </div>
              </div>
              <button onClick={addFoodToLibrary} className="w-full py-4 bg-blue-600 rounded-2xl text-[10px] font-bold uppercase text-white mt-2 active:scale-95 transition-all">
                Salvar na Biblioteca
              </button>
              <button onClick={() => setShowAddModal(false)} className="w-full py-2 text-[10px] font-bold uppercase text-gray-500">
                Cancelar
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default FoodDatabase;
