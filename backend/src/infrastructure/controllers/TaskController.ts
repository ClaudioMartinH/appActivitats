import { TaskRepositoryImpl } from "../repositories/TaskRepositoryImpl.js";
import { TaskServiceImpl } from "../../application/implementations/TaskServiceImpl.js";
import { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserRepositoryImpl } from "../repositories/UserRepositoryImpl.js";
import { UserServiceImpl } from "../../application/implementations/UserServiceImpl.js";
import fs from "fs/promises";
import TaskDoc from "../../models/taskDoc.model.js";
import path from "path";

dotenv.config();

const taskRepository = new TaskRepositoryImpl();
const userRepository = new UserRepositoryImpl();
const userService = new UserServiceImpl(userRepository);
const taskService = new TaskServiceImpl(taskRepository, userService);

interface JsonTask {
  nom: string;
  descripció: string;
  capacitat_màxima: number;
}

interface Task {
  title: string;
  description: string;
  capacity: number;
  participants: mongoose.Types.ObjectId[];
}

export default class TaskController {
  public async createTask(req: Request, res: Response) {
    try {
      const { title, description, capacity } = req.body;
      if (!title || !description || !capacity) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }
      const task = await taskService.createTask(
        mongoose.Types.ObjectId.toString(),
        title,
        description,
        capacity,
        []
      );
      res.status(201).json({
        id: task.id,
        title,
        description,
        capacity,
      });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating task" });
      return;
    }
  }

  public async getAllTasks(req: Request, res: Response) {
    try {
      const tasks = await taskService.getTasks();
      if (!tasks || tasks.length === 0) {
        res.status(404).json({ message: "No tasks found" });
        return;
      }
      res.status(200).json(
        tasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          capacity: task.capacity,
          participants: task.participants,
        }))
      );
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving tasks" });
      return;
    }
  }

  public async getTaskById(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const foundTask = await taskService.getTaskById(taskId);
      if (!foundTask) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      res.status(200).json({
        id: foundTask.id,
        title: foundTask.title,
        description: foundTask.description,
        capacity: foundTask.capacity,
        participants: foundTask.participants,
      });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving task" });
      return;
    }
  }
  public async updateTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, capacity, participants } = req.body;
      if (!title && !description && !capacity && !participants) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      await taskService.updateTask({
        id: id,
        title: title,
        description: description,
        capacity: capacity,
        participants: participants,
      });
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating task" });
      return;
    }
  }
  public async deleteTask(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      console.log("Attempting to delete task:", taskId);
      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        res.status(400).json({ message: "Invalid task ID" });
        return;
      }
      await taskService.deleteTask(taskId);
      res.status(204).json({ message: "Task deleted successfully" });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting task" });
      return;
    }
  }
  public async findTasksByTitle(req: Request, res: Response) {
    try {
      const { title } = req.params;
      if (!title) {
        res.status(400).json({ message: "Missing required title" });
        return;
      }
      const tasks = await taskService.findTasksByTitle(title);
      if (!tasks || tasks.length === 0) {
        res.status(404).json({ message: "No tasks found with this title" });
        return;
      }
      res.status(200).json(
        tasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          capacity: task.capacity,
          participants: task.participants,
        }))
      );
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving tasks by title" });
      return;
    }
  }
  public async findTasksByCapacity(req: Request, res: Response) {
    try {
      const { capacity } = req.params;
      if (!capacity) {
        res.status(400).json({ message: "Missing required capacity" });
        return;
      }
      const tasks = await taskService.findTasksByCapacity(parseInt(capacity));
      if (!tasks || tasks.length === 0) {
        res.status(404).json({ message: "No tasks found with this capacity" });
        return;
      }
      res.status(200).json(
        tasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          capacity: task.capacity,
        }))
      );
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving tasks by capacity" });
    }
  }
  public async addParticipant(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const { userJoinId } = req.body;
      if (!mongoose.Types.ObjectId.isValid(userJoinId)) {
        res.status(400).json({ message: "User ID is invalid" });
        return;
      }
      const task = await taskService.getTaskById(taskId);
      if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      console.log("Capacidad de la tarea:", task.capacity);
      console.log(
        "Número de participantes actuales:",
        task.participants.length
      );
      if (task.participants.length >= task.capacity) {
        console.log("La tarea está completa, devolviendo 400");
        res.status(400).json({ message: "Task is full" });
        return;
      }

      const updatedTask = await taskService.addParticipant(task, userJoinId);

      res.status(200).json({
        success: true,
        message: "Usuario agregado correctamente",
        task: updatedTask,
      });
      return;
    } catch (error) {
      //console.error("Error adding participant:", error);
      res.status(500).json({ message: "User is already a participant", error });
      return;
    }
  }
  public async removeParticipant(req: Request, res: Response) {
    try {
      const { taskId, participantId } = req.params;
      console.log("taskId: ", taskId, " participantId: ", participantId);

      await taskService.removeParticipant(taskId, participantId);

      res.status(204).send();
    } catch (error) {
      console.error("Error removing participant:", error);
      res.status(500).json({ message: "Error removing participant from task" });
    }
  }
  public async uploadActivities(req: Request, res: Response): Promise<void> {
    let filePath: string | null = null;
    try {
      if (!req.file) {
        res.status(400).json({ error: "No se ha subido ningún archivo" });
        return;
      }

      filePath = req.file.path;
      const fileContent = await fs.readFile(filePath, "utf8");
      let jsonTasks: JsonTask[];
      try {
        jsonTasks = JSON.parse(fileContent);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        res.status(400).json({ error: "Error al leer el archivo JSON" });
        return;
      }
      const tasksToInsert: Task[] = jsonTasks.map((task) => ({
        title: task.nom,
        description: task.descripció,
        capacity: task.capacitat_màxima,
        participants: [],
      }));
      const savedTasks = await TaskDoc.insertMany(tasksToInsert);

      res.status(200).json({
        message: "Actividades importadas con éxito",
        tasksCount: savedTasks.length,
      });
    } catch (error) {
      console.error("Error al importar actividades:", error);
      res.status(500).json({ error: "Error al importar actividades" });
    } finally {
      if (filePath) {
        try {
          await fs.unlink(filePath);
        } catch (unlinkError) {
          console.error("Error al eliminar el archivo:", unlinkError);
        }
      }
    }
  }
  // Import fs/promises instead of fs

  // ...

  public async downloadActivities(req: Request, res: Response) {
    try {
      const tasks = await taskRepository.getAllTasks();
      const fileName = "activitats.json";
      const filePath = path.join("uploads", fileName);
      if (!tasks || tasks.length === 0) {
        res.status(404).json({ message: "No tasks found" });
        return;
      }

      const tasksJSON = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        capacity: task.capacity,
        participants: task.participants,
      }));
      const tasksInJSON = JSON.stringify(tasksJSON, null, 2);
      // Escribir en el archivo de forma asíncrona y manejar errores
      await fs.writeFile(filePath, tasksInJSON, "utf-8");

      // Configura los headers para la descarga
      res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
      res.setHeader("Content-Type", "application/json");

      // Envía el archivo
      res.sendFile(path.resolve(filePath), async (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).send("Error al descargar el archivo");
        }
        // Elimina el archivo después de enviarlo
        try {
          await fs.unlink(filePath);
        } catch (unlinkError) {
          console.error("Error deleting file:", unlinkError);
        }
      });
    } catch (error) {
      console.error("Error downloading tasks:", error);
      res.status(500).json({ message: "Error al descargar las tareas" });
    }
  }
}
