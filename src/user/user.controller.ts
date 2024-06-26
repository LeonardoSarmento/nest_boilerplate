import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiCookieAuth,
} from "@nestjs/swagger";
import { UserService } from "./user.service";
import { Response } from "express";
import { UpdateUserDto, UpdateUserType } from "./dto/update-user.dto";
import { UserDto } from "./user.entity";
import { CreateUserDto, CreateUserType } from "./dto/create-user.dto";
import { AppFilter } from "src/app.filter";
import { AppException } from "src/app.exception";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/role/role.decorator";
import { RoleEnum } from "src/role/role.entity";

@ApiTags("User")
@Controller("users")
export class UserController {
  constructor(private readonly _service: UserService) {}

  @Post("/")
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: UserDto })
  @ApiBadRequestResponse({ type: CreateUserDto })
  public async post(
    @Body() createUserDto: CreateUserType,
    @Res() res: Response,
  ) {
    try {
      const newUser = await this._service.create(createUserDto);

      return res.status(201).send(newUser);
    } catch (error) {
      const errorFilter = new AppFilter(error);
      res.status(errorFilter.statusCode).send(errorFilter.helpMessage);
    }
  }

  @Get("/all")
  @Roles(RoleEnum.ADMIN)
  @ApiOkResponse({ type: [UserDto] })
  public async getAll(@Res() res: Response) {
    try {
      const allUsers = await this._service.findAll();

      return res.status(200).send(allUsers);
    } catch (error) {
      const errorFilter = new AppFilter(error);
      res.status(errorFilter.statusCode).send(errorFilter.helpMessage);
    }
  }

  @Get("/:id")
  @ApiOkResponse({ type: UserDto })
  public async getById(@Param("id") userId: number, @Res() res: Response) {
    try {
      const newUser = await this._service.findOne(userId);

      res.status(200).send(newUser);
    } catch (error) {
      const errorFilter = new AppFilter(error);
      res.status(errorFilter.statusCode).send(errorFilter.helpMessage);
    }
  }

  @Put(":id")
  @UseGuards(AuthGuard)
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserDto })
  // @ApiBadRequestResponse({ type:  })
  public async patch(
    @Param("id") userId: number,
    @Body() newUserData: UpdateUserType,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const updatedUser = await this._service.update(userId, newUserData);

      return res.status(200).send(updatedUser);
    } catch (error) {
      const { helpMessage, statusCode } = new AppFilter(error);
      return res.status(statusCode).send(helpMessage);
    }
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @ApiCookieAuth()
  @ApiNoContentResponse({ description: "Successfully deleted" })
  public async deleteById(@Param("id") userId: number, @Res() res: Response) {
    try {
      const successfullyDelete = await this._service.deleteById(userId);

      if (!successfullyDelete) {
        throw new AppException(500, ["Não foi possível deletar usuário"]);
      }
      return res.status(204).send();
    } catch (error) {
      const errorFilter = new AppFilter(error);
      return res.status(errorFilter.statusCode).send(errorFilter.helpMessage);
    }
  }
}
