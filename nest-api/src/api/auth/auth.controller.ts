import { HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody } from '@nestjs/swagger';
import { CookieOptions, Response } from 'express';
import { AuthService } from './auth.service';
import { ControllerHelper } from '../../helpers';
import { LoginDto } from './dto';
import { RequestWithUser } from './request-with-user.interface';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { JwtPayload } from './jwt-payload.interface';

@ControllerHelper('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: LoginDto })
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: RequestWithUser, @Res() res: Response) {
        const { user: account, ip } = req;
        const jwtToken = this.authService.getJwtToken(account.id);
        const { signedToken } = await this.authService.generateRefreshToken(account, ip);
        account.jwtToken = jwtToken;

        this.setTokenCookie(res, signedToken);

        return res.send(account);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtRefreshGuard)
    @Post('refresh-token')
    async refreshToken(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response) {
        const { user: account, cookies, ip } = req;
        const oldToken = this.getTokenFromCookie(cookies.JblBoardgamesRefresh);
        const { token: newToken, signedToken: newSignedToken } = await this.authService.generateRefreshToken(account, ip);
        await this.authService.revokeOldToken(oldToken, newToken, ip);
        account.jwtToken = this.authService.getJwtToken(account.id);

        this.setTokenCookie(res, newSignedToken);

        return account;
    }

    @Post('revoke-token')
    async revokeToken() {}

    @Post('register')
    async register() {}

    @Post('verify-email')
    async verifyEmail() {}

    @Post('forgot-password')
    async forgotPassword() {}

    @Post('validate-reset-token')
    async validateResetToken() {}

    @Post('reset-password')
    async resetPassword() {}

    // helper functions

    setTokenCookie(res: Response, token: string) {
        const cookieOptions: CookieOptions = {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 1000 * this.configService.get<number>('jwt.refreshExpTime'),
        };
        res.cookie('JblBoardgamesRefresh', token, cookieOptions);
    }

    getTokenFromCookie(signedJwtToken: string) {
        const base64Payload = signedJwtToken.split('.')[1];
        const payloadBuffer = Buffer.from(base64Payload, 'base64');
        const jwtPayload: JwtPayload = JSON.parse(payloadBuffer.toString()) as JwtPayload;
        return jwtPayload.token;
    }
}
