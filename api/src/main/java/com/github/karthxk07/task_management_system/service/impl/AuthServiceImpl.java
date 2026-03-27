package com.github.karthxk07.task_management_system.service.impl;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.github.karthxk07.task_management_system.entity.Role;
import com.github.karthxk07.task_management_system.entity.User;
import com.github.karthxk07.task_management_system.payload.LoginDto;
import com.github.karthxk07.task_management_system.payload.RegisterDto;
import com.github.karthxk07.task_management_system.respository.RoleRespository;
import com.github.karthxk07.task_management_system.respository.UserRepository;
import com.github.karthxk07.task_management_system.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRespository roleRepository;

    @Autowired
    public AuthServiceImpl(PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager,
            UserRepository userRepository, RoleRespository roleRepository) {
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public String register(RegisterDto registerDto) {
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            return "Email already in use";
        }

        // Hash the password before saving the user
        User user = new User();
        user.setName(registerDto.getName());
        user.setEmail(registerDto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(registerDto.getPassword()));

        // assign role
        Set<Role> roles = new HashSet<>();
        Role role = roleRepository.findByName("ROLE_USER");
        if (role == null) {
            role = new Role();
            role.setName("ROLE_USER");
            role = roleRepository.save(role);
        }
        roles.add(role);
        user.setRoles(roles);

        userRepository.save(user);
        return "User registered successfully";
    }

    @Override
    public String login(LoginDto loginDto) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginDto.getEmail(),
                        loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        return "user logged in successfully";
    }

}
