import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { UserSchema } from "../user.entity";

export const UpdateUserSchema = UserSchema.omit({
  id: true,
  roleCode: true,
  password: true,
  verifiedAt: true,
  createAt: true,
  updateAt: true,
});

export type UpdateUserType = z.infer<typeof UpdateUserSchema>;

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
