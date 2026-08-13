package com.OpinionX.OpinionX.Smart.Polling.Application.repositories;

import com.OpinionX.OpinionX.Smart.Polling.Application.model.Poll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {

}