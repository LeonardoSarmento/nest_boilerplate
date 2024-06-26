import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { RoleSchema } from "../role.entity";

export const UpdateRoleSchema = RoleSchema.omit({
  id: true,
});

export type UpdateRoleType = z.infer<typeof UpdateRoleSchema>;

export class UpdateRoleDto extends createZodDto(UpdateRoleSchema) {}
