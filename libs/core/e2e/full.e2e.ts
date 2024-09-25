import { PermissionManager } from '../src';

describe('Full e2e test', () => {
  describe('No scopes', () => {
    it.each([
      [true, 'A', 'A'],
      [false, 'A', 'B'],
      [true, 'A/create', 'A/create'],
      [false, 'A/create', 'B/create'],
      [true, 'A/*', 'A/create'],
      [false, 'A/*', 'B/create'],
      [false, 'A/*', 'A'],
      [false, 'A/**', 'A'],
      [true, 'A/**', 'A/create'],
      [true, 'A/**', 'A/create/special'],
      [true, 'A/*/special', 'A/create/special'],
      [true, 'A/**/special', 'A/create/special'],
      [false, 'A/*/black', 'A/create/special/black'],
      [true, 'A/**/black', 'A/create/special/black'],
    ])(
      'Should be %s if actor with %s checked with %s',
      (result, actorPermissions, permissionCheck) => {
        // Arrange
        const manager = new PermissionManager();
        const actor = manager.parseActor([actorPermissions]);

        // Act
        const allowed = actor.can(permissionCheck);

        // Assert
        expect(allowed).toBe(result);
      },
    );
  });

  describe('Scopes', () => {
    it.each([
      [true, '*;A', 'A'],
      [false, 'x;A', 'A'],
      [true, 'x;A', 'A', ['x']],
      [true, 'A', 'A', ['x']],
      [false, 'y/<1>;A', 'A'],
      [false, 'y/<1>;A', 'A', ['y']],
      [false, 'y/<1>;A', 'A', ['y/<2>']],
      [true, 'y/<1>;A', 'A', ['y/<1>']],
      [true, 'y/<1>,x;A', 'A', ['y/<1>', 'x']],
    ])(
      'Should be %s if actor with %s checked with %s',
      (result, actorPermissions, permissionCheck, scopes = undefined) => {
        // Arrange
        const manager = new PermissionManager(['x', 'y/:id']);
        const actor = manager.parseActor([actorPermissions]);

        // Act
        const allowed = actor.can(permissionCheck, scopes);

        // Assert
        expect(allowed).toBe(result);
      },
    );
  });
});
