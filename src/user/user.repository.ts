import { Injectable } from "@nestjs/common";
import { CreateUserType } from "./dto/create-user.dto";
import { DatabaseService } from "src/database/database.service";
import { UserType, UserDb } from "./user.entity";
import { UpdateUserType } from "./dto/update-user.dto";

@Injectable()
export class UserRepository {
  constructor(private readonly _prisma: DatabaseService) {}

  async create(newUser: CreateUserType): Promise<UserDb> {
    return await this._prisma.user.create({
      data: newUser,
    });
  }

  async upsertUserRecover(userRecover: any): Promise<any> {
    return await this._prisma.userRecover.upsert({
      where: {
        userId: userRecover.userId,
      },
      create: {
        uuid: userRecover.recoverCode,
        user: {
          connect: {
            id: userRecover.userId,
          },
        },
        expiredAt: userRecover.expiredAt,
      },
      update: {
        uuid: userRecover.recoverCode,
      },
    });
  }

  async selectAll(): Promise<UserDb[]> {
    return await this._prisma.user.findMany();
  }

  async selectById(userId: UserType["id"]): Promise<UserDb> {
    try {
      return await this._prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async selectByEmail(email: UserType["email"]): Promise<UserDb> {
    return await this._prisma.user.findUniqueOrThrow({
      where: {
        email: email,
      },
    });
  }

  async selectUserRecoverByUuid(recoverCode: string): Promise<any> {
    return await this._prisma.userRecover.findUnique({
      where: {
        uuid: recoverCode,
      },
    });
  }

  async updateById(
    userId: UserType["id"],
    newUserData: UpdateUserType,
  ): Promise<boolean> {
    return (await this._prisma.user.update({
      where: {
        id: userId,
      },
      data: newUserData,
    }))
      ? true
      : false;
  }

  async updatePass(
    userId: UserType["id"],
    newPass: UserType["password"],
  ): Promise<boolean> {
    return (await this._prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newPass,
      },
    }))
      ? true
      : false;
  }

  async updateUserRecover(
    recoverCode: string,
    newExpiredAt: Date,
  ): Promise<any> {
    return await this._prisma.userRecover.update({
      where: {
        uuid: recoverCode,
      },
      data: {
        expiredAt: newExpiredAt,
      },
    });
  }

  async deleteById(userId: UserType["id"]): Promise<boolean> {
    await this._prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return true;
  }

  async deleteUserRecoverByUuid(recoverCode: string): Promise<boolean> {
    return (await this._prisma.userRecover.delete({
      where: {
        uuid: recoverCode,
      },
    }))
      ? true
      : false;
  }

  async deleteUserRecoverByUserId(userId: UserType["id"]): Promise<boolean> {
    return (await this._prisma.userRecover.delete({
      where: {
        userId: userId,
      },
    }))
      ? true
      : false;
  }
}
