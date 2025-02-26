import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { StatusComponent } from './status/status.component';
import { QuestsComponent } from './quests/quests.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterModule, TodoComponent, StatusComponent, QuestsComponent]
})
export class AppComponent {
  title = 'Meine Angular App';
}
