import { Task } from "../../domain/entities/Task.js";

export interface TaskService {
  getTasks(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | null>;
  createTask(
    id: string,
    title: string,
    description: string,
    capacity: number,
    participants: string[]
  ): Promise<Task>;
  updateTask(task: Task): Promise<void>;
  deleteTask(id: string): Promise<void>;
  findTasksByTitle(title: string): Promise<Task[]>;
  findTasksByCapacity(capacity: number): Promise<Task[]>;
  addParticipant(task: Task, userId: string): Promise<void>;
  removeParticipant(taskId: string, userId: string): Promise<void>;
}
