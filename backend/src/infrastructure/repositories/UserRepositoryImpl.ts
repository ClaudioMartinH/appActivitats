import mongoose, { Model } from "mongoose";
import { User } from "../../domain/entities/User.js";
import { UserRepository } from "../../domain/repositories/UserRepository.js";
import UserDoc, { IUser } from "../../models/userDoc.model.js";

export class UserRepositoryImpl implements UserRepository {
  private userModel: Model<IUser>;
  constructor() {
    this.userModel = UserDoc;
  }
  private toDomain(userDoc: IUser): User {
    return new User(
      (userDoc._id as mongoose.Types.ObjectId).toString(),
      userDoc.firstName,
      userDoc.lastName,
      userDoc.age,
      userDoc.email,
      userDoc.password
    );
  }
  private toDocument(user: User): Partial<IUser> {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      email: user.email,
      password: user.password,
    };
  }
  async createUser(user: User): Promise<User> {
    const userDoc = new this.userModel(this.toDocument(user));
    const savedUser = await userDoc.save();
    return this.toDomain(savedUser);
  }

  async removeUser(id: string): Promise<void> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid user ID format: ${id}`);
      }
      await this.userModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new Error(
        `Error deleting user with id ${id}: ${(error as Error).message}`
      );
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid user ID format: ${id}`);
      }
      const userDoc = await this.userModel.findById(id).exec();
      return userDoc ? this.toDomain(userDoc) : null;
    } catch (error) {
      throw new Error(
        `Error fetching user with id ${id}: ${(error as Error).message}`
      );
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const userDocs = await this.userModel.find().exec();
      return userDocs.map((userDoc) => this.toDomain(userDoc));
    } catch (error) {
      throw new Error(`Error fetching all users: ${(error as Error).message}`);
    }
  }
  async updateInfo(
    id: string,
    name: string,
    lastName: string,
    age: number,
    email: string
  ): Promise<void> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid user ID format: ${id}`);
      }
      await this.userModel
        .findByIdAndUpdate(id, {
          firstName: name,
          lastName,
          age,
          email,
        })
        .exec();
    } catch (error) {
      throw new Error(
        `Error updating user info with id ${name}: ${(error as Error).message}`
      );
    }
  }
  async getUserByName(name: string): Promise<User> {
    try {
      const userDoc = await this.userModel.findOne({ firstName: name }).exec();
      if (!userDoc) {
        throw new Error(`User with name ${name} not found`);
      }
      return this.toDomain(userDoc);
    } catch (error) {
      throw new Error(
        `Error fetching user by name: ${(error as Error).message}`
      );
    }
  }
  async getUserByEmail(email: string): Promise<User> {
    try {
      const userDoc = await this.userModel.findOne({ email }).exec();
      if (!userDoc) {
        throw new Error(`User with email ${email} not found`);
      }
      return this.toDomain(userDoc);
    } catch (error) {
      throw new Error(
        `Error fetching user by email: ${(error as Error).message}`
      );
    }
  }
}
