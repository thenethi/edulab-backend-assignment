const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    username: {
      type: "varchar",
    },
    password: {
      type: "varchar",
    },
  },
  relations: {
    role: {
      target: "Role",
      type: "many-to-one",
      joinColumn: true,
    },
  },
});
