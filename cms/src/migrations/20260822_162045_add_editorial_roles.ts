import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_users_role" AS ENUM (
        'admin',
        'editor',
        'author',
        'contributor',
        'viewer'
      );
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "role" "public"."enum_users_role" DEFAULT 'contributor';

    UPDATE "users"
    SET "role" = 'admin'
    WHERE "id" = (
      SELECT "id"
      FROM "users"
      ORDER BY "created_at" ASC NULLS LAST, "id" ASC
      LIMIT 1
    )
    AND ("role" IS NULL OR "role" = 'contributor');

    UPDATE "users"
    SET "role" = 'contributor'
    WHERE "role" IS NULL;

    ALTER TABLE "users"
      ALTER COLUMN "role" SET DEFAULT 'contributor',
      ALTER COLUMN "role" SET NOT NULL;

    CREATE TABLE IF NOT EXISTS "users_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "authors_id" integer
    );

    DO $$ BEGIN
      ALTER TABLE "users_rels"
        ADD CONSTRAINT "users_rels_parent_fk"
        FOREIGN KEY ("parent_id")
        REFERENCES "public"."users"("id")
        ON DELETE cascade
        ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "users_rels"
        ADD CONSTRAINT "users_rels_authors_fk"
        FOREIGN KEY ("authors_id")
        REFERENCES "public"."authors"("id")
        ON DELETE cascade
        ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
      WHEN undefined_table THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "users_rels_order_idx" ON "users_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "users_rels_parent_idx" ON "users_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "users_rels_path_idx" ON "users_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "users_rels_authors_id_idx" ON "users_rels" USING btree ("authors_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "users_rels" CASCADE;
    ALTER TABLE "users" DROP COLUMN IF EXISTS "role";
    DROP TYPE IF EXISTS "public"."enum_users_role";
  `);
}
