import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../services/todo.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserProgress, Todo } from '../models/todo.interface';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="status-container">
      <div class="user-stats">
        <h2>Level {{(userProgress$ | async)?.level}}</h2>
        <div class="xp-bar">
          <div class="xp-progress" [style.width.%]="xpPercentage$ | async"></div>
        </div>
        <p>XP: {{(userProgress$ | async)?.currentXP}} / {{(userProgress$ | async)?.xpToNextLevel}}</p>
        
        <div *ngIf="(userProgress$ | async)?.availableStatPoints as points" class="available-points">
          Verfügbare Statuspunkte: {{points}}
        </div>

        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">STR:</span>
            <span class="stat-value">{{(userProgress$ | async)?.stats.strength | number:'1.1-1'}}</span>
            <button *ngIf="(userProgress$ | async)?.availableStatPoints" 
                    class="stat-up-btn"
                    (click)="increaseStat('strength')">+</button>
          </div>
          <div class="stat">
            <span class="stat-label">AGI:</span>
            <span class="stat-value">{{(userProgress$ | async)?.stats.agility | number:'1.1-1'}}</span>
            <button *ngIf="(userProgress$ | async)?.availableStatPoints" 
                    class="stat-up-btn"
                    (click)="increaseStat('agility')">+</button>
          </div>
          <div class="stat">
            <span class="stat-label">INT:</span>
            <span class="stat-value">{{(userProgress$ | async)?.stats.intelligence | number:'1.1-1'}}</span>
            <button *ngIf="(userProgress$ | async)?.availableStatPoints" 
                    class="stat-up-btn"
                    (click)="increaseStat('intelligence')">+</button>
          </div>
          <div class="stat">
            <span class="stat-label">VIT:</span>
            <span class="stat-value">{{(userProgress$ | async)?.stats.vitality | number:'1.1-1'}}</span>
            <button *ngIf="(userProgress$ | async)?.availableStatPoints" 
                    class="stat-up-btn"
                    (click)="increaseStat('vitality')">+</button>
          </div>
        </div>

        <div class="completed-quests">
          <h3>Abgeschlossene Quests</h3>
          <div class="quest-list">
            <div *ngFor="let todo of completedTodos$ | async" class="completed-quest">
              <div class="quest-title">
                <span class="quest-icon" [ngClass]="todo.difficulty">
                  {{ getDifficultyIcon(todo.difficulty) }}
                </span>
                {{ todo.title }}
              </div>
              <div class="rewards">
                <span class="xp-reward">+{{ todo.xpReward }} XP</span>
                <div class="stat-rewards" *ngIf="todo.statRewards">
                  <span *ngFor="let stat of getStatRewards(todo)" class="stat">
                    +{{stat.value}} {{stat.name}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./status.component.css']
})
export class StatusComponent {
  userProgress$: Observable<UserProgress>;
  xpPercentage$: Observable<number>;
  completedTodos$: Observable<Todo[]>;

  constructor(private todoService: TodoService) {
    this.userProgress$ = this.todoService.userProgress$;
    this.xpPercentage$ = this.userProgress$.pipe(
      map(progress => (progress.currentXP / progress.xpToNextLevel) * 100)
    );
    this.completedTodos$ = this.todoService.todos$.pipe(
      map(todos => todos.filter(todo => todo.completed))
    );
  }

  increaseStat(stat: 'strength' | 'agility' | 'intelligence' | 'vitality') {
    this.todoService.increaseStat(stat);
  }

  getDifficultyIcon(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return '⭐';
      case 'medium': return '⭐⭐';
      case 'hard': return '⭐⭐⭐';
      default: return '⭐';
    }
  }

  getStatRewards(todo: Todo): {name: string, value: number}[] {
    return Object.entries(todo.statRewards)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({name, value}));
  }
} 