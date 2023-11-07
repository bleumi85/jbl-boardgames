import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountsModule } from '../accounts/accounts.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';

@Module({
    imports: [AccountsModule, PassportModule, ConfigModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtRefreshTokenStrategy],
    exports: [AuthService],
})
export class AuthModule {}
