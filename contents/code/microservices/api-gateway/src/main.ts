import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();

  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('Quản lý hóa đơn điện tử')
    .setDescription('Vũ Văn Nghĩa 20206205')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableShutdownHooks();

  const port = process.env.PORT || 3000;
  await app.listen(port, async () => {
    logger.log(`Server is running on: ${await app.getUrl()}`);
  });
}
bootstrap();
