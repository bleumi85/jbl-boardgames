import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Account, RefreshToken } from '.';

@Module({
    imports: [MikroOrmModule.forFeature([Account, RefreshToken])],
    controllers: [AccountsController],
    providers: [AccountsService],
    exports: [AccountsService],
})
export class AccountsModule {}
