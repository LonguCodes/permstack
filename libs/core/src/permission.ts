import { PermissionScope, ScopeAssignment } from './permission-scope';
import { Actor } from './actor';

export class Permission {
  constructor(
    public readonly scopes: ReadonlyArray<ScopeAssignment>,
    public readonly action: string,
  ) {}

  match(action: string, scopes: string[] = ['*']) {
    return (
      this.actionRegex.test(action) &&
      (this.scopes.length === 0 ||
        scopes.every((scope) =>
          this.scopes.find((assignment) => assignment.match(scope)),
        ))
    );
  }

  private get actionRegex() {
    return new RegExp(
      '^' + this.action.replace(/\*/g, '[^/]+').replace(/\*\*/g, '.+') + '$',
    );
  }
}

export class PermissionManager {
  constructor(public readonly scopes: ReadonlyArray<PermissionScope> = []) {}

  public parsePermission(permString: string) {
    const [scopesString, action] = permString.split(';');
    if (scopesString === '*') return new Permission([], action);
    const scopeStrings = scopesString.split(',');

    const scopes = scopeStrings.map((scopeString) =>
      this.scopes.find((scope) => scope.match(scopeString)).parse(scopeString),
    );

    return new Permission(scopes, action);
  }

  public parseActor(perms: string[]) {
    const actor = new Actor();

    actor.permissions = perms.map((perm) => this.parsePermission(perm));

    return actor;
  }
}
