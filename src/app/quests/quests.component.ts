import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../models/todo.interface';
import { TodoService } from '../services/todo.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="quests-container">
      <div class="quest-section">
        <h2>Attribute verwalten 📋</h2>
        <div class="todo-input">
          <input type="text" [(ngModel)]="newStatName" placeholder="Neues Attribut...">
          <button (click)="addStat()">Attribut hinzufügen</button>
        </div>
        
        <div class="todo-list">
          <div *ngFor="let stat of availableStats$ | async" class="todo-item">
            <span class="todo-title">{{stat}}</span>
            <button class="todo-input button" (click)="removeStat(stat)">Löschen</button>
          </div>
        </div>
      </div>

      <div class="quest-section">
        <h2>Quests 📜</h2>
        <div class="todo-input">
          <input type="text" [(ngModel)]="newTodoTitle" placeholder="Neue Aufgabe...">
          <select [(ngModel)]="newTodoDifficulty">
            <option value="easy">Leicht (100 XP)</option>
            <option value="medium">Mittel (200 XP)</option>
            <option value="hard">Schwer (300 XP)</option>
          </select>
          <button (click)="addTodo()">Quest hinzufügen</button>
        </div>
      </div>

      <div class="todo-list">
        <div *ngFor="let todo of todos$ | async" class="todo-item" [class.completed]="todo.completed">
          <input type="checkbox" 
                 [checked]="todo.completed"
                 (change)="completeTodo(todo)">
          <span class="todo-title">{{todo.title}}</span>
          <div class="rewards">
            <span class="xp-reward">{{todo.xpReward}} XP</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quests-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 1rem;
    }

    .quest-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .quest-card {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .quest-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .quest-header h3 {
      color: #007bff;
      margin: 0;
    }

    .reward {
      background-color: #28a745;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .progress-bar {
      width: 100%;
      height: 10px;
      background-color: #e9ecef;
      border-radius: 5px;
      overflow: hidden;
      margin: 1rem 0;
    }

    .progress {
      height: 100%;
      background-color: #007bff;
      transition: width 0.3s ease;
    }

    .progress-text {
      color: #666;
      font-size: 0.875rem;
    }

    .todo-input {
      display: flex;
      gap: 1rem;
      margin: 2rem 0;
    }

    .todo-input input,
    .todo-input select {
      padding: 0.5rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
    }

    .todo-input input {
      flex-grow: 1;
    }

    .todo-input button {
      padding: 0.5rem 1rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .todo-input button:hover {
      background-color: #0069d9;
    }

    .todo-input.button {
      padding: 0.5rem 1rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .todo-input.button:hover {
      background-color: #0069d9;
    }

    .todo-list {
      margin-bottom: 2rem;
    }

    .todo-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    /* Separate Styles für Quest-Items */
    .quest-section:last-child .todo-item {
      background-color: #f8f9fa;
    }

    .todo-title {
      color: #b8c3e6;
    }

    .completed {
      text-decoration: line-through;
      color: #6c757d;
    }

    .xp-reward {
      margin-left: auto;
      background-color: #28a745;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
    }
  `]
})
export class QuestsComponent {
  constructor(private todoService: TodoService) {
    this.todos$ = this.todoService.todos$.pipe(
      map(todos => todos.filter(todo => !todo.completed))
    );
    this.availableStats$ = this.todoService.availableStats$;
  }

  todos$;
  availableStats$;
  newTodoTitle = '';
  newTodoDifficulty: 'easy' | 'medium' | 'hard' = 'easy';
  newStatName = '';

  addTodo() {
    if (this.newTodoTitle.trim()) {
      const xpReward = this.getXPReward(this.newTodoDifficulty);
      
      const todo: Todo = {
        id: Date.now(),
        title: this.newTodoTitle,
        completed: false,
        difficulty: this.newTodoDifficulty,
        xpReward,
        statRewards: {} // Keine Stat-Belohnungen für tägliche Quests
      };

      this.todoService.addTodo(todo);
      this.newTodoTitle = '';
      this.newTodoDifficulty = 'easy';
    }
  }

  completeTodo(todo: Todo) {
    this.todoService.completeTodo(todo);
  }

  addStat() {
    const formattedName = this.newStatName.trim().toUpperCase();
    if (formattedName) {
      this.todoService.addStat(formattedName);
      this.newStatName = '';
    }
  }

  removeStat(stat: string) {
    this.todoService.removeStat(stat);
  }

  private getXPReward(difficulty: 'easy' | 'medium' | 'hard'): number {
    const rewards = {
      easy: 100,
      medium: 200,
      hard: 300
    };
    return rewards[difficulty];
  }
} 