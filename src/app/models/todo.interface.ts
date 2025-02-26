export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  statRewards: {
    [key: string]: number;  // Dynamische Stats
  };
  dueDate?: Date;
}

export interface UserProgress {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  stats: {
    [key: string]: number;  // Dynamische Stats
  };
  availableStatPoints: number;
  totalTasksCompleted: number;
} 