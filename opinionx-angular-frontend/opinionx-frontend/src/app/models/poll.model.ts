export interface OptionVote {
  optionText: string;
  voteCount: number;
}

export interface Poll {
  id?: number;
  question: string;
  options: OptionVote[];
}

export interface VoteRequest {
  pollId: number;
  optionIndex: number;
}
