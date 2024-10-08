import { Router } from "express";
import TaskController from "../controllers/TaskController.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const taskRouter = Router();
const taskController = new TaskController();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, "activities-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== ".json") {
      return cb(new Error("Solo se permiten archivos JSON"));
    }
    cb(null, true);
  },
});

taskRouter.post("/appActivitats/task", taskController.createTask);
taskRouter.get("/appActivitats/tasks", taskController.getAllTasks);
taskRouter.get("/appActivitats/tasks/:id", taskController.getTaskById);
taskRouter.put("/appActivitats/tasks/:id", taskController.updateTask);
taskRouter.post(
  "/appActivitats/tasks/:taskId/join",
  taskController.addParticipant
);
taskRouter.delete(
  "/appActivitats/tasks/:taskId/remove/:participantId",
  taskController.removeParticipant
);
taskRouter.delete("/appActivitats/tasks/:taskId", taskController.deleteTask);
taskRouter.get(
  "/appActivitats/download",
  upload.none(),
  taskController.downloadActivities
);
taskRouter.post(
  "/appActivitats/tasks/upload",
  upload.single("file"),
  taskController.uploadActivities
);

export default taskRouter;
