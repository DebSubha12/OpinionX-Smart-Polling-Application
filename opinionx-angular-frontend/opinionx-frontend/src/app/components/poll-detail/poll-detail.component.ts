import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Poll } from '../../models/poll.model';
import { PollService } from '../../services/poll.service';
import { VotedPollsStorage } from '../../services/voted-polls.storage';

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
    if (this.hasVoted || this.submitting) return;
    this.selectedIndex = index;
  }

  submitVote(): void {
    if (this.selectedIndex === null || !this.poll?.id || this.submitting || this.hasVoted) return;
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
      error: () => {
        this.submitting = false;
        this.voteError = 'Your vote did not go through. Please try again.';
      },
    });
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