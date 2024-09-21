import { Permission } from './permission';

export class Actor {
  permissions: Permission[];

  can(action: string, scopes: string[] = ['*']): boolean {
    return this.permissions.some((permission) =>
      permission.match(action, scopes),
    );
  }
}
