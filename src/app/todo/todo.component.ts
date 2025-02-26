import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="todo-container">
      <div class="intro-section">
        <h2>Willkommen bei der Gamified ToDo-App! 🎮</h2>
        <div class="how-to-play">
          <h3>So funktioniert's:</h3>
          <ul>
            <li>🎯 Erstelle neue Aufgaben unter "Quests"</li>
            <li>⭐ Leichte Aufgaben: 100 XP</li>
            <li>⭐⭐ Mittlere Aufgaben: 200 XP</li>
            <li>⭐⭐⭐ Schwere Aufgaben: 300 XP</li>
            <li>📈 Sammle XP durch das Erledigen von Aufgaben</li>
            <li>🆙 Steige Level auf und werde produktiver!</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {} 