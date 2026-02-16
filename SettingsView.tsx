
import React, { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { 
  Award, Zap, Shield, Crown, LogOut, ChevronRight, 
  Check, Bell, Fingerprint, Globe, X, Crown as PremiumIcon, AlertTriangle
} from 'lucide-react';

interface SettingsViewProps {
  user: any;
  onSave: (newData: any) => void;
  onLogout: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onSave, onLogout }) => {
  const [localUser, setLocalUser] = useState({ ...user });
  const [hasChanges, setHasChanges] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showPremiumInfo, setShowPremiumInfo] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const isDifferent = JSON.stringify(localUser) !== JSON.stringify(user);
    setHasChanges(isDifferent);
  }, [localUser, user]);

  const handleInputChange = (field: string, value: any) => {
    setLocalUser({ ...localUser, [field]: value });
  };

  const handleSaveClick = () => {
    onSave(localUser);
    setHasChanges(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-top duration-500 pb-32">
      <div className="px-1 mt-4">
        <h2 className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Configurações</h2>
        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Personalize sua experiência</p>
      </div>

      {/* Preferências do Sistema */}
      <div className="flex flex-col gap-2">
        <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-2 mb-1">Preferências do Sistema</h3>
        <SettingsItem 
          icon={<Bell size={18} />} 
          label="Notificações Push" 
          rightElement={
            <Toggle 
              active={localUser.notifications} 
              onToggle={() => handleInputChange('notifications', !localUser.notifications)} 
            />
          } 
        />
        <SettingsItem 
          icon={<Fingerprint size={18} />} 
          label="Biometria / FaceID" 
          rightElement={
            <Toggle 
              active={localUser.biometrics} 
              onToggle={() => handleInputChange('biometrics', !localUser.biometrics)} 
            />
          } 
        />
        <SettingsItem 
          icon={<Globe size={18} />} 
          label="Sistema de Unidades" 
          rightElement={
            <span className="text-[10px] font-black text-blue-400 uppercase cursor-pointer" onClick={() => handleInputChange('unitSystem', localUser.unitSystem === 'Metric' ? 'Imperial' : 'Metric')}>
              {localUser.unitSystem === 'Metric' ? 'Métrico' : 'Imperial'}
            </span>
          } 
        />
      </div>

      {/* Conta & Performance */}
      <div className="flex flex-col gap-2">
        <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-2 mb-1">Conta & Performance</h3>
        <SettingsItem 
          icon={<PremiumIcon size={18} />} 
          label="Assinatura Premium" 
          badge="Ativa" 
          onClick={() => setShowPremiumInfo(true)}
        />
        <SettingsItem 
          icon={<Award size={18} />} 
          label="Central de Conquistas" 
          badge="3" 
          onClick={() => setShowAchievements(true)}
        />
        {/* Botão de Encerrar Sessão com estilização vermelha */}
        <SettingsItem 
          icon={<LogOut size={18} />} 
          label="Encerrar Sessão" 
          className="text-red-400 border-red-500/10 hover:bg-red-500/5 transition-colors" 
          onClick={() => setShowLogoutConfirm(true)}
          showChevron={false}
        />
      </div>

      {/* Informação da Build */}
      <div className="text-center opacity-20 py-8">
        <p className="text-[8px] font-bold uppercase tracking-[0.3em]">MetaNutri v2.6.0 • Build #412</p>
      </div>

      {/* Modais de Informação */}
      <Modal show={showAchievements} onClose={() => setShowAchievements(false)} title="Conquistas" icon={<Award size={20} className="text-purple-400" />}>
        <div className="space-y-3">
          <AchievementItem title="Fogo nos Macros" desc="7 dias seguidos" />
          <AchievementItem title="Peso Pena" desc="Primeira meta batida" />
        </div>
      </Modal>

      <Modal show={showPremiumInfo} onClose={() => setShowPremiumInfo(false)} title="Premium" icon={<PremiumIcon size={20} className="text-blue-400" />}>
        <div className="text-center p-4">
          <h4 className="text-sm font-bold">Assinatura Anual Ativa</h4>
          <p className="text-[10px] text-gray-500 uppercase mt-2">Expira em Outubro de 2025</p>
        </div>
      </Modal>

      {/* Logout Confirmation Modal - Custom and Elegant */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="w-full max-w-xs glass rounded-[32px] p-8 border-red-500/20 flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                 <AlertTriangle size={32} />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-black tracking-tight text-white mb-2">Encerrar Sessão?</h3>
                <p className="text-[11px] text-gray-500 uppercase font-bold tracking-widest leading-relaxed">Você será desconectado e precisará inserir suas credenciais novamente.</p>
              </div>
              <div className="flex flex-col w-full gap-3">
                 <button 
                  onClick={onLogout}
                  className="w-full py-4 bg-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-red-500/10 active:scale-95 transition-all"
                 >
                   Confirmar Saída
                 </button>
                 <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-4 glass border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 active:scale-95 transition-all"
                 >
                   Cancelar
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Botão Flutuante de Salvar Alterações */}
      {hasChanges && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-[360px] animate-in slide-in-from-bottom duration-500">
          <button 
            onClick={handleSaveClick}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-xs font-bold uppercase tracking-widest text-white shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-3 active:scale-95 transition-all border border-white/20"
          >
            <Check size={18} />
            Salvar Preferências
          </button>
        </div>
      )}
    </div>
  );
};

const SettingsItem: React.FC<{ icon: React.ReactNode, label: string, badge?: string, className?: string, onClick?: () => void, rightElement?: React.ReactNode, showChevron?: boolean }> = ({ icon, label, badge, className = '', onClick, rightElement, showChevron = true }) => (
  <button 
    onClick={onClick}
    className={`w-full glass rounded-2xl p-4 flex items-center justify-between group active:scale-[0.98] transition-all border-white/5 ${className}`}
  >
    <div className="flex items-center gap-4">
      <div className="text-gray-400 group-hover:text-blue-400 transition-colors">{icon}</div>
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {badge && <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[8px] font-black">{badge}</span>}
      {rightElement}
      {showChevron && !rightElement && <ChevronRight size={16} className="text-gray-600" />}
    </div>
  </button>
);

const Toggle: React.FC<{ active: boolean, onToggle: () => void }> = ({ active, onToggle }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onToggle(); }}
    className={`w-10 h-5 rounded-full transition-all relative p-1 ${active ? 'bg-blue-600' : 'bg-white/10'}`}
  >
    <div className={`w-3 h-3 rounded-full bg-white transition-all ${active ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const AchievementItem: React.FC<{ title: string, desc: string }> = ({ title, desc }) => (
  <div className="p-4 rounded-xl glass border-white/5 flex flex-col">
    <span className="text-sm font-bold">{title}</span>
    <span className="text-[10px] text-gray-500 uppercase">{desc}</span>
  </div>
);

const Modal: React.FC<{ show: boolean, onClose: () => void, title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ show, onClose, title, icon, children }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
      <div className="w-full max-w-xs glass rounded-[32px] p-6 border-white/10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">{icon}<h3 className="text-sm font-black uppercase tracking-widest">{title}</h3></div>
          <button onClick={onClose} className="text-gray-500"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default SettingsView;
