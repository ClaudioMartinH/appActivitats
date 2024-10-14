import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectToMongoDB from "./DB/connectToMongoDB.js";
import "dotenv/config";
import userRouter from "./infrastructure/routes/user.routes.js";
import taskRouter from "./infrastructure/routes/task.routes.js";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import helmet from "helmet";
import errorHandler from "./middleware/errorHandler.js";
import { PORT, NODE_ENV } from "./utils/env.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.resolve(__dirname, "../../../frontend");
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
const origin =
  NODE_ENV === "production"
    ? "https://app-activitats.vercel.app"
    : `http://localhost:${PORT}`;

app.use(
  cors({
    origin: origin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(
  express.static("public", {
    setHeaders: (res, path) => {
      if (path.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
    },
  })
);
app.use(express.static(path.join(frontendPath, "public")));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "default-src": ["'self'", "https:", "data:", "blob:"],
        "style-src": ["'self'", "'unsafe-inline'", "https:"],
        "font-src": ["'self'", "https:", "data:"],
        "script-src": ["'self'", "'unsafe-inline'", "https:"],
        "img-src": ["'self'", "https:", "data:"],
      },
    },
  })
);
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong" });
  }
);
app.use(errorHandler);
app.use("/api", userRouter);
app.use("/api", taskRouter);
app.get("/api/login", (req, res) => {
  res.sendFile(path.join(frontendPath, "public/pages/login.html"));
});
app.get("/api/register", (req, res) => {
  res.sendFile(path.join(frontendPath, "public/pages/register.html"));
});
app.get("/api/appActivitats/main", (req, res) => {
  res.sendFile(path.join(frontendPath, "public/pages/main.html"));
});

async function startServer() {
  try {
    await connectToMongoDB();
    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}

startServer();
