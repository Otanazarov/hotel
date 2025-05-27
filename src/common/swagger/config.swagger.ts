import { DocumentBuilder } from '@nestjs/swagger';

export const ApiSwaggerOptions = new DocumentBuilder()
  .setTitle('HOTEL API')
  .setDescription('API documentation for HOTEL')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'token',
  )
  .build();
