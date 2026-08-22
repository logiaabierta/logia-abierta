import * as migration_20260822_162045_add_editorial_roles from "./20260822_162045_add_editorial_roles";
import * as migration_20260822_170500_add_author_identity_fields from "./20260822_170500_add_author_identity_fields";

export const migrations = [
  {
    up: migration_20260822_162045_add_editorial_roles.up,
    down: migration_20260822_162045_add_editorial_roles.down,
    name: "20260822_162045_add_editorial_roles",
  },
  {
    up: migration_20260822_170500_add_author_identity_fields.up,
    down: migration_20260822_170500_add_author_identity_fields.down,
    name: "20260822_170500_add_author_identity_fields",
  },
];
