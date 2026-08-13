import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Poll, VoteRequest } from '../models/poll.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PollService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/polls`;

  constructor(private http: HttpClient) {}

  getAllPolls(): Observable<Poll[]> {
    return this.http.get<Poll[]>(this.baseUrl);
  }

  getPoll(id: number): Observable<Poll> {
    return this.http.get<Poll>(`${this.baseUrl}/${id}`);
  }

  createPoll(poll: Poll): Observable<Poll> {
    return this.http.post<Poll>(this.baseUrl, poll);
  }

  vote(vote: VoteRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/vote`, vote);
  }

  deletePoll(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}