import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { Account } from '../accounts';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'userName',
        });
    }

    async validate(userName: string, password: string): Promise<Account> {
        return this.authService.getAuthenticatedAccount(userName, password);
    }
}
