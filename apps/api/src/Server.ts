import 'reflect-metadata';
import { Configuration, Inject, Intercept } from '@tsed/di';
import { BranchEventController } from './api/http/branch-event.controller';
import { Bus } from '@permstack/cqrs';
import { SwitchBranchCommandHandler } from './domain/command/switch-branch.command';
import '@tsed/ajv';
import { BeforeRoutesInit, PlatformApplication } from '@tsed/common';
import bodyParser from 'body-parser';
import { MaybeInterceptor } from './api/interceptor/maybe.interceptor';

@Configuration({
  jsonMapper: {
    additionalProperties: false,
    disableUnsecureConstructor: false,
    strictGroups: false,
  },
  logger: {
    logRequest: false,
  },
  mount: {
    '/api': [BranchEventController],
  },
  imports: [Bus, SwitchBranchCommandHandler, MaybeInterceptor],
})
export class Server implements BeforeRoutesInit {
  @Inject()
  app: PlatformApplication;

  $beforeRoutesInit(): void | Promise<any> {
    this.app.use(bodyParser.json()).use(
      bodyParser.urlencoded({
        extended: true,
      })
    );

    return null;
  }
}
