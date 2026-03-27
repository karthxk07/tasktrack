package com.github.karthxk07.task_management_system.service;

import java.util.List;

import com.github.karthxk07.task_management_system.entity.Task;
import com.github.karthxk07.task_management_system.enums.Status;

public interface TaskService {

  Task addTask(Task task);

  List<Task> getTasks(Status status, Long assignedTo, Long createdBy);

  Task getTaskById(Long id);

  Task updateTaskById(Long id, Task task);

  void deleteTaskById(Long id);
}
