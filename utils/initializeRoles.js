const AppDataSource = require("../data-source");
const Role = require("../entity/Role");

const initializeRoles = async () => {
  try {
    const roleRepository = AppDataSource.getRepository(Role);
    const roles = ["admin", "user"];

    for (const roleName of roles) {
      const existingRole = await roleRepository.findOneBy({ name: roleName });

      if (!existingRole) {
        const newRole = roleRepository.create({ name: roleName });
        await roleRepository.save(newRole);
      } else {
      }
    }
  } catch (error) {
    console.error("Error initializing roles:", error);
  }
};

module.exports = initializeRoles;
