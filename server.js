require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authController = require("./controllers/authController");
const taskController = require("./controllers/taskController");
const {
  authenticateJWT,
  authorizeRole,
} = require("./middleware/authMiddleware");
const initializeRoles = require("./utils/initializeRoles");
const AppDataSource = require("./data-source");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database and roles
AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");

    // Initialize roles
    await initializeRoles();

    // Start the server after successful initialization
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

app.get("/", async (req, res) => {
  res.send(
    `Welcome to the Task Management API. Please refer to the [GitHub repository](https://github.com/thenethi/edulab-backend-assignment.git) for more details.`
  );
});

// Auth routes
app.post("/register", authController.registerUser);
app.post("/login", authController.loginUser);

// Task routes
app.post(
  "/tasks",
  authenticateJWT,
  authorizeRole(["admin", "user"]),
  taskController.createTask
);
app.get(
  "/tasks",
  authenticateJWT,
  authorizeRole(["admin", "user"]),
  taskController.getTasks
);
app.put(
  "/tasks/:id",
  authenticateJWT,
  authorizeRole(["admin", "user"]),
  taskController.updateTask
);
app.delete(
  "/tasks/:id",
  authenticateJWT,
  authorizeRole(["admin"]),
  taskController.deleteTask
);
