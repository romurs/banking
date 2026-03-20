import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma", // путь к схеме
  datasource: {
    url: process.env.DATABASE_URL || 'mysql://root:ROOT@localhost:3306/banking_db',
  },
});
