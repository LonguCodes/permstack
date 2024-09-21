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

// import { PermissionManager, PermissionScope } from '@permstack/core';
//
// const scopes = [
//   new PermissionScope('company/:companyId'),
//   new PermissionScope('company/:companyId/branch/:branchId'),
//   new PermissionScope('bank/:bankId'),
// ];
//
// const manager = new PermissionManager(scopes);
//
// const actor = manager.parseActor([
//   'company/<123>;order/create',
//   // 'company/<123>;*',
//   // 'company/<*>;order/create',
// ]);
// console.log(actor.can('order/create', ['company/<123>/branch/<123>']));
