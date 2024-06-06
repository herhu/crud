import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SecretNoteModule } from './secret-note/secret-note.module';
import { SecretNote } from './secret-note/secret-note.entity';
import { EccService } from './ecc/ecc.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [SecretNote],
      synchronize: true,
    }),
    SecretNoteModule,
  ],
  providers: [EccService],
})
export class AppModule {}
