import { Injectable } from '@angular/core';

const STORAGE_PREFIX = 'opinionx-voted-';

/**
 * Tracks which polls this browser has already voted on, using localStorage.
 * This is a client-side-only guard — it stops accidental re-votes from the
 * same browser, but does not replace real server-side vote-once enforcement
 * (which would need user accounts).
 */
@Injectable({ providedIn: 'root' })
export class VotedPollsStorage {
  private key(pollId: number): string {
    return `${STORAGE_PREFIX}${pollId}`;
  }

  hasVoted(pollId: number): boolean {
    return this.getVotedOption(pollId) !== null;
  }

  getVotedOption(pollId: number): number | null {
    const raw = localStorage.getItem(this.key(pollId));
    if (raw === null) return null;
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? null : parsed;
  }

  markVoted(pollId: number, optionIndex: number): void {
    localStorage.setItem(this.key(pollId), String(optionIndex));
  }
}