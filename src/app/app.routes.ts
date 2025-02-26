import { Routes } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { StatusComponent } from './status/status.component';
import { QuestsComponent } from './quests/quests.component';

export const routes: Routes = [
  { path: '', component: TodoComponent },
  { path: 'status', component: StatusComponent },
  { path: 'quests', component: QuestsComponent },
  // ... andere Routen
];
