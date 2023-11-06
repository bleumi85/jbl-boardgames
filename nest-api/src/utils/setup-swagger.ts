import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import swaggerStats from 'swagger-stats';

export const setupSwagger = (app: INestApplication, useSwaggerStats = false) => {
    const documentBuilder = new DocumentBuilder()
        .setTitle('Boardgames NestJS API')
        .setVersion('1.0')
        .setContact('Jens Bleumer', 'api.diebleumers.de', 'jens.bleumer@gmail.com')
        .addBearerAuth();

    if (useSwaggerStats) {
        documentBuilder.setExternalDoc('Swagger stats', '/swagger-stats');
    }

    const options = documentBuilder.build();

    const document = SwaggerModule.createDocument(app, options);

    if (useSwaggerStats) {
        Logger.debug('/swagger-stats', 'Swagger');
        app.use(swaggerStats.getMiddleware({ swaggerSpec: document }));
    }

    SwaggerModule.setup('docs', app, document);
};
