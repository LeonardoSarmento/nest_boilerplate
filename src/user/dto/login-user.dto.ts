import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { UserSchema } from "../user.entity";
import { ApiExtraModels, OmitType } from "@nestjs/swagger";

export const LoginUserSchema = UserSchema.omit({
  id: true,
  roleCode: true,
  firstName: true,
  lastName: true,
  phone: true,
  company: true,
  verifiedAt: true,
  createAt: true,
  updateAt: true,
});

export type LoginUserType = z.infer<typeof LoginUserSchema>;

@ApiExtraModels()
export class LoginUserDto extends createZodDto(LoginUserSchema) {}

@ApiExtraModels()
export class PassResetDTO extends OmitType(LoginUserDto, [
  "password",
] as const) {}

@ApiExtraModels()
export class UpdatePassDTO extends OmitType(LoginUserDto, ["email"] as const) {}
