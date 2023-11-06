import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NodeEnv } from './utils/enums';
import cookieParser from 'cookie-parser';
import { setupSwagger } from './utils';

const whiteList = ['https://graftipp.online', 'https://www.graftipp.online'];
const regexList = [/localhost:\d+$/];
const corsLogger = new Logger('CORS');

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: process.env.NODE_ENV === NodeEnv.Prod ? ['debug', 'fatal', 'error', 'warn'] : ['debug', 'error', 'fatal', 'log', 'verbose', 'warn'],
    });

    app.enableCors({
        credentials: true,
        origin: (origin, callback) => {
            if (origin === undefined) {
                corsLogger.debug('No origin');
                callback(null, true);
            } else if (whiteList.indexOf(origin) !== -1) {
                corsLogger.debug(`WhiteList: ${origin}`);
                callback(null, true);
            } else if (regexList.some((regex) => regex.test(origin))) {
                corsLogger.debug(`RegexList: ${origin}`);
                callback(null, true);
            } else {
                corsLogger.error('Not allowed');
                callback(new Error(`Origin ${origin} not allowed by CORS`));
            }
        },
        exposedHeaders: ['Content-Disposition'],
    });

    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());

    const configService = app.get(ConfigService);

    const appNodeEnv = configService.get<string>('app.nodeEnv');
    const isDevelopment = appNodeEnv === NodeEnv.Dev;
    const appShowSwagger = configService.get<boolean>('app.showSwagger');

    if (isDevelopment || appShowSwagger) {
        Logger.debug('/docs', 'Swagger');
        setupSwagger(app, isDevelopment);
    }

    const appPort = configService.get<number>('app.port');

    await app.listen(appPort, () => {
        switch (appNodeEnv) {
            case NodeEnv.Prod:
                Logger.debug(`Application (PROD) running on port ${appPort}`, 'NestApplication');
                break;
            case NodeEnv.Dev:
                Logger.debug(`Application (DEV) running on http://localhost:${appPort}`, 'NestApplication');
                break;
            default:
                Logger.error('Environment not found', 'NestApplication');
        }
    });
}
bootstrap();
