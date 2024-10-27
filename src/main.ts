import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
// Swagger configuration
const config = new DocumentBuilder()
.setTitle('User API')
.setDescription('API for managing users')
.setVersion('1.0')
.addTag('users')
.build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document); // Swagger UI will be at /api
// Enable CORS for all origins
  app.enableCors({
    origin: 'http://localhost:3001', // Replace with the URL of your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
