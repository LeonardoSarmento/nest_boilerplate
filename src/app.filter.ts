import { HttpStatus } from "@nestjs/common";
import { ZodError } from "zod";
import { AppException } from "./app.exception";
import { Prisma } from "@prisma/client";

export class AppFilter {
  public helpMessage: string[];

  // @todo make Enum extends StatusCode;
  public statusCode: HttpStatus;

  constructor(error: any) {
    console.warn("error: ", error.constructor);

    // Prisma Filter
    error.constructor =
      error instanceof Prisma.PrismaClientKnownRequestError
        ? Prisma.PrismaClientKnownRequestError
        : error.constructor;

    this.discoverExceptionType(error);
  }

  discoverExceptionType(exception: any) {
    switch (exception.constructor) {
      case AppException:
        this.handleAppException(exception);
        break;

      case ZodError:
        this.handleZodError(exception);
        break;

      case Prisma.PrismaClientKnownRequestError:
        this.handlePrisma(exception);
        break;

      case Prisma.PrismaClientUnknownRequestError:
        this.handlePrismaSchema(exception);
        break;

      default:
        this.handleGenericException(exception);
        console.debug("handleGenericException");
        break;
    }

    return this.statusCode, this.helpMessage;
  }

  public handleAppException(error: AppException) {
    this.statusCode = error.statusCode ?? 500;
    this.helpMessage = error.errors;
  }

  public handleZodError(error: ZodError) {
    this.statusCode = 400;
    console.warn(error.toString());

    // const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
    //   if (issue.code === z.ZodIssueCode.invalid_type) {
    // 	if (issue.expected === "string") {
    // 	  return { message: "bad type!" };
    // 	}
    //   }
    //   if (issue.code === z.ZodIssueCode.custom) {
    // 	return { message: `less-than-${(issue.params || {}).minimum}` };
    //   }
    //   return { message: ctx.defaultError };
    // };

    // z.setErrorMap(customErrorMap);

    // @todo Interpolação "manual".
    this.helpMessage = error.errors.map((e) => {
      return e.message.replace("{#describe}", "");
    });
  }

  public handlePrisma(ex: Prisma.PrismaClientKnownRequestError) {
    console.error("Prisma code: ", ex.code);
    console.error(ex.message);
    switch (ex.code) {
      case "P2002":
        this.helpMessage = ["Valor único já em uso"];
        this.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
        break;

      case "P2003":
        this.helpMessage = [
          "Não foi possível deletar registro devido a relacionamento de dados",
        ];
        this.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
        break;

      case "P2025":
        this.helpMessage = ["Não foi possível encontrar entidade"];
        this.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
        break;

      default:
        this.helpMessage = ["Erro relacionado a estrutura do Banco de dados"];
        this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
    }
  }

  public handlePrismaSchema(ex: Prisma.PrismaClientUnknownRequestError) {
    this.helpMessage = [
      "Erro relacionado a estrutura do Banco de dados",
      ex.name,
    ];
    this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  }

  public handleGenericException(ex: Error) {
    console.error(ex.stack);
    this.statusCode = 500;
    this.helpMessage = [ex.message, "Error interno do servidor"];
  }
}
