import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const TaskModelMongoose =
  mongoose.model("Task", taskSchema) || mongoose.models.Task;
export default TaskModelMongoose;
