
import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { 
  Award, Zap, Shield, Crown, LogOut, ChevronRight, 
  Scale, User, Ruler, Camera, Save, Edit2, Check, 
  Bell, Fingerprint, Globe, X, Info, Star, Activity as ActivityIcon
} from 'lucide-react';

interface ProfileViewProps {
  user: any;
  onSave: (newData: any) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onSave }) => {
  const [localUser, setLocalUser] = useState({ ...user });
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Basic difference check for save button visibility
    const isDifferent = JSON.stringify(localUser) !== JSON.stringify(user);
    setHasChanges(isDifferent);
  }, [localUser, user]);

  const bmi = (localUser.weight / Math.pow(localUser.height / 100, 2)).toFixed(1);

  const handleInputChange = (field: string, value: any) => {
    setLocalUser({ ...localUser, [field]: value });
  };

  const handleSaveClick = () => {
    onSave(localUser);
    setHasChanges(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right duration-500 pb-32 relative">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => handleInputChange('profilePic', reader.result as string);
            reader.readAsDataURL(file);
          }
        }} 
      />

      {/* Hero Profile Section */}
      <div className="flex flex-col items-center gap-4 mt-4">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full group-hover:opacity-40 transition-opacity"></div>
          <div className="relative z-10">
            <img 
              src={localUser.profilePic} 
              alt="Profile" 
              className="w-32 h-32 rounded-full border-4 border-blue-500/30 p-1 shadow-2xl object-cover transition-transform group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-white" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600 rounded-full border-4 border-[#0B1020] flex items-center justify-center z-20 shadow-lg">
            <Crown size={14} className="text-white" />
          </div>
        </div>
        <div className="text-center w-full px-4">
          <input 
            className="text-2xl font-black tracking-tight bg-transparent text-center border-b border-transparent focus:border-blue-500/50 focus:outline-none w-full max-w-[250px]"
            value={localUser.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">Atleta Nível {localUser.level} • {localUser.status}</p>
        </div>
      </div>

      {/* Level Card */}
      <GlassCard className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/10">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-widest">Progresso de Carreira</span>
          </div>
          <span className="text-[10px] font-bold text-gray-400">{localUser.xp}/{localUser.xpTotal} XP</span>
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-purple-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-1000"
            style={{ width: `${(localUser.xp / localUser.xpTotal) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[8px] text-gray-500 font-bold uppercase">Nvl {localUser.level}</span>
          <span className="text-[8px] text-gray-500 font-bold uppercase">Nvl {localUser.level + 1}</span>
        </div>
      </GlassCard>

      {/* Biometric Grid - Increased input widths to avoid decimal cut-off */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-[24px] p-3 flex flex-col items-center gap-1 border-white/5 relative group">
          <Ruler size={14} className="text-gray-500" />
          <span className="text-[8px] text-gray-500 font-bold uppercase">Altura</span>
          <div className="flex items-center">
            <input 
              type="number" 
              step="0.1"
              className="text-sm font-black bg-transparent w-14 text-center focus:outline-none"
              value={localUser.height}
              onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
            />
            <span className="text-[8px] text-gray-500">cm</span>
          </div>
        </div>
        <div className="glass rounded-[24px] p-3 flex flex-col items-center gap-1 border-white/5 relative group">
          <Scale size={14} className="text-gray-500" />
          <span className="text-[8px] text-gray-500 font-bold uppercase">Peso</span>
          <div className="flex items-center">
            <input 
              type="number" 
              className="text-sm font-black bg-transparent w-14 text-center focus:outline-none"
              value={localUser.weight}
              step="0.1"
              onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
            />
            <span className="text-[8px] text-gray-500">kg</span>
          </div>
        </div>
        <div className="glass rounded-[24px] p-3 flex flex-col items-center gap-1 border-blue-500/20 bg-blue-500/5">
          <div className="w-3.5 h-3.5"><ActivityIcon size={14} className="text-blue-400" /></div>
          <span className="text-[8px] text-blue-400 font-bold uppercase">IMC</span>
          <span className="text-sm font-black text-blue-400">{bmi}</span>
        </div>
      </div>

      {/* Info Card */}
      <GlassCard className="border-white/5">
         <h4 className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-4">Informações de Perfil</h4>
         <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
               <span className="text-xs text-gray-400">Idade</span>
               <span className="text-xs font-bold">{localUser.age} anos</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
               <span className="text-xs text-gray-400">Plano</span>
               <span className="text-xs font-bold text-blue-400">{localUser.status}</span>
            </div>
            <div className="flex justify-between items-center py-2">
               <span className="text-xs text-gray-400">Desde</span>
               <span className="text-xs font-bold">Jan 2024</span>
            </div>
         </div>
      </GlassCard>

      {/* Floating Save Button */}
      {hasChanges && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-[360px] animate-in slide-in-from-bottom duration-500">
          <button 
            onClick={handleSaveClick}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-xs font-bold uppercase tracking-widest text-white shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-3 active:scale-95 transition-all border border-white/20"
          >
            <Check size={18} />
            Salvar Alterações
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
