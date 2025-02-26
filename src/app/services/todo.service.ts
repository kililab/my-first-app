import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Todo, UserProgress } from '../models/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  private userProgressSubject = new BehaviorSubject<UserProgress>({
    level: 1,
    currentXP: 0,
    xpToNextLevel: 100,
    stats: {
      STR: 1,
      AGI: 1,
      INT: 1,
      VIT: 1
    },
    availableStatPoints: 0,
    totalTasksCompleted: 0
  });
  private availableStatsSubject = new BehaviorSubject<string[]>(['STR', 'AGI', 'INT', 'VIT']);

  todos$ = this.todosSubject.asObservable();
  userProgress$ = this.userProgressSubject.asObservable();
  availableStats$ = this.availableStatsSubject.asObservable();

  addTodo(todo: Todo) {
    const currentTodos = this.todosSubject.getValue();
    this.todosSubject.next([...currentTodos, todo]);
  }

  completeTodo(todo: Todo) {
    const currentTodos = this.todosSubject.getValue();
    const updatedTodos = currentTodos.map(t => {
      if (t.id === todo.id) {
        const newCompleted = !t.completed;
        if (newCompleted) {
          this.addXP(t.xpReward);
          this.updateStats(t.statRewards);
        }
        return { ...t, completed: newCompleted };
      }
      return t;
    });
    this.todosSubject.next(updatedTodos);
  }

  private addXP(xp: number) {
    const current = this.userProgressSubject.getValue();
    let newXP = current.currentXP + xp;
    let level = current.level;
    let xpToNext = current.xpToNextLevel;

    while (newXP >= xpToNext) {
      newXP -= xpToNext;
      level++;
      // Exponentielles XP-Wachstum wie im Bild
      xpToNext = Math.floor(xpToNext * 1.8);
      this.levelUpStats();
    }

    this.userProgressSubject.next({
      ...current,
      level,
      currentXP: newXP,
      xpToNextLevel: xpToNext,
      totalTasksCompleted: current.totalTasksCompleted + 1
    });
  }

  private updateStats(statRewards: { [key: string]: number }) {
    const current = this.userProgressSubject.getValue();
    const updatedStats = { ...current.stats };
    
    // Aktualisiere nur die Stats, die in den Belohnungen vorhanden sind
    Object.entries(statRewards).forEach(([stat, value]) => {
      if (updatedStats[stat] !== undefined) {
        updatedStats[stat] += value;
      } else {
        updatedStats[stat] = value;
      }
    });

    this.userProgressSubject.next({
      ...current,
      stats: updatedStats
    });
  }

  private levelUpStats() {
    const current = this.userProgressSubject.getValue();
    
    // Statt automatischer Stat-Erhöhung bekommen wir Statuspunkte
    this.userProgressSubject.next({
      ...current,
      availableStatPoints: current.availableStatPoints + 5 // 5 Punkte pro Level
    });
  }

  increaseStat(stat: string) {
    const current = this.userProgressSubject.getValue();
    if (current.availableStatPoints > 0) {
      const updatedStats = { ...current.stats };
      
      if (updatedStats[stat] !== undefined) {
        updatedStats[stat]++;
      } else {
        updatedStats[stat] = 1;
      }

      this.userProgressSubject.next({
        ...current,
        stats: updatedStats,
        availableStatPoints: current.availableStatPoints - 1
      });
    }
  }

  addStat(stat: string) {
    const currentStats = this.availableStatsSubject.getValue();
    if (!currentStats.includes(stat)) {
      this.availableStatsSubject.next([...currentStats, stat]);
      
      // Füge den neuen Stat auch zu UserProgress hinzu
      const current = this.userProgressSubject.getValue();
      const updatedStats = { ...current.stats, [stat]: 1 };
      this.userProgressSubject.next({
        ...current,
        stats: updatedStats
      });
    }
  }

  removeStat(stat: string) {
    const currentStats = this.availableStatsSubject.getValue();
    const updatedStats = currentStats.filter(s => s !== stat);
    this.availableStatsSubject.next(updatedStats);
    
    // Entferne den Stat auch aus UserProgress
    const current = this.userProgressSubject.getValue();
    const { [stat]: removed, ...remainingStats } = current.stats;
    this.userProgressSubject.next({
      ...current,
      stats: remainingStats
    });
  }
} 