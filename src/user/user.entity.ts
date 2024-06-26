import { ApiExtraModels } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { RoleEnum } from "src/role/role.entity";

export const UserSchema = z.object({
  id: z
    .number({
      coerce: true,
      invalid_type_error: '"ID Usuário" deve ser um número',
    })
    .positive('"ID Usuário" deve ser maior que 0')
    // .optional()
    .describe("ID Usuário"),

  roleCode: z
    .string()
    .toUpperCase()
    .default(RoleEnum.USER)
    .refine(
      (code) => Object.keys(RoleEnum).includes(code),
      `${'"Nível de acesso"'} informado não existe`,
    )
    .describe("Nível de acesso"),

  firstName: z
    .string({
      required_error: "Primeiro nome é obrigatório",
    })
    .min(3, `${'"Primeiro nome"'} deve ter mais que 3 caracteres`)
    .max(50, `${'"Primeiro nome"'} deve ter no menos que 50 caracteres`)
    .describe("Primeiro nome"),

  lastName: z
    .string({
      required_error: "Sobrenome obrigatório",
    })
    .describe("Sobrenome")
    .min(3, `O sobrenome deve ter no mínimo 3 letras`)
    .max(50, `O sobrenome pode ter no máximo 50 letras`),

  company: z.string(),

  email: z
    .string()
    .email(`${'"E-mail"'} inválido`)
    .toLowerCase()
    .describe("E-mail"),

  password: z
    .string()
    .min(8, `Senha deve conter no mínimo 8 caracteres`)
    .regex(
      new RegExp(/([a-z]{1})/g),
      `${'"Senha"'} deve conter no mínimo uma letra minuscula`,
    )
    .regex(
      new RegExp(/([A-Z]{1})/g),
      `${'"Senha"'} deve conter no mínimo uma letra maiúscula`,
    )
    .regex(
      new RegExp(/([0-9]{1})/g),
      `${'"Senha"'} deve conter no mínimo um número`,
    )
    .regex(
      new RegExp(/(\W{1})/g),
      `${'"Senha"'} deve conter no mínimo um caractere especial`,
    )
    .describe("Senha"),

  phone: z
    .string({
      coerce: true,
    })
    // (27) 99988-7766
    .min(9, "O número de telefone deve conter no mínimo 9 números")
    // (27) 9988-7766 => 2799887766
    .max(15, "O número de telefone deve conter no máximo 11 números")
    .transform((input) =>
      input.replace(/\W/g, ""),
      // new RegExp('/[5]{2}/g').test(input) ? input : `55${input}`
    )
    // @todo validate input
    .transform((val) =>
      val.length == 10 || val.length == 11 ? `55${val}` : val,
    )
    .describe("Telefone"),

  verifiedAt: z.coerce
    .string()
    .datetime()
    .describe("Data de quando foi verificado o perfil")
    .optional(),

  createAt: z.coerce
    .string()
    .datetime()
    .describe("Data de quando foi criado")
    .optional(),

  updateAt: z.coerce
    .string()
    .datetime()
    .describe("Data de quando foi atualizado")
    .optional(),
});

export type UserType = z.infer<typeof UserSchema>;

@ApiExtraModels()
export class UserDto extends createZodDto(UserSchema) {}

export type UserDb = User;
