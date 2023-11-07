import { Request } from 'express';
import { Account } from '../accounts';

export interface RequestWithUser extends Request {
    user: Account;
}
