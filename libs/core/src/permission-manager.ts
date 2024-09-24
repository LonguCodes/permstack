import { PermissionScope } from './permission-scope';
import { Actor } from './actor';
import { Permission } from './permission';
import { Path } from './path';

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
    if (scopesString === '*') return new Permission([], action);
    const scopeStrings = scopesString.split(',');

    const scopes = scopeStrings.map((scopeString) =>
      this.scopeMap.get(Path.simple(scopeString))?.parse(scopeString),
    );

    return new Permission(scopes, action);
  }

  public parseActor(perms: string[]) {
    const actor = new Actor();

    actor.permissions = perms.map((perm) => this.parsePermission(perm));

    return actor;
  }
}
