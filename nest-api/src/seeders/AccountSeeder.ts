import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Account } from '../api/accounts';
import { Role } from '../utils/enums';
import bcrypt from 'bcrypt';

export class AccountSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const countAdmin = await em.count(Account, { role: Role.Admin });

        if (countAdmin < 1) {
            em.create(Account, {
                firstName: 'Admin',
                lastName: 'Api',
                userName: 'admin',
                email: 'admin@diebleumers.info',
                role: Role.Admin,
                passwordHash: await bcrypt.hash('Abcd!2345', 10),
                verified: new Date(),
                acceptTerms: true,
            });
        }
    }
}
