package com.OpinionX.OpinionX.Smart.Polling.Application.controllers;

import com.OpinionX.OpinionX.Smart.Polling.Application.model.Poll;
import com.OpinionX.OpinionX.Smart.Polling.Application.request.Vote;
import com.OpinionX.OpinionX.Smart.Polling.Application.services.PollServices;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/polls")
@CrossOrigin(origins = "http://localhost:4200")
public class Pollcontroller {

    private final PollServices pollServices;
    public Pollcontroller(PollServices pollServices) {
        this.pollServices = pollServices;
    }

    @PostMapping
    public Poll createPoll(@RequestBody Poll poll) {
        return pollServices.createPoll(poll);
    }
    @GetMapping
    public List<Poll> getAllPolls() {
        return pollServices.getAllPolls();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Poll> getPoll(@PathVariable Long id) {
        return pollServices.getPollById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/vote")
    public void vote(@RequestBody Vote vote) {
        pollServices.vote(vote.getPollId(), vote.getOptionIndex());
    }

    @PatchMapping("/{id}/close")
    public Poll closePoll(@PathVariable Long id) {
        return pollServices.setClosed(id, true);
    }

    @PatchMapping("/{id}/reopen")
    public Poll reopenPoll(@PathVariable Long id) {
        return pollServices.setClosed(id, false);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePoll(@PathVariable Long id) {
        boolean deleted = pollServices.deletePoll(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleConflict(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", ex.getMessage()));
    }
}