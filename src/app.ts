import express from "express";
import bodyParser from "body-parser";

// Controllers (route handlers)
import * as apiController from "./controllers/api";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);

app.use(bodyParser.json());

app.post("/entity", apiController.createEntity);
app.put("/entity/:id", apiController.updateEntity);
app.delete("/entity/:id", apiController.deleteEntity);
app.get("/events", apiController.sseStream);

export default app;