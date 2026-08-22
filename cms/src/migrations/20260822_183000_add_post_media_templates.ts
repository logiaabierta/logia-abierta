import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_posts_content_template" AS ENUM ('text', 'video', 'audio');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_posts_media_details_platform" AS ENUM (
        'youtube',
        'spotify',
        'substack',
        'direct',
        'other'
      );
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE "posts"
      ADD COLUMN IF NOT EXISTS "content_template" "public"."enum_posts_content_template" DEFAULT 'text',
      ADD COLUMN IF NOT EXISTS "media_details_media_url" varchar,
      ADD COLUMN IF NOT EXISTS "media_details_duration" varchar,
      ADD COLUMN IF NOT EXISTS "media_details_platform" "public"."enum_posts_media_details_platform",
      ADD COLUMN IF NOT EXISTS "media_details_transcript" text;

    UPDATE "posts"
    SET "content_template" = 'text'
    WHERE "content_template" IS NULL;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts"
      DROP COLUMN IF EXISTS "media_details_transcript",
      DROP COLUMN IF EXISTS "media_details_platform",
      DROP COLUMN IF EXISTS "media_details_duration",
      DROP COLUMN IF EXISTS "media_details_media_url",
      DROP COLUMN IF EXISTS "content_template";

    DROP TYPE IF EXISTS "public"."enum_posts_media_details_platform";
    DROP TYPE IF EXISTS "public"."enum_posts_content_template";
  `);
}
