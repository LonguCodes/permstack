import {
  Interceptor,
  InterceptorContext,
  InterceptorMethods,
  InterceptorNext,
} from '@tsed/di';
import { $log } from '@tsed/logger';
import { Result, ResultAsync } from 'typescript-functional-extensions';

@Interceptor()
export class MaybeInterceptor implements InterceptorMethods {
  async intercept(context: InterceptorContext<any>, next: InterceptorNext) {
    let result = await next();
    $log.debug(result);
    if (result instanceof ResultAsync) {
      result = await result.toPromise();
    }
    if (result instanceof Result) {
      if (result.isSuccess) return result.getValueOrThrow();
      throw result.getErrorOrThrow();
    }

    return result;
  }
}
