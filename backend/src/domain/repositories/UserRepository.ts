import { User } from "../entities/User.js";

export interface UserRepository {
  createUser(user: User): Promise<User>;
  removeUser(id: string): Promise<void>;
  findById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  getUserByName(name: string): Promise<User>;
  updateInfo(
    id: string,
    name: string,
    lastName: string,
    age: number,
    email: string
  ): Promise<void>;
  getUserByEmail(email: string): Promise<User>;
}
