import { UserRepositoryImpl } from "../repositories/UserRepositoryImpl.js";
import { UserServiceImpl } from "../../application/implementations/UserServiceImpl.js";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { hashedPassword } from "../../middleware/hashPassword.js";

const userRepository = new UserRepositoryImpl();
const userService = new UserServiceImpl(userRepository);

export default class UserController {
  public async createUser(req: Request, res: Response) {
    try {
      const { firstName, lastName, age, email, password } = req.body;
      if (!firstName || !lastName || !age || !email || !password) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }
      const parsedAge = parseInt(age, 10);
      if (typeof parsedAge !== "number" || parsedAge <= 0) {
        res.status(400).json({ message: "Invalid age" });
        return;
      }
      const user = await userService.createUser(
        firstName,
        lastName,
        parsedAge,
        email,
        password
      );
      res.status(201).json({ message: "User created successfully", user });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating user" });
      return;
    }
  }
  public async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      if (!users.length) {
        res.status(404).json({ message: "No users found" });
        return;
      }
      res.status(200).json(users);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting users" });
      return;
    }
  }

  public async getUserById(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: "Invalid user ID" });
        return;
      }
      const user = await userService.getUserById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting user" });
      return;
    }
  }

  public async updateUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: "Invalid user ID" });
        return;
      }

      const { firstName, lastName, age, email, password } = req.body;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {};

      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (age) updateData.age = parseInt(age);
      if (email) updateData.email = email;
      if (password) updateData.password = await hashedPassword(password);

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ message: "No fields to update" });
        return;
      }

      const updatedUser = await userService.updateUser({
        id: userId,
        ...updateData,
      });
      res.status(200).json(updatedUser);
      return;
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Error updating user" });
      return;
    }
  }
  public async deleteUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: "Invalid user ID" });
        return;
      }
      await userService.deleteUser(userId);
      res.status(204).send();
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting user" });
      return;
    }
  }
  public async getUserByName(req: Request, res: Response) {
    try {
      const name = req.params.name;
      const user = await userService.getUserByName(name);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting user by name" });
      return;
    }
  }
  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }
      const user = await userService.login(email, password);
      if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age,
        },
      });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error logging in" });
      return;
    }
  }
}
