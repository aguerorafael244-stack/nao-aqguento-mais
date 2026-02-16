
import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { Mail, Lock, User, ChevronRight, Check, Zap, Target, Activity, Award, ArrowLeft, Ruler, Scale, Percent } from 'lucide-react';

interface AuthFlowProps {
  onComplete: (user: any) => void;
}

type AuthView = 'login' | 'signup' | 'quiz';

const AuthFlow: React.FC<AuthFlowProps> = ({ onComplete }) => {
  const [view, setView] = useState<AuthView>('login');
  const [quizStep, setQuizStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    goal: 'Maintenance',
    activityLevel: 'Active',
    motivation: 'Performance',
    height: 175,
    weight: 75,
    bodyFat: 15
  });

  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const stored = localStorage.getItem(`user_${formData.email.toLowerCase()}`);
    if (stored) {
      const user = JSON.parse(stored);
      if (user.password === formData.password) {
        onComplete(user);
      } else {
        setError('Senha incorreta.');
      }
    } else {
      setError('E-mail não cadastrado.');
    }
  };

  const handleSignUpStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setError('');
    setView('quiz');
  };

  const finishOnboarding = () => {
    const today = new Date().toISOString().split('T')[0];
    const newUser = {
      ...formData,
      email: formData.email.toLowerCase(),
      level: 1,
      xp: 0,
      xpTotal: 100,
      status: 'Iniciante',
      profilePic: `https://picsum.photos/150/150?random=${Math.random()}`,
      notifications: true,
      biometrics: false,
      unitSystem: 'Metric',
      weightHistory: [{ day: 'Hoje', weight: formData.weight, fullDate: today }],
      targetWeight: formData.weight,
      mealHistory: [],
      foodDatabase: [],
      consistencyData: [0, 0, 0, 0, 0, 0, 0],
      registrationDate: today,
      waterIntake: 0,
      waterGoal: 2500,
      lastWaterReset: new Date().toISOString()
    };
    
    localStorage.setItem(`user_${newUser.email}`, JSON.stringify(newUser));
    onComplete(newUser);
  };

  const renderLogin = () => (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-black tracking-tight mb-2">Bem-vindo de volta</h2>
        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Acesse sua performance</p>
      </div>
      
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div className="glass rounded-2xl flex items-center p-1 border-white/5 focus-within:border-blue-500/50 transition-all">
          <div className="p-3 text-gray-500"><Mail size={18} /></div>
          <input 
            type="email" 
            placeholder="E-mail" 
            required
            className="bg-transparent flex-1 py-3 text-sm focus:outline-none"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="glass rounded-2xl flex items-center p-1 border-white/5 focus-within:border-blue-500/50 transition-all">
          <div className="p-3 text-gray-500"><Lock size={18} /></div>
          <input 
            type="password" 
            placeholder="Senha" 
            required
            className="bg-transparent flex-1 py-3 text-sm focus:outline-none"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
        </div>
        {error && <p className="text-[10px] text-red-400 font-bold uppercase text-center">{error}</p>}
        <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white shadow-xl shadow-blue-500/20 active:scale-95 transition-all mt-4">
          Entrar no Sistema
        </button>
      </form>

      <div className="text-center">
        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Não tem conta?</p>
        <button onClick={() => { setView('signup'); setError(''); }} className="text-[10px] text-blue-400 uppercase font-black mt-1 hover:underline">Criar Nova Conta</button>
      </div>
    </div>
  );

  const renderSignUp = () => (
    <div className="flex flex-col gap-8 animate-in slide-in-from-right duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-black tracking-tight mb-2">Começar Jornada</h2>
        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Crie seu perfil inteligente</p>
      </div>

      <form onSubmit={handleSignUpStart} className="flex flex-col gap-4">
        <div className="glass rounded-2xl flex items-center p-1 border-white/5">
          <div className="p-3 text-gray-500"><User size={18} /></div>
          <input 
            type="text" 
            placeholder="Nome Completo" 
            required
            className="bg-transparent flex-1 py-3 text-sm focus:outline-none"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="glass rounded-2xl flex items-center p-1 border-white/5">
          <div className="p-3 text-gray-500"><Mail size={18} /></div>
          <input 
            type="email" 
            placeholder="E-mail" 
            required
            className="bg-transparent flex-1 py-3 text-sm focus:outline-none"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="glass rounded-2xl flex items-center p-1 border-white/5">
          <div className="p-3 text-gray-500"><Lock size={18} /></div>
          <input 
            type="password" 
            placeholder="Senha" 
            required
            className="bg-transparent flex-1 py-3 text-sm focus:outline-none"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
        </div>
        <div className="glass rounded-2xl flex items-center p-1 border-white/5">
          <div className="p-3 text-gray-500"><Lock size={18} /></div>
          <input 
            type="password" 
            placeholder="Repetir Senha" 
            required
            className="bg-transparent flex-1 py-3 text-sm focus:outline-none"
            value={formData.confirmPassword}
            onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
          />
        </div>
        {error && <p className="text-[10px] text-red-400 font-bold uppercase text-center">{error}</p>}
        <button type="submit" className="w-full py-4 bg-blue-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white shadow-xl shadow-blue-500/10 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2">
          Avançar para o Quiz <ChevronRight size={16} />
        </button>
      </form>

      <div className="text-center">
        <button onClick={() => { setView('login'); setError(''); }} className="text-[10px] text-gray-500 uppercase font-black hover:text-white transition-colors">Voltar para Login</button>
      </div>
    </div>
  );

  const renderQuiz = () => {
    const steps = [
      {
        id: 1,
        type: 'choice',
        title: "Estratégia",
        question: "Qual sua meta imediata?",
        options: [
          { value: 'Bulking', label: 'Ganho de Massa', icon: <Zap className="text-orange-400" /> },
          { value: 'Cutting', label: 'Queima de Gordura', icon: <Activity className="text-blue-400" /> },
          { value: 'Maintenance', label: 'Manutenção Estética', icon: <Award className="text-purple-400" /> }
        ],
        field: 'goal'
      },
      {
        id: 2,
        type: 'choice',
        title: "Metabolismo",
        question: "Nível de atividade física?",
        options: [
          { value: 'Sedentary', label: 'Leve (1-2x/sem)', icon: <Activity size={18} /> },
          { value: 'Active', label: 'Moderado (3-5x/sem)', icon: <Zap size={18} /> },
          { value: 'Athlete', label: 'Intenso (6-7x/sem)', icon: <Target size={18} /> }
        ],
        field: 'activityLevel'
      },
      {
        id: 3,
        type: 'choice',
        title: "Motor Local",
        question: "Qual seu foco de análise?",
        options: [
          { value: 'Performance', label: 'Performance Pura', icon: <Zap size={18} /> },
          { value: 'Health', label: 'Saúde & Bem-estar', icon: <Check size={18} /> },
          { value: 'Esthetic', label: 'Definição Visual', icon: <Target size={18} /> }
        ],
        field: 'motivation'
      },
      {
        id: 4,
        type: 'input',
        title: "Biometria",
        question: "Qual sua altura atual?",
        field: 'height',
        unit: 'cm',
        icon: <Ruler className="text-blue-400" />
      },
      {
        id: 5,
        type: 'input',
        title: "Biometria",
        question: "Qual seu peso hoje?",
        field: 'weight',
        unit: 'kg',
        icon: <Scale className="text-purple-400" />
      },
      {
        id: 6,
        type: 'input',
        title: "Biometria",
        question: "Qual seu % de gordura?",
        field: 'bodyFat',
        unit: '%',
        icon: <Percent className="text-pink-400" />
      }
    ];

    const currentStep = steps.find(s => s.id === quizStep)!;

    const handleBack = () => {
      if (quizStep > 1) {
        setQuizStep(quizStep - 1);
      } else {
        setView('signup');
      }
    };

    return (
      <div className="flex flex-col gap-8 animate-in slide-in-from-bottom duration-500 h-full">
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500 neon-blue"
            style={{ width: `${(quizStep / steps.length) * 100}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between">
           <button 
             onClick={handleBack}
             className="flex items-center gap-2 px-3 py-1.5 glass rounded-full text-gray-400 hover:text-white transition-all active:scale-95 group"
           >
             <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
             <span className="text-[10px] font-black uppercase tracking-widest">Voltar</span>
           </button>
           <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{currentStep.title} (Etapa {quizStep}/{steps.length})</span>
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight leading-tight">{currentStep.question}</h2>
        </div>

        {currentStep.type === 'choice' ? (
          <div className="flex flex-col gap-3">
            {currentStep.options?.map(opt => (
              <button 
                key={opt.value}
                onClick={() => {
                  setFormData({...formData, [currentStep.field]: opt.value});
                  if (quizStep < steps.length) {
                    setQuizStep(quizStep + 1);
                  } else {
                    finishOnboarding();
                  }
                }}
                className={`w-full p-6 glass rounded-[28px] flex items-center justify-between group active:scale-[0.98] transition-all ${formData[currentStep.field as keyof typeof formData] === opt.value ? 'bg-blue-600/10 border-blue-500/50' : 'border-white/5'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                    {opt.icon}
                  </div>
                  <span className="text-sm font-bold">{opt.label}</span>
                </div>
                <ChevronRight size={18} className="text-gray-600 group-hover:text-blue-500" />
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center mb-2">
                {currentStep.icon}
              </div>
              <div className="flex items-baseline gap-2">
                <input 
                  type="number"
                  step="0.1"
                  autoFocus
                  className="bg-transparent text-5xl font-black text-center w-40 focus:outline-none tracking-tighter"
                  value={formData[currentStep.field as keyof typeof formData]}
                  onChange={e => setFormData({...formData, [currentStep.field]: parseFloat(e.target.value) || 0})}
                />
                <span className="text-xl font-bold text-blue-500">{currentStep.unit}</span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <button 
                onClick={handleBack}
                className="flex-1 py-5 glass border-white/5 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Voltar
              </button>
              <button 
                onClick={() => {
                  if (quizStep < steps.length) {
                    setQuizStep(quizStep + 1);
                  } else {
                    finishOnboarding();
                  }
                }}
                className="flex-[2] py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[24px] text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-2xl shadow-blue-600/30 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <span>Continuar</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden bg-[#0B1020]">
      <div className="absolute top-0 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px]"></div>

      <div className="w-full max-sm:px-4 max-w-sm flex flex-col gap-12 relative z-10">
        <div className="flex flex-col items-center gap-4">
          <BrandLogo size={80} className="shadow-2xl shadow-blue-500/20 rounded-3xl" />
          <h1 className="text-xl font-black tracking-tighter">
            Meta<span className="text-blue-500">Nutri</span>
          </h1>
        </div>

        {view === 'login' && renderLogin()}
        {view === 'signup' && renderSignUp()}
        {view === 'quiz' && renderQuiz()}
      </div>

      <p className="absolute bottom-10 text-[8px] text-gray-600 font-bold uppercase tracking-widest">Powered by RA Tec Company®</p>
    </div>
  );
};

export default AuthFlow;
