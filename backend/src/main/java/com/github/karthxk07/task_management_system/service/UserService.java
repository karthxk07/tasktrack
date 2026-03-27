package com.github.karthxk07.task_management_system.service;

import java.util.List;

import com.github.karthxk07.task_management_system.entity.User;

public interface UserService {

  List<User> getAllUsers();

  User getUserById(Long id);

  User getUserByEmail(String email);

  User updateUserRole(Long id, String role);
}
