// import http from "http";
// import app from "./app.js";
// import { env } from "./utils/env.js";
// import { connectMongo } from "./utils/mongo.js";

// const server = http.createServer(app);

// async function main() {
//   await connectMongo();
//   server.listen(env.PORT, () => {
//     console.log(`Server listening on http://localhost:${env.PORT}`);
//   });
// }

// main().catch((err) => {
//   console.error("Fatal:", err);
//   process.exit(1);
// });


import http from "http";
import app from "./app.js";
import { env } from "./utils/env.js";
import { connectMongo } from "./utils/mongo.js";

const server = http.createServer(app);

async function main() {
  await connectMongo();

  // ✅ Render provides PORT dynamically (process.env.PORT)
  const port = Number(process.env.PORT || env.PORT || 5000);

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
