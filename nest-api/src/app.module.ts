import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config';
import { DatabaseModule } from './database';
import { AccountsModule } from './api/accounts/accounts.module';
import { AuthModule } from './api/auth/auth.module';

@Module({
    imports: [ConfigModule, DatabaseModule, AccountsModule, AuthModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
