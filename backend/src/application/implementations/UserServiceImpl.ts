import { User } from "../../domain/entities/User.js";
import { UserRepository } from "../../domain/repositories/UserRepository.js";
import { UserService } from "../services/UserService.js";
import { hashedPassword } from "../../middleware/hashPassword.js";
import { comparePassword } from "../../middleware/verifyPassword.js";

export class UserServiceImpl implements UserService {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.getAllUsers();
  }
  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }
  async createUser(
    firstName: string,
    lastName: string,
    age: number,
    email: string,
    password: string
  ): Promise<User> {
    const passwordHashed = await hashedPassword(password);

    const newUser = new User(
      "",
      firstName,
      lastName,
      age,
      email,
      passwordHashed
    );
    const createdUser = await this.userRepository.createUser(newUser);
    return createdUser;
  }
  async updateUser(user: User): Promise<void> {
    await this.userRepository.updateInfo(
      user.id,
      user.firstName,
      user.lastName,
      user.age,
      user.email
    );
  }
  async deleteUser(id: string): Promise<void> {
    await this.userRepository.removeUser(id);
  }
  async getUserByName(name: string): Promise<User> {
    const user = await this.userRepository.getUserByName(name);
    if (!user) {
      throw new Error(`User with name ${name} not found`);
    }
    return user;
  }
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }
    return user;
  }
  async login(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user || !user.password) {
      return null;
    }
    const validPassword = await comparePassword(password, user.password);
    console.log(`User password:  ${user.password} password: ${password}`);
    if (validPassword) {
      return user;
    }
    return null;
  }
}
