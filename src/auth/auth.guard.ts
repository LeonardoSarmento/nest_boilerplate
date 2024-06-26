import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AppException } from 'src/app.exception';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(
		private _jwtService: JwtService
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			const request = context.switchToHttp().getRequest();

			const token = this.extractTokenFromCookie(request);
			const payload = await this._jwtService.verifyAsync(
				token,
				{
					secret: process.env.JWT_SECRET
				}
			);

			request['user'] = payload;
		} catch {
			throw new AppException(401, ["Falha ao obter validar token"]);
		}
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}

	private extractTokenFromCookie(request: Request): string {
		const token = request.cookies['jwt'] ?? null;
		if (token == null) {
			throw new AppException(401, ["Falha ao obter token"]);
		};

		return token;
	}
}
