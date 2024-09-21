export type Type<T = object> = new (...args: unknown[]) => T;
export type Instance<T extends Type> = T extends new (
  ...args: unknown[]
) => infer U
  ? U
  : never;

export interface ICommandHandler<TCommand extends object> {
  execute(command: TCommand): Promise<unknown>;
}

export interface IQueryHandler<TQuery extends object> {
  execute(command: TQuery): Promise<unknown>;
}
