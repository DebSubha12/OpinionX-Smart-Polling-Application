import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PollService } from '../../services/poll.service';

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

  get canSubmit(): boolean {
    const filled = this.options.map((o) => o.trim()).filter((o) => o.length > 0);
    return this.question.trim().length > 0 && filled.length >= 2 && !this.submitting;
  }

  submit(): void {
    if (!this.canSubmit) return;
    this.submitting = true;
    this.error = '';

    const cleanOptions = this.options.map((o) => o.trim()).filter((o) => o.length > 0);

    this.pollService
      .createPoll({
        question: this.question.trim(),
        options: cleanOptions.map((optionText) => ({ optionText, voteCount: 0 })),
      })
      .subscribe({
        next: (poll) => {
          this.submitting = false;
          this.router.navigate(['/polls', poll.id]);
        },
        error: () => {
          this.submitting = false;
          this.error = 'Could not save the poll. Is the Spring Boot server running on port 8080?';
        },
      });
  }
}
