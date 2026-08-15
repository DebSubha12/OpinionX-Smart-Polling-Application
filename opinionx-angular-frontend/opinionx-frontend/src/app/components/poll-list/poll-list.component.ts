import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Poll } from '../../models/poll.model';
import { PollService } from '../../services/poll.service';
import { timeAgo } from '../../shared/time-ago.util';

@Component({
  selector: 'app-poll-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './poll-list.component.html',
  styleUrl: './poll-list.component.css',
})
export class PollListComponent implements OnInit {
  polls: Poll[] = [];
  loading = true;
  error = '';
  deletingId: number | null = null;
  searchTerm = '';

  constructor(private pollService: PollService) {}

  ngOnInit(): void {
    this.fetchPolls();
  }

  fetchPolls(): void {
    this.loading = true;
    this.error = '';
    this.pollService.getAllPolls().subscribe({
      next: (polls) => {
        this.polls = polls;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not reach OpinionX server. Is the Spring Boot app running on port 8080?';
        this.loading = false;
      },
    });
  }

  get filteredPolls(): Poll[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.polls;
    return this.polls.filter((poll) => poll.question.toLowerCase().includes(term));
  }

  totalVotes(poll: Poll): number {
    return poll.options.reduce((sum, o) => sum + (o.voteCount ?? 0), 0);
  }

  timeAgo(poll: Poll): string {
    return timeAgo(poll.createdAt);
  }

  deletePoll(event: Event, poll: Poll): void {
    event.preventDefault();
    event.stopPropagation();

    if (!poll.id || this.deletingId !== null) return;

    const confirmed = window.confirm(`Delete "${poll.question}"? This cannot be undone.`);
    if (!confirmed) return;

    this.deletingId = poll.id;
    this.pollService.deletePoll(poll.id).subscribe({
      next: () => {
        this.polls = this.polls.filter((p) => p.id !== poll.id);
        this.deletingId = null;
      },
      error: () => {
        this.deletingId = null;
        this.error = 'Could not delete the poll. Please try again.';
      },
    });
  }
}