export interface OptionVote {
  optionText: string;
  voteCount: number;
}

export interface Poll {
  id?: number;
  question: string;
  options: OptionVote[];
  createdAt?: string;
  expiresAt?: string | null;
  closed?: boolean;
}

export interface VoteRequest {
  pollId: number;
  optionIndex: number;
}