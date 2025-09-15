// import express from "express";
// import dotenv from "dotenv";
// import authRoutes from "./routes/auth.route.js";
// import messageRoutes from "./routes/message.route.js";
// import { connectDB } from "./lib/db.js";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import path from "path";
// import { app, server } from "./lib/socket.js";

// dotenv.config();

// const PORT = process.env.PORT;
// const __dirname = path.resolve();

// app.use(express.json());
// app.use(cookieParser());

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// if (process.env.NODE_ENV == "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }

// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

// server.listen(PORT, () => {
//   console.log("server is running in PORT:" + PORT);
//   connectDB();
// });

import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) return res.status(404).send("Not found");
    res.sendFile(join(frontendPath, "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
  connectDB();
});
