package com.github.karthxk07.task_management_system.respository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.github.karthxk07.task_management_system.entity.Role;

public interface RoleRespository extends JpaRepository<Role, Long>{
    Role findByName(String name);
}
