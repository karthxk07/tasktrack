package com.github.karthxk07.task_management_system.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import com.github.karthxk07.task_management_system.security.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

  private final CustomUserDetailsService customUserDetailsService;

  @Autowired
  public SecurityConfiguration(CustomUserDetailsService customUserDetailsService) {
    this.customUserDetailsService = customUserDetailsService;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    http
        .cors(cors -> cors.configurationSource(request -> {
          CorsConfiguration config = new CorsConfiguration();
          config.setAllowedOriginPatterns(List.of("*"));
          config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
          config.setAllowedHeaders(List.of("*"));
          config.setAllowCredentials(true);
          return config;
        }))
        .csrf(csrf -> csrf.disable())
        .userDetailsService(customUserDetailsService)
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/error/**").permitAll()
            .requestMatchers("/auth/login").permitAll()
            .requestMatchers("/auth/register").hasAnyAuthority("ROLE_ADMIN")
            .requestMatchers("/auth/me").authenticated()
            .requestMatchers("/api/users").hasAnyAuthority("ROLE_ADMIN")
            .anyRequest().authenticated());

    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthenticationManager authenticationManager(
      AuthenticationConfiguration configuration) throws Exception {
    return configuration.getAuthenticationManager();
  }
}
