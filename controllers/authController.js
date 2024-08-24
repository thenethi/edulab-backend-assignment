const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AppDataSource = require("../data-source");
const User = require("../entity/User");
const Role = require("../entity/Role");

exports.registerUser = async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Normalize role name to lowercase
  const normalizedRole = role.toLowerCase();

  const userRole = await AppDataSource.getRepository(Role).findOneBy({
    name: normalizedRole,
  });

  if (!userRole) {
    return res.status(400).send("Invalid role specified");
  }

  const newUser = AppDataSource.getRepository(User).create({
    username,
    password: hashedPassword,
    role: userRole,
  });
  await AppDataSource.getRepository(User).save(newUser);
  res.status(201).send("User registered successfully");
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Normalize username to avoid case issues
  const user = await AppDataSource.getRepository(User).findOne({
    where: { username },
    relations: ["role"],
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role.name },
    process.env.JWT_SECRET
  );
  res.json({ token });
};
