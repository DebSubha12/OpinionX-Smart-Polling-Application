import { Routes } from '@angular/router';
import { PollListComponent } from './components/poll-list/poll-list.component';
import { PollDetailComponent } from './components/poll-detail/poll-detail.component';
import { CreatePollComponent } from './components/create-poll/create-poll.component';
import { StatsComponent } from './components/stats/stats.component';

export const routes: Routes = [
  { path: '', component: PollListComponent, title: 'OpinionX — Polls' },
  { path: 'create', component: CreatePollComponent, title: 'OpinionX — New Poll' },
  { path: 'stats', component: StatsComponent, title: 'OpinionX — Stats' },
  { path: 'polls/:id', component: PollDetailComponent, title: 'OpinionX — Poll' },
  { path: '**', redirectTo: '' },
];