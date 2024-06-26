import { Injectable } from "@nestjs/common";
import { CreateRoleType } from "./dto/create-role.dto";
import { UpdateRoleType } from "./dto/update-role.dto";
import { RoleRepository } from "./role.repository";
import { RoleDb, RoleType } from "./role.entity";
import { RoleSchema } from "./role.entity";

@Injectable()
export class RoleService {
  private readonly _validator = RoleSchema;

  constructor(private readonly _repository: RoleRepository) {}

  async create(newRole: CreateRoleType): Promise<RoleDb> {
    try {
      const roleDTO = await this._validator.parseAsync(newRole);

      return this._repository.create(roleDTO);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<RoleDb[]> {
    try {
      return await this._repository.selectAll();
    } catch (error) {
      throw error;
    }
  }

  async findOne(roleId: RoleType["id"]): Promise<RoleDb | Error> {
    try {
      const roleIdDTO = await this._validator.shape.id.parseAsync(roleId);

      return await this._repository.selectById(roleIdDTO?.valueOf());
    } catch (error) {
      throw error;
    }
  }

  async update(roleId: RoleDb["id"], newRoleData: UpdateRoleType) {
    const roleIdDTO = await this._validator.shape.id.parseAsync(roleId);
    await this._repository.updateById(roleIdDTO?.valueOf(), newRoleData);
  }

  async remove(roleId: RoleType["id"]) {
    const roleIdDTO = await this._validator.shape.id.parseAsync(roleId);

    await this._repository.deleteById(roleIdDTO?.valueOf());
  }
}
