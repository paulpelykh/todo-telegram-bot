import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import * as LocalSession from 'telegraf-session-local';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

const sessions = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: process.env.TELEGRAM_TOKEN,
    }),
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
