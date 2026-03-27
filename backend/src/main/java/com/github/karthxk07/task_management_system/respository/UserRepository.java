package com.github.karthxk07.task_management_system.respository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.github.karthxk07.task_management_system.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
