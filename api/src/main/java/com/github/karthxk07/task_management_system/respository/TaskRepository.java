package com.github.karthxk07.task_management_system.respository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.github.karthxk07.task_management_system.entity.Task;
import com.github.karthxk07.task_management_system.enums.Status;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {
    @Query("SELECT t FROM Task t WHERE (:status IS NULL OR t.status = :status) AND (:assignedTo IS NULL OR t.assignedTo.id = :assignedTo) AND (:createdBy IS NULL OR t.createdBy.id = :createdBy)")
    List<Task> findByStatusAndAssignedToAndCreatedBy(@Param("status") Status status,
            @Param("assignedTo") Long assignedTo, @Param("createdBy") Long createdBy);
}
