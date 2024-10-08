import { User } from "../../domain/entities/User.js";

export interface UserService {
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User>;
  createUser(
    firstName: string,
    lastName: string,
    age: number,
    email: string,
    password: string
  ): Promise<User>;
  updateUser(user: User): Promise<void>;
  deleteUser(id: string): Promise<void>;
  login(email: string, password: string): Promise<User | null>;
  getUserByName(name: string): Promise<User>;
  getUserByEmail(email: string): Promise<User>;
}
