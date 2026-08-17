import path from "path"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrate: {
    async adapter() {
      const { PrismaNeon } = await import("@prisma/adapter-neon")
      const { neonConfig, Pool } = await import("@neondatabase/serverless")
      neonConfig.webSocketConstructor = await import("ws").then(m => m.default)
      const pool = new Pool({ connectionString: process.env.DIRECT_URL })
      return new PrismaNeon(pool)
    }
  }
})