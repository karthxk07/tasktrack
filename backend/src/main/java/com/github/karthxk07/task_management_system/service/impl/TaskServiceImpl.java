package com.github.karthxk07.task_management_system.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.github.karthxk07.task_management_system.entity.Task;
import com.github.karthxk07.task_management_system.entity.User;
import com.github.karthxk07.task_management_system.enums.Status;
import com.github.karthxk07.task_management_system.exception.ResourceNotFoundException;
import com.github.karthxk07.task_management_system.respository.TaskRepository;
import com.github.karthxk07.task_management_system.respository.UserRepository;
import com.github.karthxk07.task_management_system.service.TaskService;

@Service
public class TaskServiceImpl implements TaskService {

  private final TaskRepository taskRespository;
  private final UserRepository userRepository;

  @Autowired
  public TaskServiceImpl(TaskRepository taskRespository, UserRepository userRepository) {
    this.taskRespository = taskRespository;
    this.userRepository = userRepository;
  }

  @Override
  public Task addTask(Task task) {

    task.setStatus(Status.TODO);

    // Resolve assignee by email if provided
    if (task.getAssignedTo() != null && task.getAssignedTo().getEmail() != null) {
      User assignee = userRepository.findByEmail(task.getAssignedTo().getEmail())
          .orElseThrow(() -> new ResourceNotFoundException("User", "email", task.getAssignedTo().getEmail()));
      task.setAssignedTo(assignee);
    }

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String email = auth.getName();
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    task.setCreatedBy(user);

    Task res = taskRespository.save(task);
    return res;
  }

  @Override
  public List<Task> getTasks(Status status, Long assignedTo, Long createdBy) {
    return taskRespository.findByStatusAndAssignedToAndCreatedBy(status, assignedTo, createdBy);
  }

  @Override
  public Task getTaskById(Long id) {
    Task res = taskRespository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Task", "id", String.valueOf(id)));
    return res;
  }

  @Override
  public Task updateTaskById(Long id, Task task) {
    Task oldTask = getTaskById(id);

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    String email = auth.getName();
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

    if (!oldTask.getCreatedBy().getId().equals(user.getId())
        && (oldTask.getAssignedTo() == null || !oldTask.getAssignedTo().getId().equals(user.getId()))
        && user.getRoles().stream().noneMatch(role -> role.getName().equals("ROLE_ADMIN"))) {
      throw new SecurityException("You don't have permission to update this task");
    }

    oldTask.setTitle(task.getTitle());
    oldTask.setDescription(task.getDescription());
    oldTask.setStatus(task.getStatus());
    oldTask.setAssignedTo(task.getAssignedTo());
    oldTask.setUpdatedAt(task.getUpdatedAt());

    Task res = taskRespository.save(oldTask);
    return res;
  }

  @Override
  public void deleteTaskById(Long id) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String email = auth.getName();
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

    if (!user.getRoles().stream().anyMatch(role -> role.getName().equals("ROLE_ADMIN"))) {
      throw new SecurityException("You don't have permission to delete this task");
    }

    Task task = getTaskById(id);
    taskRespository.delete(task);
  }

}
