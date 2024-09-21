import 'reflect-metadata';
import { ICommandHandler, IQueryHandler, Type } from './types';
import { v4 } from 'uuid';
import { Inject, Injectable, InjectorService, Service } from '@tsed/di';
import { OnReady } from '@tsed/common';
import { isClass } from '@tsed/core';

export interface IBus {
  executeCommand<T extends object>(command: T): Promise<unknown>;
  executeQuery<T extends object>(query: T): Promise<unknown>;
}

const queryKey = Symbol('bus:query');
const queryHandlerKey = Symbol('bus:query-handler');

const commandKey = Symbol('bus:command');
const commandHandlerKey = Symbol('bus:command-handler');

export function HandleQuery<T extends Type>(query: T) {
  return (target: Type<IQueryHandler<T>>) => {
    let id = Reflect.getMetadata(queryKey, query);

    if (!id) {
      id = v4();
      Reflect.defineMetadata(queryKey, id, query);
    }

    Reflect.defineMetadata(queryHandlerKey, id, target);
    Injectable()(target);
  };
}

export function HandleCommand<T extends object>(command: T) {
  return (target: Type<IQueryHandler<T>>) => {
    let id = Reflect.getMetadata(commandKey, command);

    if (!id) {
      id = v4();
      Reflect.defineMetadata(commandKey, id, command);
    }

    Reflect.defineMetadata(commandHandlerKey, id, target);
    Injectable()(target);
  };
}

@Injectable()
export class Bus implements IBus, OnReady {
  @Inject()
  private injector: InjectorService;

  private commandHandlers = new Map<string, ICommandHandler<object>>();
  private queryHandlers = new Map<string, IQueryHandler<object>>();
  async $onReady(): Promise<any> {
    this.injector
      .toArray()
      .filter(
        (provider) =>
          isClass(provider) &&
          Reflect.hasMetadata(
            commandHandlerKey,
            Object.getPrototypeOf(provider).constructor,
          ),
      )
      .forEach((provider) =>
        this.commandHandlers.set(
          Reflect.getMetadata(
            commandHandlerKey,
            Object.getPrototypeOf(provider).constructor,
          ),
          provider,
        ),
      );

    this.injector
      .toArray()
      .filter(
        (provider) =>
          isClass(provider) &&
          Reflect.hasMetadata(
            queryHandlerKey,
            Object.getPrototypeOf(provider).constructor,
          ),
      )
      .forEach((provider) =>
        this.queryHandlers.set(
          Reflect.getMetadata(
            queryHandlerKey,
            Object.getPrototypeOf(provider).constructor,
          ),
          provider,
        ),
      );
  }

  executeCommand<T extends object>(command: T): Promise<unknown> {
    const commandId = Reflect.getMetadata(
      commandKey,
      Object.getPrototypeOf(command).constructor,
    );
    if (!commandId)
      throw new Error(
        `Command ${Object.getPrototypeOf(command).constructor.name} does not have a handler registered`,
      );

    const handler = this.commandHandlers.get(commandId);

    if (!handler)
      throw new Error(
        `Command ${Object.getPrototypeOf(command).constructor.name} does not have a handler imported`,
      );

    return handler.execute(command);
  }

  executeQuery<T>(query: T): Promise<unknown> {
    return Promise.resolve(undefined);
  }
}
