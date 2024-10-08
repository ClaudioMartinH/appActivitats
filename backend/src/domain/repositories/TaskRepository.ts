import { Task } from "../entities/Task.js";

export interface TaskRepository {
  findById(id: string): Promise<Task>;
  getAllTasks(): Promise<Task[]>;
  addParticipant(taskId: string, userId: string): Promise<void>;
  removeParticipant(taskId: string, userId: string): Promise<void>;
  updateCapacity(id: string, capacity: number): Promise<void>;
  updateTask(
    id: string,
    title: string,
    description: string,
    capacity: number,
    participants: string[]
  ): Promise<Task>;
  createTask(task: Task): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}
