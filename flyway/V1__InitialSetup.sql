CREATE TABLE "users" (
  "id" uuid PRIMARY KEY NOT NULL,
  "username" varchar(30) NOT NULL,
  "email" varchar(254) UNIQUE NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "two_factor_secret" varchar(255) NOT NULL,
  "created_at" timestamp NOT NULL
);

CREATE TABLE "teams" (
  "id" int PRIMARY KEY NOT NULL,
  "name" varchar(50) NOT NULL,
  "created_at" timestamp NOT NULL
);

CREATE TABLE "roles" (
  "id" int PRIMARY KEY NOT NULL,
  "name" varchar(20) UNIQUE NOT NULL
);

CREATE TABLE "user_roles" (
  "id" int PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL,
  "team_id" int,
  "role_id" int NOT NULL
);

CREATE TABLE "todos" (
  "id" int PRIMARY KEY NOT NULL,
  "title" varchar(100) NOT NULL,
  "description" varchar(500),
  "created_by" uuid NOT NULL,
  "assigned_to" uuid NOT NULL,
  "team_id" int NOT NULL,
  "created_at" timestamp NOT NULL,
  "completed_at" timestamp
);

ALTER TABLE "user_roles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_roles" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");

ALTER TABLE "user_roles" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id");

ALTER TABLE "todos" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "todos" ADD FOREIGN KEY ("assigned_to") REFERENCES "users" ("id");

ALTER TABLE "todos" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");