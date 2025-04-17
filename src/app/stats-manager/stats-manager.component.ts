import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-stats-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="stats-manager-container">
      <h2>Attribute verwalten</h2>
      
      <div class="add-stat-section">
        <input type="text" [(ngModel)]="newStatName" placeholder="Neues Attribut...">
        <button (click)="addStat()">Hinzufügen</button>
      </div>

      <div class="current-stats">                                
        <div *ngFor="let stat of availableStats$ | async" class="stat-item">
          <span class="stat-name">{{stat}}</span>
          <button class="remove-stat" (click)="removeStat(stat)">×</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./stats-manager.component.css']
})
export class StatsManagerComponent {
  newStatName = '';
  availableStats$ = this.todoService.availableStats$;

  constructor(private todoService: TodoService) {}

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
} 