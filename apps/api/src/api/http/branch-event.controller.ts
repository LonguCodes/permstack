import { Controller, Inject, Intercept } from '@tsed/di';
import { Post } from '@tsed/schema';
import { Bus, IBus } from '@permstack/cqrs';
import { BodyParams } from '@tsed/common';
import { BranchModel } from '../model/branch.model';
import { MaybeInterceptor } from '../interceptor/maybe.interceptor';
import { ResultAsync } from 'typescript-functional-extensions';
import { SwitchBranchCommand } from '../../domain/command/switch-branch.command';

@Controller('/branch-event')
export class BranchEventController {
  @Inject(Bus)
  private readonly bus: IBus;

  @Post('/checkout')
  @Intercept(MaybeInterceptor)
  async registerCheckout(@BodyParams(BranchModel) model: BranchModel) {
    return ResultAsync.success(new SwitchBranchCommand()).map((command) =>
      this.bus.executeCommand(command),
    );
  }
}
