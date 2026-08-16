import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Poll } from '../../models/poll.model';
import { PollService } from '../../services/poll.service';
import { VotedPollsStorage } from '../../services/voted-polls.storage';
import { timeAgo, timeUntil } from '../../shared/time-ago.util';

@Component({
  selector: 'app-poll-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './poll-detail.component.html',
  styleUrl: './poll-detail.component.css',
})
export class PollDetailComponent implements OnInit {
  poll: Poll | null = null;
  loading = true;
  error = '';
  notFound = false;

  selectedIndex: number | null = null;
  submitting = false;
  hasVoted = false;
  voteError = '';

  togglingClosed = false;

  constructor(
    private route: ActivatedRoute,
    private pollService: PollService,
    private votedPollsStorage: VotedPollsStorage
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.notFound = true;
      this.loading = false;
      return;
    }
    this.fetchPoll(id);
  }

  retry(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.fetchPoll(id);
  }

  fetchPoll(id: number): void {
    this.loading = true;
    this.error = '';
    this.pollService.getPoll(id).subscribe({
      next: (poll) => {
        this.poll = poll;
        this.loading = false;

        // If this browser already voted on this poll, skip straight to results.
        const votedOption = this.votedPollsStorage.getVotedOption(id);
        if (votedOption !== null) {
          this.hasVoted = true;
          this.selectedIndex = votedOption;
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 404) {
          this.notFound = true;
        } else {
          this.error = 'Could not reach OpinionX server. Is the Spring Boot app running on port 8080?';
        }
      },
    });
  }

  selectOption(index: number): void {
    if (this.hasVoted || this.submitting || this.isVotingClosed) return;
    this.selectedIndex = index;
  }

  submitVote(): void {
    if (this.selectedIndex === null || !this.poll?.id || this.submitting || this.hasVoted || this.isVotingClosed) return;
    this.submitting = true;
    this.voteError = '';

    const pollId = this.poll.id;
    const optionIndex = this.selectedIndex;

    this.pollService.vote({ pollId, optionIndex }).subscribe({
      next: () => {
        this.submitting = false;
        this.hasVoted = true;
        this.votedPollsStorage.markVoted(pollId, optionIndex);
        // Refresh tallies from the server so the results reflect the real count.
        this.fetchPoll(pollId);
      },
      error: (err) => {
        this.submitting = false;
        this.voteError = err?.error?.message || 'Your vote did not go through. Please try again.';
        if (err.status === 409 && this.poll) {
          this.poll.closed = true;
        }
      },
    });
  }

  toggleClosed(): void {
    if (!this.poll?.id || this.togglingClosed) return;
    this.togglingClosed = true;

    const action$ = this.poll.closed
      ? this.pollService.reopenPoll(this.poll.id)
      : this.pollService.closePoll(this.poll.id);

    action$.subscribe({
      next: (updatedPoll) => {
        this.poll = updatedPoll;
        this.togglingClosed = false;
      },
      error: () => {
        this.togglingClosed = false;
        this.error = 'Could not update the poll status. Please try again.';
      },
    });
  }

  createdAgo(): string {
    return timeAgo(this.poll?.createdAt);
  }

  expiresIn(): string {
    return timeUntil(this.poll?.expiresAt);
  }

  get isExpired(): boolean {
    if (!this.poll?.expiresAt) return false;
    return new Date(this.poll.expiresAt).getTime() <= Date.now();
  }

  get isVotingClosed(): boolean {
    return !!this.poll?.closed || this.isExpired;
  }

  totalVotes(): number {
    if (!this.poll) return 0;
    return this.poll.options.reduce((sum, o) => sum + (o.voteCount ?? 0), 0);
  }

  percentFor(voteCount: number): number {
    const total = this.totalVotes();
    if (total === 0) return 0;
    return Math.round((voteCount / total) * 100);
  }
}