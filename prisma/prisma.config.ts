import { config } from "dotenv";
import "dotenv/config";
import { defineConfig } from "prisma/config";

config();

export default defineConfig({
	schema: "schema.prisma",
	migrations: {
		path: "migrations",
	},
	datasource: {
		url: process.env.DATABASE_URL,
	},
});
