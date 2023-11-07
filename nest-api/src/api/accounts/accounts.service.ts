import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account, RefreshToken } from '.';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private accountsRepository: EntityRepository<Account>,
        @InjectRepository(RefreshToken)
        private rtRepository: EntityRepository<RefreshToken>,
    ) {}

    create(createAccountDto: CreateAccountDto) {
        return 'This action adds a new account';
    }

    findAll() {
        return `This action returns all accounts`;
    }

    async findOne(id: string) {
        const account = await this.accountsRepository.findOne({ id });
        if (account && account.isVerified) {
            return account;
        }
        throw new HttpException('Account with this id does not exist', HttpStatus.NOT_FOUND);
    }

    async findOneByUsername(userName: string) {
        const account = await this.accountsRepository.findOne({ userName });
        if (account && account.isVerified) {
            return account;
        }
        throw new HttpException('User with this userName does not exist', HttpStatus.NOT_FOUND);
    }

    async findOneRefreshTokenByToken(token: string) {
        const refreshToken = await this.rtRepository.findOne({ token });
        if (!refreshToken || !refreshToken.isActive) {
            throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
        }
        return refreshToken;
    }

    async getAccountIfRefreshTokenMatches(token: string) {
        const refreshToken = await this.findOneRefreshTokenByToken(token);
        return await this.findOne(refreshToken.account.id);
    }

    update(id: number, updateAccountDto: UpdateAccountDto) {
        return `This action updates a #${id} account`;
    }

    remove(id: number) {
        return `This action removes a #${id} account`;
    }
}
