import * as migration_20260822_162045_add_editorial_roles from "./20260822_162045_add_editorial_roles";

export const migrations = [
  {
    up: migration_20260822_162045_add_editorial_roles.up,
    down: migration_20260822_162045_add_editorial_roles.down,
    name: "20260822_162045_add_editorial_roles",
  },
];
