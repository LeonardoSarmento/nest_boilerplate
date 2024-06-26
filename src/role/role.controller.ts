import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Res,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiNoContentResponse,
} from "@nestjs/swagger";
import { Response } from "express";
import { RoleService } from "./role.service";
import { UpdateRoleDto, UpdateRoleType } from "./dto/update-role.dto";
import { RoleDb, RoleDto, RoleType } from "./role.entity";
import { CreateRoleDto, CreateRoleType } from "./dto/create-role.dto";
import { AppFilter } from "src/app.filter";
import { Roles } from "./role.decorator";
import { RoleEnum } from "./role.entity";

@ApiTags("Role")
@Controller("roles")
export class RoleController {
  constructor(private readonly _service: RoleService) {}

  @Post()
  @ApiBody({ type: CreateRoleDto })
  @ApiCreatedResponse({ type: RoleDto })
  @ApiBadRequestResponse({ type: CreateRoleDto })
  async post(@Body() createRoleDto: CreateRoleType, @Res() res: Response) {
    try {
      const newRole = await this._service.create(createRoleDto);

      return res.status(201).send(newRole);
    } catch (error) {
      const { statusCode, helpMessage } = new AppFilter(error);
      return res.status(statusCode).send(helpMessage);
    }
  }

  @Get("/all")
  @Roles(RoleEnum.ADMIN)
  @ApiOkResponse({ type: [RoleDto] })
  async getAll(@Res() res: Response) {
    try {
      const allRoles = await this._service.findAll();
      res.status(200).send(allRoles);
    } catch (error) {
      const errorFilter = new AppFilter(error);
      res.status(errorFilter.statusCode).send(errorFilter.helpMessage);
    }
  }

  @Get(":id")
  @ApiOkResponse({ type: RoleDto })
  async getById(@Param("id") roleId: number, @Res() res: Response) {
    try {
      const role_Id = await this._service.findOne(roleId);
      res.status(200).send(role_Id);
    } catch (error) {
      const errorFilter = new AppFilter(error);
      res.status(errorFilter.statusCode).send(errorFilter.helpMessage);
    }
  }

  @Patch(":id")
  @ApiBody({ type: UpdateRoleDto })
  @ApiOkResponse({ type: RoleDto })
  async update(
    @Param("id") roleId: number,
    @Body() newRoleData: UpdateRoleType,
    @Res() res: Response,
  ) {
    try {
      const updateRole = await this._service.update(roleId, newRoleData);
      res.status(200).send(updateRole);
    } catch (error) {
      const errorFilter = new AppFilter(error);
      res.status(errorFilter.statusCode).send(errorFilter.helpMessage);
    }
  }

  @Delete(":id")
  @ApiNoContentResponse({ description: "Successfully deleted" })
  async delete(@Param("id") roleId: number, @Res() res: Response) {
    try {
      await this._service.remove(roleId);
      return res.status(204).send();
    } catch (error) {
      const errorFilter = new AppFilter(error);
      return res.status(errorFilter.statusCode).send(errorFilter.helpMessage);
    }
  }
}
