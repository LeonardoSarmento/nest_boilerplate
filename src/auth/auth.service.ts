import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as Bcrypt from 'bcrypt';
import { v4 as uuid4 } from 'uuid';
import * as nodeMailer from 'nodemailer';
import { Request } from 'express';
import { AppException } from 'src/app.exception';
import { LoginUserType } from 'src/user/dto/login-user.dto';
import { UserDb, UserSchema, UserType } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

	private readonly _validator = UserSchema;
	private _emailService: any;

	constructor(
		private readonly _jwtService: JwtService,
		private readonly _userService: UserService,
	) {
		this._emailService = nodeMailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.NODEMAIL_USER2,
				pass: process.env.NODEMAIL_APP_PASSWORD2
			}
		});
	}

	public async authUser(email: string, password: string): Promise<string> {
		try {
			const validatedEmail = await this._validator.shape
				.email.parseAsync(email);

			const targetUser = await this._userService.findByEmail(validatedEmail);

			if (! await Bcrypt.compare(password, targetUser.password)) {
				throw new AppException(401, ["Senha invalida"]);
			}

			return await this.generateJwt(targetUser);
		} catch (error) {
			throw error;
		}
	}

	public async requestPassRecoverUpdate(userEmail: UserType['email']): Promise<boolean> {
		try {
			const emailDTO = await this._validator.shape
				.email.parseAsync(userEmail);

			const targetUser = await this._userService.findByEmail(emailDTO?.valueOf());

			// Register recover code (uuid)
			const recoverCode = this.generateRecoverCode();
			await this._userService.createUserRecoverRequest(`${recoverCode}`, targetUser.id)

			const body = `<!DOCTYPE html>
			<html>
				<head>
				<title>Page Title</title>
				</head>
				<body
					<h2>Olá ${targetUser.firstName}, código de recuperação:</h2>
					<h3>${recoverCode}</h3>
				</body>
			</html>
			`

			const emailSend = await this._emailService.sendMail({
				from: process.env.NODEMAIL_USER2,
				to: targetUser.email,
				subject: 'Recuperação de senha SGME',
				html: body
			});

			console.debug(emailSend);

			return true;
		} catch (error) {
			// console.error(error);
			throw error;
		}
	}

	async refreshRecoverToken(recoverToken: string): Promise<boolean> {
		try {
			// check if is expired
			let recoverRequest: any;
			try {
				recoverRequest = await this._userService.findRecoverToken(recoverToken);

				await this._userService.updateUserRecover(recoverToken);
				// @todo update expiredAt

				return true
			} catch (error) {
				throw new AppException(422, ['Token de recuperação não existe ou esta expirada']);
			}
		} catch (error) {
			throw error;
		}
	}

	async recoverTokenIsValid(recoverToken: string): Promise<any> {
		try {
			// check if is expired
			let recoverRequest: any;
			try {
				recoverRequest = await this._userService.findRecoverToken(recoverToken);
				if (recoverRequest.expiredAt.getTime() <= Date.now()) {
					throw new Error;
				}
				// @todo update expiredAt

				return recoverRequest;
			} catch (error) {
				throw new AppException(422, ['Token de recuperação não existe ou esta expirada']);
			}
		} catch (error) {
			throw error;
		}
	}

	async changePasswordFromLink(recoverToken: string, newPass: UserType['password']): Promise<boolean> {
		try {
			// check if is expired
			let recoverRequest: any;
			try {
				recoverRequest = await this._userService.findRecoverToken(recoverToken);
				if (recoverRequest.expiredAt.getTime() <= Date.now()) {
					throw new Error;
				}
			} catch (error) {
				throw new AppException(422, ['Token de recuperação não existe ou esta expirada'])
			}

			await this._userService.updatePass(recoverRequest.userId, newPass)

			await this._userService.deleteUserRecoverByUser(recoverRequest.userId);
			return true;
		} catch (error) {
			throw error;
		}
	}

	public async generateJwt(user: UserType | UserDb): Promise<any> {
		return await this._jwtService.signAsync({
			userId: user.id,
			roleCode: user.roleCode,
			firstName: user.firstName
		});
	}

	generateRecoverCode(): number {
		return Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
	}

	public extractTokenFromCookie(request: Request): string {
		const token = request.cookies['jwt'] ?? null;
		if (token == null) {
			throw new AppException(401, ["Falha ao obter token"]);
		};

		return token;
	}
}
