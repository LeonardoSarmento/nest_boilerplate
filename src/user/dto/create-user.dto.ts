import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { UserSchema } from "../user.entity";

export const CreateUserSchema = UserSchema.omit({
  id: true,
  verifiedAt: true,
  createAt: true,
  updateAt: true,
});

export type CreateUserType = z.infer<typeof CreateUserSchema>;

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
