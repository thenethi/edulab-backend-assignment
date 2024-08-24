const AppDataSource = require("../data-source");
const Task = require("../entity/Task");
const User = require("../entity/User"); // Ensure you import User entity

exports.createTask = async (req, res) => {
  const { title, description, priority, status, assignedUserId } = req.body;
  const taskRepository = AppDataSource.getRepository(Task);

  // Fetch the user to be assigned
  const assignedUser = await AppDataSource.getRepository(User).findOneBy({
    id: assignedUserId,
  });

  if (!assignedUser) {
    return res.status(400).send("Assigned user not found");
  }

  const task = taskRepository.create({
    title,
    description,
    priority,
    status,
    assignedUser, // Link the user entity
  });

  await taskRepository.save(task);
  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  const { userId, role } = req.user; // Extracted from JWT

  const taskRepository = AppDataSource.getRepository(Task);

  let tasks;
  if (role === "admin") {
    // Admin can see all tasks
    tasks = await taskRepository.find({
      relations: ["assignedUser"],
    });
  } else {
    // Regular users can only see tasks assigned to them
    tasks = await taskRepository.find({
      where: { assignedUser: { id: userId } },
      relations: ["assignedUser"],
    });
  }

  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, status, assignedUserId } = req.body;

  const taskRepository = AppDataSource.getRepository(Task);
  let task = await taskRepository.findOneBy({ id });

  if (!task) {
    return res.status(404).send("Task not found");
  }

  // Check if the user has permission to update this task
  if (task.assignedUserId !== req.user.userId && req.user.role !== "admin") {
    return res.status(403).send("Forbidden");
  }

  task.title = title || task.title;
  task.description = description || task.description;
  task.priority = priority || task.priority;
  task.status = status || task.status;

  if (assignedUserId) {
    const assignedUser = await AppDataSource.getRepository(User).findOneBy({
      id: assignedUserId,
    });
    if (!assignedUser) {
      return res.status(400).send("Assigned user not found");
    }
    task.assignedUser = assignedUser;
  }

  await taskRepository.save(task);
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const taskRepository = AppDataSource.getRepository(Task);
  const task = await taskRepository.findOneBy({ id });

  if (!task) {
    return res.status(404).send("Task not found");
  }

  // Check if the user has permission to delete this task
  if (req.user.role !== "admin") {
    return res.status(403).send("Forbidden");
  }

  await taskRepository.remove(task);
  res.send("Task deleted successfully");
};
