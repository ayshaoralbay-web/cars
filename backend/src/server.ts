import app from "./app";
import { createTablesAndSeed } from "./database/createTable";

const PORT = Number(process.env.PORT) || 5001;

async function start() {
  try {
    await createTablesAndSeed();
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}
start();
