import { Injectable } from "@nestjs/common";
import * as Bcrypt from "bcrypt";
import { CreateUserSchema, CreateUserType } from "./dto/create-user.dto";
import { UpdateUserSchema, UpdateUserType } from "./dto/update-user.dto";
import { UserRepository } from "./user.repository";
import { UserSchema, UserDb, UserType } from "./user.entity";
import { RoleEnum } from "src/role/role.entity";

@Injectable()
export class UserService {
  private _validator = UserSchema;

  constructor(private _repository: UserRepository) {}

  async create(newUser: CreateUserType): Promise<UserDb> {
    try {
      const createValidator = CreateUserSchema;

      newUser.roleCode = RoleEnum.USER;

      const userDTO = await createValidator.parseAsync(newUser);

      userDTO.password = await Bcrypt.hash(userDTO.password, 10);

      return await this._repository.create(userDTO);
    } catch (error) {
      throw error;
    }
  }

  async createUserRecoverRequest(
    recoverCode: string,
    userId: UserType["id"],
  ): Promise<any> {
    try {
      const now = new Date();
      return await this._repository.upsertUserRecover({
        recoverCode: recoverCode,
        userId: userId,
        expiredAt: new Date(now.getTime() + 30 * 60000),
      });
    } catch (error) {
      // if already existe request ?
      //
      throw error;
    }
  }

  async findAll(): Promise<UserDb[]> {
    try {
      return await this._repository.selectAll();
    } catch (error) {
      throw error;
    }
  }

  async findOne(userId: UserType["id"]): Promise<UserDb> {
    try {
      // Validando apenas uma propriedade + convertendo em número
      const userIdDTO = await this._validator.shape.id.parseAsync(userId);

      return await this._repository.selectById(userIdDTO?.valueOf());
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(userEmail: UserType["email"]): Promise<UserDb> {
    try {
      // Validando apenas uma propriedade
      const emailDTO = await this._validator.shape.email.parseAsync(userEmail);

      return await this._repository.selectByEmail(emailDTO?.valueOf());
    } catch (error) {
      throw error;
    }
  }

  async findRecoverToken(recoverToken: string): Promise<UserDb> {
    try {
      return await this._repository.selectUserRecoverByUuid(recoverToken);
    } catch (error) {
      throw error;
    }
  }

  async update(userId: UserType["id"], newUserData: UpdateUserType) {
    const userIdDTO = await this._validator.shape.id.parseAsync(userId);

    const updateDTO = await UpdateUserSchema.parseAsync(newUserData);

    // updateDTO.password = await Bcrypt.hash(updateDTO.password, 10);

    await this._repository.updateById(userIdDTO?.valueOf(), updateDTO);
  }

  async updatePass(
    userId: UserType["id"],
    newPass: UserType["password"],
  ): Promise<boolean> {
    try {
      const userIdDTO = await this._validator.shape.id.parseAsync(userId);

      let userPassDTO =
        await this._validator.shape.password.parseAsync(newPass);

      userPassDTO = await Bcrypt.hash(userPassDTO, 10);

      return (await this._repository.updatePass(userIdDTO, userPassDTO))
        ? true
        : false;
    } catch (error) {
      throw error;
    }
  }

  async updateUserRecover(recoverCode: string): Promise<any> {
    try {
      const now = new Date();
      const newTime = new Date(now.getTime() + 30 * 60000);

      return await this._repository.updateUserRecover(recoverCode, newTime);
    } catch (error) {
      // if already existe request ?
      //
      throw error;
    }
  }

  async deleteById(userId: UserType["id"]): Promise<boolean> {
    const userIdDTO = await this._validator.shape.id.parseAsync(userId);

    return (await this._repository.deleteById(userIdDTO?.valueOf()))
      ? true
      : false;
  }

  async deleteUserRecoverByUser(userId: UserType["id"]): Promise<boolean> {
    return (await this._repository.deleteUserRecoverByUserId(userId))
      ? true
      : false;
  }
}
