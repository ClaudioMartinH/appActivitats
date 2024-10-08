import fs from "fs";
import { Task } from "../domain/entities/Task.js";

export function uploadTasks(tasks: Task[]): void {
  const JSONData = JSON.stringify({ tasks }, null, 2);
  fs.writeFileSync("tasks.json", JSONData);
}
