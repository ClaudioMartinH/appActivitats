//import mongoose from "mongoose";
import { Task } from "../../domain/entities/Task.js";
import { TaskRepository } from "../../domain/repositories/TaskRepository.js";
import { TaskService } from "../services/TaskService.js";
import { UserService } from "../services/UserService.js";

export class TaskServiceImpl implements TaskService {
  private taskRepository: TaskRepository;
  private userService: UserService;
  constructor(taskRepository: TaskRepository, userService: UserService) {
    this.taskRepository = taskRepository;
    this.userService = userService;
  }
  async getTasks(): Promise<Task[]> {
    try {
      const tasks: Task[] = await this.taskRepository.getAllTasks();
      if (!tasks || tasks.length === 0) {
        throw new Error("No tasks found");
      }
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  }
  async getTaskById(id: string): Promise<Task | null> {
    try {
      const task: Task = await this.taskRepository.findById(id);
      if (!task) {
        console.log(`Task with id ${id} not found`);
        return null;
      }
      return task;
    } catch (error) {
      console.error(`Error fetching task by id ${id}:`, error);
      throw new Error(`Error fetching task by id: ${error}`);
    }
  }
  async createTask(
    id: string,
    title: string,
    description: string,
    capacity: number,
    participants: string[]
  ): Promise<Task> {
    try {
      const newTask = new Task(id, title, description, capacity, participants);
      return await this.taskRepository.createTask(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
      throw new Error(`Error creating task: ${error}`);
    }
  }

  async updateTask(task: Task): Promise<void> {
    try {
      await this.taskRepository.updateTask(
        task.id,
        task.title,
        task.description,
        task.capacity,
        task.participants
      );
    } catch (error) {
      throw new Error(`Error updating task: ${error}`);
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await this.taskRepository.deleteTask(id);
    } catch (error) {
      throw new Error(`Error deleting task by id: ${error}`);
    }
  }
  async findTasksByTitle(title: string): Promise<Task[]> {
    try {
      const tasks: Task[] = await this.taskRepository.getAllTasks();
      return tasks.filter((task: Task) =>
        task.title.toLowerCase().includes(title.toLowerCase())
      );
    } catch (error) {
      throw new Error(`Error finding tasks by title: ${error}`);
    }
  }
  async findTasksByCapacity(capacity: number): Promise<Task[]> {
    try {
      const tasks: Task[] = await this.taskRepository.getAllTasks();
      return tasks.filter((task: Task) => task.capacity === capacity);
    } catch (error) {
      throw new Error(`Error finding tasks by capacity: ${error}`);
    }
  }
  async addParticipant(task: Task, userId: string): Promise<void> {
    try {
      const foundTask = await this.taskRepository.findById(task.id);
      if (!foundTask) {
        throw new Error("Task not found");
      }

      if (foundTask.participants.length >= foundTask.capacity) {
        throw new Error("Task capacity reached");
      }

      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      if (foundTask.participants.includes(userId)) {
        throw new Error("User is already a participant");
      }

      foundTask.participants.push(userId);
      await this.taskRepository.updateTask(
        foundTask.id,
        foundTask.title,
        foundTask.description,
        foundTask.capacity,
        foundTask.participants
      );

      console.log("Participant added successfully");
    } catch (error) {
      throw new Error(`Error adding participant to task: ${error}`);
    }
  }
  async removeParticipant(taskId: string, userId: string): Promise<void> {
    try {
      const foundTask = await this.taskRepository.findById(taskId);
      const foundUser = this.userService.getUserById(userId);
      if (!foundTask || !foundUser) {
        throw new Error("Task or user not found");
      }
      await this.taskRepository.removeParticipant(foundTask.id, userId);
      console.log("Participant removed successfully");
    } catch (error) {
      throw new Error(`Error removing participant from task: ${error}`);
    }
  }
}
