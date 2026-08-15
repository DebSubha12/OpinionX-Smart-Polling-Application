import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Poll } from '../../models/poll.model';
import { PollService } from '../../services/poll.service';

interface TopOption {
  pollQuestion: string;
  pollId: number;
  optionText: string;
  voteCount: number;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css',
})
export class StatsComponent implements OnInit {
  polls: Poll[] = [];
  loading = true;
  error = '';

  constructor(private pollService: PollService) {}

  ngOnInit(): void {
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

  get totalPolls(): number {
    return this.polls.length;
  }

  get openPolls(): number {
    return this.polls.filter((p) => !p.closed).length;
  }

  get closedPolls(): number {
    return this.polls.filter((p) => p.closed).length;
  }

  get totalVotes(): number {
    return this.polls.reduce(
      (sum, poll) => sum + poll.options.reduce((s, o) => s + (o.voteCount ?? 0), 0),
      0
    );
  }

  get averageVotesPerPoll(): string {
    if (this.totalPolls === 0) return '0';
    return (this.totalVotes / this.totalPolls).toFixed(1);
  }

  get mostVotedPoll(): Poll | null {
    if (this.polls.length === 0) return null;
    return [...this.polls].sort((a, b) => this.pollVotes(b) - this.pollVotes(a))[0];
  }

  get topOptions(): TopOption[] {
    const all: TopOption[] = [];
    for (const poll of this.polls) {
      for (const option of poll.options) {
        all.push({
          pollQuestion: poll.question,
          pollId: poll.id!,
          optionText: option.optionText,
          voteCount: option.voteCount ?? 0,
        });
      }
    }
    return all.sort((a, b) => b.voteCount - a.voteCount).slice(0, 5);
  }

  pollVotes(poll: Poll): number {
    return poll.options.reduce((sum, o) => sum + (o.voteCount ?? 0), 0);
  }
}