const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Role",
  tableName: "roles",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
  },
  relations: {
    users: {
      target: "User",
      type: "one-to-many",
      inverseSide: "role",
    },
  },
});
