import { Injectable } from "@nestjs/common";
import { CreateRoleDto, CreateRoleType } from "./dto/create-role.dto";
import { DatabaseService } from "src/database/database.service";
import { RoleSchema, RoleType, RoleDb } from "./role.entity";
import { UpdateRoleType } from "./dto/update-role.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class RoleRepository {
  constructor(private readonly _prisma: DatabaseService) {}

  async create(newRole: CreateRoleType): Promise<RoleDb> {
    try {
      return await this._prisma.role.create({
        data: newRole,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(error.code);
      }
      throw error;
    }
  }

  async selectAll(): Promise<RoleDb[]> {
    return await this._prisma.role.findMany();
  }

  async selectById(roleId: RoleType["id"]): Promise<RoleDb> {
    return this._prisma.role.findUniqueOrThrow({
      where: {
        id: roleId,
      },
    });
  }

  async updateById(roleId: RoleType["id"], newRoleData: UpdateRoleType) {
    const validator1 = await this._prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });

    if (!validator1) {
      throw new Error("Cargo não existe");
    }

    const validator = await this._prisma.role.findFirst({
      where: { code: newRoleData.code },
    });
    if (validator) {
      throw new Error("Cargo já existente");
    }

    await this._prisma.role.update({
      where: {
        id: roleId,
      },
      data: newRoleData,
    });
  }

  async deleteById(roleId: RoleType["id"]) {
    const validator1 = await this._prisma.role.findUnique({
      where: { id: roleId },
    });
    if (!validator1) {
      throw new Error("Cargo não existe");
    }

    const validator2 = await this._prisma.user.findFirst({
      where: { roleCode: validator1.code },
    });
    if (validator2) {
      throw new Error("Usuários com cargo cadastrados");
    }

    await this._prisma.role.delete({
      where: {
        id: roleId,
      },
    });
  }
}
