# Exception Handling Documentation

This document explains the exception handling implemented in the Task Management System.

## Global Exception Handler

The `GlobalExceptionHandler` class handles all exceptions thrown by the application and provides consistent error responses.

### Handled Exceptions

1. **UsernameNotFoundException** (404 Not Found)
   - Triggered when a user tries to login with invalid credentials
   - Response format:
   ```json
   {
     "timestamp": "2026-03-26T11:33:28.962Z",
     "status": 404,
     "error": "User Not Found",
     "message": "Invalid email or password",
     "path": "/auth/login"
   }
   ```

2. **ResourceNotFoundException** (404 Not Found)
   - Triggered when trying to access a user or task that doesn't exist
   - Response format:
   ```json
   {
     "timestamp": "2026-03-26T11:33:28.962Z",
     "status": 404,
     "error": "Resource Not Found",
     "message": "User not found with id : 123",
     "path": "/api/users/123"
   }
   ```

3. **IllegalArgumentException** (400 Bad Request)
   - Triggered when trying to register with an email that already exists
   - Response format:
   ```json
   {
     "timestamp": "2026-03-26T11:33:28.962Z",
     "status": 400,
     "error": "Bad Request",
     "message": "Email already in use",
     "path": "/auth/register"
   }
   ```

4. **SecurityException** (403 Forbidden)
   - Triggered when a user tries to perform an action they don't have permission for
   - Response format:
   ```json
   {
     "timestamp": "2026-03-26T11:33:28.962Z",
     "status": 403,
     "error": "Access Denied",
     "message": "You don't have permission to update this task",
     "path": "/api/tasks/123"
   }
   ```

5. **Exception** (500 Internal Server Error)
   - Catches all other unexpected exceptions
   - Response format:
   ```json
   {
     "timestamp": "2026-03-26T11:33:28.962Z",
     "status": 500,
     "error": "Internal Server Error",
     "message": "An unexpected error occurred. Please try again later.",
     "path": "/api/unknown"
   }
   ```

## Benefits

1. **Consistent Error Format**: All errors follow the same JSON structure
2. **Proper HTTP Status Codes**: Each exception type returns the appropriate HTTP status code
3. **User-Friendly Messages**: Error messages are clear and actionable
4. **Security**: Sensitive information is not exposed in error messages
5. **Debugging**: Timestamp and path information help with troubleshooting

## Implementation Details

- The `@ControllerAdvice` annotation ensures the handler applies to all controllers
- Each exception handler method returns a `ResponseEntity` with a standardized error response
- The global exception handler catches any unhandled exceptions to prevent stack traces from being exposed to clients
