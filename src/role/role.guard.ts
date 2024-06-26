import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RoleEnum } from "./role.entity";
import { ROLES_KEY } from "./role.decorator";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly _jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let jwtContent: any;
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    try {
      const request = context.switchToHttp().getRequest();

      const token = this.extractTokenFromCookie(request);
      jwtContent = await this._jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException("Falha ao obter token");
    }

    try {
      if (!requiredRoles.some((role) => jwtContent.roleCode?.includes(role))) {
        throw new Error();
      }
    } catch (error) {
      throw new ForbiddenException(
        `Funcionalidade reservada para ${requiredRoles[0]}`,
      );
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): string {
    const token = request.cookies["jwt"] ?? null;
    if (token == null) {
      throw new UnauthorizedException("Falha ao obter token");
    }

    return token;
  }
}
