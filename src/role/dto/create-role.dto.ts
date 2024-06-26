import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { RoleSchema } from "../role.entity";

export const CreateRoleSchema = RoleSchema.omit({
  id: true,
});

export type CreateRoleType = z.infer<typeof CreateRoleSchema>;

export class CreateRoleDto extends createZodDto(CreateRoleSchema) {}
