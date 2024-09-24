import 'reflect-metadata';
import { $log } from '@tsed/logger';
import { PlatformExpress } from '@tsed/platform-express';
import '@tsed/ajv';
import { Server } from './Server';

async function bootstrap() {
  try {
    $log.debug('Start server...');
    const platform = await PlatformExpress.bootstrap(Server, {});

    await platform.listen();

    $log.debug('Server initialized');
  } catch (er) {
    $log.error(er);
  }
}

void bootstrap();
