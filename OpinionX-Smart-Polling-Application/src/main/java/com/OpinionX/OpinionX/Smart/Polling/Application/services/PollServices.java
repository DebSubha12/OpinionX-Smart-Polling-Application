package com.OpinionX.OpinionX.Smart.Polling.Application.services;


import com.OpinionX.OpinionX.Smart.Polling.Application.model.OptionVote;
import com.OpinionX.OpinionX.Smart.Polling.Application.model.Poll;
import com.OpinionX.OpinionX.Smart.Polling.Application.repositories.PollRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;



@Service
public class PollServices {

    private final PollRepository pollRepository;

    public PollServices(PollRepository pollRepository) {
        this.pollRepository = pollRepository;
    }

    public Poll createPoll(Poll poll) {
        validatePoll(poll);
        return pollRepository.save(poll);
    }

    private void validatePoll(Poll poll) {
        if (poll.getQuestion() == null || poll.getQuestion().trim().isEmpty()) {
            throw new IllegalArgumentException("Question cannot be empty");
        }

        List<OptionVote> options = poll.getOptions();
        if (options == null || options.size() < 2) {
            throw new IllegalArgumentException("A poll needs at least 2 options");
        }
        if (options.size() > 8) {
            throw new IllegalArgumentException("A poll can have at most 8 options");
        }

        List<String> seen = new java.util.ArrayList<>();
        for (OptionVote option : options) {
            if (option.getOptionText() == null || option.getOptionText().trim().isEmpty()) {
                throw new IllegalArgumentException("Option text cannot be empty");
            }
            String normalized = option.getOptionText().trim().toLowerCase();
            if (seen.contains(normalized)) {
                throw new IllegalArgumentException("Duplicate option: " + option.getOptionText().trim());
            }
            seen.add(normalized);
        }
    }

    public List<Poll> getAllPolls() {
        return pollRepository.findAll();
    }

    public Optional<Poll> getPollById(Long id) {
        return pollRepository.findById(id);
    }

    public void vote(Long pollId, int optionIndex) {

        // Get Poll from DB
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        if (poll.isClosed()) {
            throw new IllegalStateException("This poll is closed and no longer accepting votes");
        }

        // Get All Options
        List<OptionVote> options = poll.getOptions();

        // Validate option index
        if (optionIndex < 0 || optionIndex >= options.size()) {
            throw new IllegalArgumentException("Invalid option index");
        }

        // Get Selected Option
        OptionVote selectedOption = options.get(optionIndex);

        // Increment vote count
        selectedOption.setVoteCount(
                selectedOption.getVoteCount() + 1
        );

        // Save updated poll
        pollRepository.save(poll);
    }

    public Poll setClosed(Long pollId, boolean closed) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));
        poll.setClosed(closed);
        return pollRepository.save(poll);
    }

    public boolean deletePoll(Long id) {
        if (!pollRepository.existsById(id)) {
            return false;
        }
        pollRepository.deleteById(id);
        return true;
    }
}