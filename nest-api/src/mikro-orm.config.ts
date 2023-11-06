import { Options, defineConfig } from '@mikro-orm/postgresql';
import { NodeEnv } from './utils/enums';

const options: Options = {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    dbName: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    migrations: {
        disableForeignKeys: false,
        snapshot: false,
        fileName: (timestamp: string, name?: string) => {
            if (!name) throw new Error('Specify migration name via `mikro-orm migration:create --name=...`');

            return `Migration_${timestamp}_${name}`;
        },
    },
    seeder: {
        path: 'dist/seeders',
        pathTs: 'src/seeders',
        defaultSeeder: 'UserSeeder',
    },
    debug: process.env.NODE_ENV === NodeEnv.Dev,
    discovery: {
        warnWhenNoEntities: false,
    },
};

export default defineConfig(options);
