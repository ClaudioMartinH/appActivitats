import mongoose, { Model } from "mongoose";
import { Task } from "../../domain/entities/Task.js";
import { TaskRepository } from "../../domain/repositories/TaskRepository.js";
import TaskDoc, { ITask } from "../../models/taskDoc.model.js";

export class TaskRepositoryImpl implements TaskRepository {
  private taskModel: Model<ITask>;
  constructor() {
    this.taskModel = TaskDoc;
  }
  private toDomain(taskDoc: ITask): Task {
    return new Task(
      taskDoc.id.toString(),
      taskDoc.title,
      taskDoc.description,
      taskDoc.capacity,
      taskDoc.participants.map((p) => p.toString())
    );
  }

  private toDocument(task: Task): Partial<ITask> {
    return {
      title: task.title,
      description: task.description,
      capacity: task.capacity,
      participants: task.participants.map(
        (participant) => new mongoose.Types.ObjectId(participant)
      ),
    };
  }
  async findById(id: string): Promise<Task> {
    try {
      const taskDoc = await this.taskModel.findById(id);
      if (!taskDoc) {
        throw new Error(`Task not found`);
      }
      return this.toDomain(taskDoc);
    } catch (error) {
      throw new Error(`Error getting task: ${error}`);
    }
  }

  async getAllTasks(): Promise<Task[]> {
    try {
      const taskDocs = await this.taskModel.find().populate("participants");
      if (!taskDocs || taskDocs.length === 0) {
        return [];
      }
      return taskDocs.map((doc) => this.toDomain(doc));
    } catch (error) {
      throw new Error(`Error getting tasks: ${error}`);
    }
  }

  async addParticipant(taskId: string, userId: string): Promise<void> {
    try {
      const result = await this.taskModel.findByIdAndUpdate(
        taskId,
        { $addToSet: { participants: new mongoose.Types.ObjectId(userId) } },
        { new: true, runValidators: true }
      );
      if (!result) {
        throw new Error("Task not found");
      }
      if (
        result &&
        result.participants &&
        result.participants.length > result.capacity
      ) {
        throw new Error("Task capacity exceeded");
      }
    } catch (error) {
      throw new Error(`Error adding participant: ${error}`);
    }
  }

  async removeParticipant(taskId: string, userId: string): Promise<void> {
    if (
      !mongoose.Types.ObjectId.isValid(taskId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      throw new Error("Invalid taskId or userId");
    }
    try {
      const result = await this.taskModel.findByIdAndUpdate(
        taskId,
        { $pull: { participants: userId } },
        { new: true, runValidators: true }
      );
      if (!result) {
        throw new Error("Task not found");
      }
      if (!userId) {
        throw new Error("Participant not found");
      }
      if (
        result.participants.includes(
          userId as unknown as mongoose.Types.ObjectId
        )
      ) {
        throw new Error("Participant not found in the task");
      }
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new Error("Invalid taskId or userId format");
      }
      if (error instanceof mongoose.Error.ValidationError) {
        throw new Error("Validation failed when updating task");
      }
      throw new Error(`Error removing participant: ${error}`);
    }
  }

  async updateCapacity(id: string, capacity: number): Promise<void> {
    try {
      const result = await this.taskModel.findByIdAndUpdate(
        id,
        { $set: { capacity } },
        { new: true, runValidators: true }
      );
      if (!result) {
        throw new Error("Task not found");
      }
    } catch (error) {
      throw new Error(`Error updating capacity: ${error}`);
    }
  }

  async updateTask(
    id: string,
    title: string,
    description: string,
    capacity: number,
    participants: string[]
  ): Promise<Task> {
    try {
      const updatedTask = await TaskDoc.findByIdAndUpdate(
        id,
        {
          title: title,
          description: description,
          capacity: capacity,
          participants: participants.map((p) => new mongoose.Types.ObjectId(p)),
        },
        { new: true }
      );
      if (!updatedTask) {
        throw new Error("Task not found");
      }
      return this.toDomain(updatedTask);
    } catch (error) {
      throw new Error(`Error updating task: ${error}`);
    }
  }
  async deleteTask(id: string): Promise<void> {
    try {
      await TaskDoc.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting task: ${error}`);
    }
  }
  async createTask(task: Task): Promise<Task> {
    try {
      const newTask = new TaskDoc({
        title: task.title,
        description: task.description,
        capacity: task.capacity,
        participants: [],
      });
      const savedTask = await newTask.save();
      return this.toDomain(savedTask);
    } catch (error) {
      throw new Error(`Error creating task: ${error}`);
    }
  }
}
