import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCookieAuth, ApiNoContentResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AppFilter } from 'src/app.filter';
import { LoginUserDto, LoginUserType, PassResetDTO, UpdatePassDTO } from 'src/user/dto/login-user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly _service: AuthService
	) { }

	@Post('/login')
	@ApiBody({ type: LoginUserDto })
	async login(
		@Body() userCredentials: LoginUserType,
		@Res() res: Response
	) {
		try {
			const jwt = await this._service.authUser(
				userCredentials.email, userCredentials.password
			);

			res['user'] = jwt;

			return res.status(200)
				.cookie('jwt', jwt)
				.send(jwt);
		} catch (error) {
			const errorFilter = new AppFilter(error);
			res.status(errorFilter.statusCode)
				.send(errorFilter.helpMessage);
		}
	}

	@Post('/logout')
	async logout(
		@Res() res: Response
	) {
		try {
			return res.status(204)
				.cookie('jwt', null)
				.send(['Logout realizado com sucesso']);
		} catch (error) {
			const errorFilter = new AppFilter(error);
			res.status(errorFilter.statusCode)
				.send(errorFilter.helpMessage);
		}
	}

	@Post('/recover')
	@ApiBody({ type: PassResetDTO, description: 'Email is only required' })
	@ApiNoContentResponse({ description: "Successfully send email" })
	async requestPasswordUpdate(
		@Body() userEmail: Omit<LoginUserType, "password">,
		@Res() res: Response
	) {
		try {
			await this._service.requestPassRecoverUpdate(userEmail.email);

			return res.status(204)
				.send();
		} catch (error) {
			const errorFilter = new AppFilter(error);
			return res.status(errorFilter.statusCode)
				.send(errorFilter.helpMessage);
		}
	}

	@Get('/recover/:uuid')
	async recoverTokenIsValid(
		@Param('uuid') recoverToken: string,
		@Res() res: Response
	): Promise<Response> {
		try {
			const recoverRequest = await this._service.recoverTokenIsValid(recoverToken);

			// @todo return expiredAt
			return res.status(200)
				.send(recoverRequest);
		} catch (error) {
			const { statusCode, helpMessage } = new AppFilter(error);
			return res.status(statusCode)
				.send(helpMessage);
		}
	}

	@Get('/profile')
	@UseGuards(AuthGuard)
	@ApiCookieAuth()
	async getProfile(
		@Req() req: Request,
		@Res() res: Response
	): Promise<Response> {
		try {
			// @todo if not logged return 500
			return res.status(200)
				.send(req.user);
		} catch (error) {
			const { statusCode, helpMessage } = new AppFilter(error);
			return res.status(statusCode)
				.send(helpMessage);
		}
	}

	@Patch('/recover/:uuid/refresh')
	async refreshRecoverToken(
		@Param('uuid') recoverToken: string,
		@Res() res: Response
	): Promise<Response> {
		try {
			await this._service.refreshRecoverToken(recoverToken);

			return res.status(204)
				.send();
		} catch (error) {
			const { statusCode, helpMessage } = new AppFilter(error);
			return res.status(statusCode)
				.send(helpMessage);
		}
	}

	@Patch('/recover/:uuid/reset')
	@ApiBody({ type: UpdatePassDTO, description: 'Password is only required' })
	async recoverPassword(
		@Param('uuid') recoverToken: string,
		@Body() userNewPassword: Omit<LoginUserType, "email">,
		@Res() res: Response,
	): Promise<Response> {
		try {
			await this._service.changePasswordFromLink(recoverToken, userNewPassword.password);

			return res.status(204)
				.send();
		} catch (error) {
			const { statusCode, helpMessage } = new AppFilter(error);
			return res.status(statusCode)
				.send(helpMessage);
		}
	}
}
