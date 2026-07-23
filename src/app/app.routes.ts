import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { QuestsComponent } from './quests/quests.component';
import { RoadmapsComponent } from './roadmaps/roadmaps.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'quests', component: QuestsComponent },
  { path: 'roadmaps', component: RoadmapsComponent },
  { path: '**', redirectTo: '' }
];
