import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { QuestsComponent } from './quests/quests.component';
import { RoadmapsComponent } from './roadmaps/roadmaps.component';
import { ChallengesComponent } from './challenges/challenges.component';

import { RoadmapComponent } from './roadmap/roadmap.component';
import { TopicComponent } from './topic/topic.component';
import { ProgressComponent } from './progress/progress.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'quests', component: QuestsComponent },
  { path: 'challenges', component: ChallengesComponent },
  { path: 'progress', component: ProgressComponent },
  { path: 'roadmaps', component: RoadmapsComponent },
  { path: 'roadmaps/:id', component: RoadmapComponent },
  { path: 'roadmaps/:id/explore', component: TopicComponent},
  { path: '**', redirectTo: '' }
];
