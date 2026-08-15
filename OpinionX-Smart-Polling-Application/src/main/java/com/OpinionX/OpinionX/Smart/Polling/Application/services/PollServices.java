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
        return pollRepository.save(poll);
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

    public boolean deletePoll(Long id) {
        if (!pollRepository.existsById(id)) {
            return false;
        }
        pollRepository.deleteById(id);
        return true;
    }
}