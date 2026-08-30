import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "authors"
      ADD COLUMN IF NOT EXISTS "public_identity" varchar DEFAULT 'penName',
      ADD COLUMN IF NOT EXISTS "pen_name" varchar,
      ADD COLUMN IF NOT EXISTS "legal_name" varchar,
      ADD COLUMN IF NOT EXISTS "internal_identity_key" varchar,
      ADD COLUMN IF NOT EXISTS "identity_reveal_plan" text,
      ADD COLUMN IF NOT EXISTS "craft_office_pseudonym" varchar;

    UPDATE "authors"
    SET "public_identity" = 'penName'
    WHERE "public_identity" IS NULL;

    CREATE UNIQUE INDEX IF NOT EXISTS "authors_internal_identity_key_idx"
      ON "authors" USING btree ("internal_identity_key")
      WHERE "internal_identity_key" IS NOT NULL;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "authors_internal_identity_key_idx";

    ALTER TABLE "authors"
      DROP COLUMN IF EXISTS "craft_office_pseudonym",
      DROP COLUMN IF EXISTS "identity_reveal_plan",
      DROP COLUMN IF EXISTS "internal_identity_key",
      DROP COLUMN IF EXISTS "legal_name",
      DROP COLUMN IF EXISTS "pen_name",
      DROP COLUMN IF EXISTS "public_identity";
  `);
}
