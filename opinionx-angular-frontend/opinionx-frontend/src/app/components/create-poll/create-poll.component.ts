import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PollService } from '../../services/poll.service';

interface ExpiryChoice {
  label: string;
  minutes: number | null; // null = no expiry
}

@Component({
  selector: 'app-create-poll',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-poll.component.html',
  styleUrl: './create-poll.component.css',
})
export class CreatePollComponent {
  question = '';
  options: string[] = ['', ''];
  submitting = false;
  error = '';

  expiryChoices: ExpiryChoice[] = [
    { label: 'No expiry', minutes: null },
    { label: '1 hour', minutes: 60 },
    { label: '6 hours', minutes: 6 * 60 },
    { label: '1 day', minutes: 24 * 60 },
    { label: '1 week', minutes: 7 * 24 * 60 },
  ];
  selectedExpiryMinutes: number | null = null;

  constructor(
    private pollService: PollService,
    private router: Router
  ) {}

  addOption(): void {
    if (this.options.length >= 8) return;
    this.options.push('');
  }

  removeOption(index: number): void {
    if (this.options.length <= 2) return;
    this.options.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }

  private get cleanOptions(): string[] {
    return this.options.map((o) => o.trim()).filter((o) => o.length > 0);
  }

  private get hasDuplicateOptions(): boolean {
    const lower = this.cleanOptions.map((o) => o.toLowerCase());
    return new Set(lower).size !== lower.length;
  }

  get canSubmit(): boolean {
    return (
      this.question.trim().length > 0 &&
      this.cleanOptions.length >= 2 &&
      !this.hasDuplicateOptions &&
      !this.submitting
    );
  }

  submit(): void {
    this.error = '';

    if (this.question.trim().length === 0) {
      this.error = 'Please enter a question.';
      return;
    }
    if (this.cleanOptions.length < 2) {
      this.error = 'Please provide at least 2 options.';
      return;
    }
    if (this.hasDuplicateOptions) {
      this.error = 'Options must be unique — you have a duplicate.';
      return;
    }

    this.submitting = true;

    const expiresAt =
      this.selectedExpiryMinutes !== null
        ? new Date(Date.now() + this.selectedExpiryMinutes * 60_000).toISOString()
        : null;

    this.pollService
      .createPoll({
        question: this.question.trim(),
        options: this.cleanOptions.map((optionText) => ({ optionText, voteCount: 0 })),
        expiresAt,
      })
      .subscribe({
        next: (poll) => {
          this.submitting = false;
          this.router.navigate(['/polls', poll.id]);
        },
        error: (err) => {
          this.submitting = false;
          this.error =
            err?.error?.message || 'Could not save the poll. Is the Spring Boot server running on port 8080?';
        },
      });
  }
}