import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", routes);

// Swagger UI
try {
  const specPath = path.resolve(__dirname, "../docs/openapi.yaml");
  if (fs.existsSync(specPath)) {
    const doc = yaml.load(fs.readFileSync(specPath, "utf8"));
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(doc as any));
  }
} catch (e) {
  // ignore swagger load errors
}

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Not Found" }
  });
});

app.use(errorHandler);

export default app;
