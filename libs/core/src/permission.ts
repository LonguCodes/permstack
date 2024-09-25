import { ScopeAssignment } from './permission-scope';

export class Permission {
  constructor(
    public readonly scopes: ScopeAssignment[],
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
      '^' + this.action.replace(/\*\*/g, '.+').replace(/\*/g, '[^/]+') + '$',
    );
  }
}
