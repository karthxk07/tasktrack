package com.github.karthxk07.task_management_system.initializer;

import java.util.Collections;
import java.util.HashSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.github.karthxk07.task_management_system.entity.Role;
import com.github.karthxk07.task_management_system.entity.User;
import com.github.karthxk07.task_management_system.respository.RoleRespository;
import com.github.karthxk07.task_management_system.respository.UserRepository;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRespository roleRespository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_EMAIL:}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD:}")
    private String adminPassword;

    @Autowired
    public AdminInitializer(UserRepository userRepository, RoleRespository roleRespository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRespository = roleRespository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (adminEmail != null && !adminEmail.isBlank() && adminPassword != null && !adminPassword.isBlank()) {
            if (!userRepository.existsByEmail(adminEmail)) {
                Role adminRole = roleRespository.findByName("ROLE_ADMIN");
                if (adminRole == null) {
                    adminRole = new Role();
                    adminRole.setName("ROLE_ADMIN");
                    adminRole = roleRespository.save(adminRole);
                }

                User adminUser = new User();
                adminUser.setName("Admin");
                adminUser.setEmail(adminEmail);
                adminUser.setPasswordHash(passwordEncoder.encode(adminPassword));
                adminUser.setRoles(new HashSet<>(Collections.singletonList(adminRole)));

                userRepository.save(adminUser);
                System.out.println("Default admin user created: " + adminEmail);

            } else {
                System.out.println("Admin user with email " + adminEmail + " already exists.");
            }
        } else {
            System.out.println(
                    "ADMIN_EMAIL or ADMIN_PASSWORD environment variables not set. Skipping default admin creation.");
        }
    }
}
