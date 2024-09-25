import { PermissionScope } from './permission-scope';
import { Actor } from './actor';
import { Permission } from './permission';
import { ContextPath } from './context-path';
import { a } from 'vitest/dist/chunks/suite.CcK46U-P';

export class PermissionManager {
  private readonly scopeMap: Map<string, PermissionScope> = new Map<
    string,
    PermissionScope
  >();

  constructor(public readonly scopes: ReadonlyArray<string> = []) {
    for (const scope of scopes) {
      const permissionScope = new PermissionScope(scope);
      this.scopeMap.set(permissionScope.simple, permissionScope);
    }
  }

  public parsePermission(permString: string) {
    const [scopesString, action] = permString.split(';');

    if (!action) return new Permission([], scopesString);
    if (scopesString === '*') return new Permission([], action);
    const scopeStrings = scopesString.split(',');

    const scopes = scopeStrings.map((scopeString) =>
      this.scopeMap.get(ContextPath.simple(scopeString))?.parse(scopeString),
    );

    return new Permission(scopes, action);
  }

  public parseActor(perms: string[]) {
    const permissions = perms.map((perm) => this.parsePermission(perm));

    const permissionMap = new Map<string, Permission>();

    for (const permission of permissions) {
      if (permissionMap.has(permission.action))
        permissionMap.get(permission.action).scopes.push(...permission.scopes);
      else permissionMap.set(permission.action, permission);
    }

    const actor = new Actor();

    actor.permissions = [...permissions.values()];

    return actor;
  }
}
