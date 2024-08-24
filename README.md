# Task Management API

This API provides a system for managing tasks with role-based access control. The API supports user registration, authentication, task creation, retrieval, updating, and deletion. The system has two primary roles: `admin` and `user`.

## Roles and Permissions

### Admin
- Can create, view, update, and delete any task.
- Has full access to all the endpoints.

### User
- Can create tasks and view only the tasks assigned to them.
- Can update only the tasks assigned to them.
- Cannot delete any tasks.

## API Endpoints

### User Registration
- **Endpoint:** `/register`
- **Method:** `POST`
- **Description:** Registers a new user with a username, password, and role (`admin` or `user`).

  **Sample Request:**
  ```http
  POST http://localhost:5000/register
  Content-Type: application/json

  {
    "username": "arvnd",
    "password": "123",
    "role": "user"
  }

### Login
- **Endpoint**: `/login`
- **Method**: `POST`
- **Description**: Authenticates a user and returns a JWT token.
  
  **Sample Request**
   ```http
  POST http://localhost:5000/login
  Content-Type: application/json
  
  {
    "username": "arvnd",
    "password": "123"
  }

### Creating a Task
- **Endpoint**: `/tasks`
- **Method**: `POST`
- **Description**: Creates a new task. Available to both admin and user roles. The task will be assigned to the specified user.

    **Sample Request**
    ```http
    POST http://localhost:5000/tasks
    Content-Type: application/json
    Authorization: Bearer <your_jwt_token>
    
    {
      "title": "Complete Project Documentation",
      "description": "Finish writing the documentation for the project by the end of the week.",
      "priority": "high",
      "status": "pending",
      "assignedUserId": 2
    }

### Get All Tasks
- **Endpoint**: `/tasks`
- **Method**: `GET`
- **Description**: Retrieves all tasks. An admin can view all tasks, while a user can only view tasks assigned to them.

    **Sample Request**
    ```http
    GET http://localhost:5000/tasks
    Authorization: Bearer <your_jwt_token>

### Update a Task
- **Endpoint**: `/tasks/:id`
- **Method**: `PUT`
- **Description**: Updates an existing task. An admin can update any task, while a user can only update tasks assigned to them.

    **Sample Request**
    ```http
    PUT http://localhost:5000/tasks/2
    Content-Type: application/json
    Authorization: Bearer <your_jwt_token>
    
    {
      "title": "Complete Project Documentation",
      "description": "Update the documentation to include new API endpoints.",
      "priority": "medium",
      "status": "in progress"
    }

### Delete a Task
- **Endpoint**: `/tasks/:id`
- **Method**: `DELETE`
- **Description**: Deletes a task. Only admin users can delete tasks.

    **Sample Request**
    ```http
    DELETE http://localhost:5000/tasks/2
    Authorization: Bearer <your_jwt_token>
