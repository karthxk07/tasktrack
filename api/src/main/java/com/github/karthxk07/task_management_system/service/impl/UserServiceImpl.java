package com.github.karthxk07.task_management_system.service.impl;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.karthxk07.task_management_system.entity.Role;
import com.github.karthxk07.task_management_system.entity.User;
import com.github.karthxk07.task_management_system.exception.ResourceNotFoundException;
import com.github.karthxk07.task_management_system.respository.RoleRespository;
import com.github.karthxk07.task_management_system.respository.UserRepository;
import com.github.karthxk07.task_management_system.service.UserService;


@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRespository roleRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRespository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

  @Override
  public List<User> getAllUsers() {
    List<User> res = userRepository.findAll();
    return res;
  }

  @Override
  public User getUserById(Long id) {
    User res = userRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("User", "id", String.valueOf(id)));
    return res;}

  @Override
  public User getUserByEmail(String email) {
    User res = userRepository.findByEmail(email).orElseThrow(()->new ResourceNotFoundException("User", "email", email));
    return res; 
  }

  @Override
  public User updateUserRole(Long id, String role) {
    User user = userRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("User", "id", String.valueOf(id)));
    
    Set<Role> roles = user.getRoles();
    roles.add(roleRepository.findByName(role.toUpperCase()));
    userRepository.save(user);
    return user;
  }
}
