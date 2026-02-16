
export enum GoalType {
  CUTTING = 'Cutting',
  BULKING = 'Bulking',
  MAINTENANCE = 'Manutenção'
}

export interface MacroData {
  label: string;
  consumed: number;
  goal: number;
  icon: string;
  color: string;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  unit?: 'g' | 'un' | 'ml';
  gramsPerUnit?: number;
}

export interface Meal {
  id: string;
  name: string;
  time: string; // Formato HH:mm
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  status: 'pending' | 'completed' | 'failed';
  lastStatusDate?: string; // Data da última marcação
  items?: FoodItem[];
}

export type AppTab = 'dashboard' | 'goals' | 'diet' | 'evolution' | 'database' | 'profile' | 'settings';
