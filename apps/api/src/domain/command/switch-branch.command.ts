import { HandleCommand, ICommandHandler } from '@permstack/cqrs';
import { Intercept } from '@tsed/di';
import { MaybeInterceptor } from '../../api/interceptor/maybe.interceptor';

export class SwitchBranchCommand {}

@HandleCommand(SwitchBranchCommand)
export class SwitchBranchCommandHandler
  implements ICommandHandler<SwitchBranchCommand>
{
  execute(command: SwitchBranchCommand): Promise<unknown> {
    return Promise.resolve(undefined);
  }
}
