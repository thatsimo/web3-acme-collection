import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = new DocumentBuilder()
    .setTitle('Acme NFT API')
    .setDescription('Basic API to interact with the Acme NFT contracts.')
    .setVersion('1.0')
    .addTag('acme-nft-contracts')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document, {
    yamlDocumentUrl: '/openapi.yaml',
    jsonDocumentUrl: '/openapi.json',
    explorer: true,
  });
  await app.listen(8080);
}

bootstrap();
