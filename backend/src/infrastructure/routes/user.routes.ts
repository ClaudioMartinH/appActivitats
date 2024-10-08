import { Router } from "express";
import UserController from "../controllers/UserController.js";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/appActivitats/users/", userController.getAllUsers);
userRouter.post("/appActivitats/user/", userController.createUser);
userRouter.get("/appActivitats/users/:id", userController.getUserById);
userRouter.put("/appActivitats/users/:id", userController.updateUser);
userRouter.delete("/appActivitats/users/:id", userController.deleteUser);
userRouter.get(
  "/appActivitats/users/search/:name",
  userController.getUserByName
);
userRouter.post("/appActivitats/user/login", userController.login);

export default userRouter;
