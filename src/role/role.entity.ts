import { z } from "zod";
import { ApiExtraModels } from "@nestjs/swagger";
import { createZodDto } from "@anatine/zod-nestjs";
import { Role } from "@prisma/client";

export enum RoleEnum {
  "ADMIN" = "ADMIN",
  "USER" = "USER",
}

export const RoleSchema = z.object({
  id: z.coerce.number().positive().optional().describe("ID"),

  code: z
    .string()
    .toUpperCase()
    .refine(
      (code) => Object.keys(RoleEnum).includes(code),
      `${'"Nível de acesso"'} informado não existe`,
    )
    .describe("Nível de acesso"),

  title: z
    .string({
      required_error: "Título obrigatório",
    })
    .min(3, "O Título deve ter no mínimo 3 letras")
    .max(100, "O Título pode ter no máximo 100 letras")
    .describe("Título"),

  description: z
    .string({
      required_error: "Descrição obrigatória",
    })
    .min(3, "A Descrição deve ter no mínimo 3 letras")
    .max(300, "A Descrição pode ter no máximo 300 letras")
    .describe("Descrição"),
});

export type RoleType = z.infer<typeof RoleSchema>;

@ApiExtraModels()
export class RoleDto extends createZodDto(RoleSchema) {}

export type RoleDb = Role;
