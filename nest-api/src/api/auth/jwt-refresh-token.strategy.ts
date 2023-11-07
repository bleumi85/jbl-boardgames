import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccountsService } from '../accounts/accounts.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(
        private readonly configService: ConfigService,
        private readonly accountsService: AccountsService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.JblBoardgamesRefresh;
                },
            ]),
            secretOrKey: configService.get<string>('jwt.secret'),
            passReqToCallback: false,
        });
    }

    async validate(payload: JwtPayload) {
        return this.accountsService.getAccountIfRefreshTokenMatches(payload.token);
    }
}
