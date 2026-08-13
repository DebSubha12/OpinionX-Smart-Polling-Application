# OpinionX — Angular Frontend

Angular (standalone components, v18) frontend for the **OpinionX Smart Polling** Spring Boot backend. It talks to the existing REST API at `/api/polls` exactly as implemented in `Pollcontroller.java`:

| Method | Endpoint            | Purpose                        |
|--------|---------------------|---------------------------------|
| GET    | `/api/polls`        | List all polls                 |
| GET    | `/api/polls/{id}`   | Get one poll                   |
| POST   | `/api/polls`        | Create a poll                  |
| POST   | `/api/polls/vote`   | Vote (`{ pollId, optionIndex }`)|

## Setup

```bash
npm install
npm start
```

The app runs on `http://localhost:4200` by default — this matches the `@CrossOrigin(origins = "http://localhost:4200/")` already set on `Pollcontroller`.

The backend base URL is configured in `src/environments/environment.ts` (`apiBaseUrl: 'http://localhost:8080'`), matching Spring Boot's default port. Change it there if your backend runs elsewhere.

## Running the backend alongside it

From the Spring Boot project root:

```bash
./mvnw spring-boot:run
```

Make sure your MySQL instance is up and matches `application.properties` (`opinionx-smart-polling-application` database, `root` user).

> **Heads-up on the backend `pom.xml`:** the current dependencies reference `spring-boot-starter-webmvc` / `spring-boot-starter-webmvc-test` and `spring-boot-starter-data-jpa-test`, which aren't real Maven Central artifact IDs. The standard ones are `spring-boot-starter-web` and `spring-boot-starter-test`. The backend likely won't compile until that's corrected — happy to fix it if you'd like.

## Pages

- **All polls** (`/`) — every poll as a card with a live vote tally.
- **New poll** (`/create`) — author a question with 2–8 options.
- **Poll detail / vote** (`/polls/:id`) — cast a vote, then see a live results bar chart. Voting state is tracked client-side per visit (the backend doesn't yet enforce one-vote-per-user).

## Structure

```
src/app/
  models/poll.model.ts          # Poll, OptionVote, VoteRequest — mirrors the Java DTOs
  services/poll.service.ts      # HttpClient wrapper around /api/polls
  components/
    poll-list/                  # GET /api/polls
    poll-detail/                # GET /api/polls/{id} + POST /api/polls/vote
    create-poll/                # POST /api/polls
```
