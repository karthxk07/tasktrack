package com.github.karthxk07.task_management_system.service;

import com.github.karthxk07.task_management_system.payload.LoginDto;
import com.github.karthxk07.task_management_system.payload.RegisterDto;

public interface AuthService {
    String register(RegisterDto registerDto);
    String login(LoginDto loginDto);
}