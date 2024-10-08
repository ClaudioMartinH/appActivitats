import mongoose from "mongoose";

export interface ITask extends mongoose.Document {
  title: string;
  description: string;
  capacity: number;
  participants: mongoose.Types.ObjectId[];
}

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  capacity: { type: Number, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const TaskDoc = mongoose.model<ITask>("ITask", TaskSchema);

export default TaskDoc;
