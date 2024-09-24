import { objectify } from 'radash';
import { Path } from './path';

export class PermissionScope {
  constructor(public readonly pattern: string) {}

  get parameters(): string[] {
    return this.pattern
      .split('/')
      .filter((patternPart) => patternPart.startsWith(':'))
      .map((patternPart) => patternPart.substring(1));
  }

  get simple(): string {
    return Path.simple(this.pattern);
  }

  fill(parameters: Record<string, string>): ScopeAssignment {
    return new ScopeAssignment(this, parameters);
  }

  match(scopeString: string): boolean {
    return this.regex.test(scopeString);
  }

  parse(scopeString: string): ScopeAssignment {
    const parameterMap = objectify(
      scopeString
        .split('/')
        .filter((part) => part.match(/^<.*>$/))
        .map((part, index) => [part, index] as const),
      ([, index]) => this.parameters[index],
      ([part]) => part.replace(/[<>]/g, ''),
    );

    return new ScopeAssignment(this, parameterMap);
  }

  private get regex() {
    return new RegExp(
      this.pattern
        .split('/')
        .map((patternPart) =>
          patternPart.startsWith(':') ? `([^/]+)` : patternPart,
        )
        .join('/'),
    );
  }
}

export class ScopeAssignment {
  constructor(
    public readonly scope: PermissionScope,
    public readonly parameterValues: Record<string, string>,
  ) {}

  toString(): string {
    return this.scope.pattern
      .split('/')
      .map((patternPart) =>
        patternPart.startsWith(':')
          ? `<${this.parameterValues[patternPart.substring(1)]}>`
          : patternPart,
      )
      .join('/');
  }

  match(scopeString: string): boolean {
    return new RegExp(
      this.toString()
        .replace(/<\*>/g, '[^/]+')
        .replace(/<\*\*>/, '.+'),
    ).test(scopeString);
  }
}
