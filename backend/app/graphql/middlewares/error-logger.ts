import { Service } from 'typedi';

import { ArgumentValidationError, MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { IContext } from '../interfaces/IContext';

@Service()
export class ErrorLoggerMiddleware implements MiddlewareInterface<IContext> {
  constructor() {}

  async use({ context, info }: ResolverData<IContext>, next: NextFn) {
    try {
      return await next();
    } catch (err: any) {
      console.log({
        message: err.message,
        operation: info.operation.operation,
        fieldName: info.fieldName,
        userName: context.user,
      });
      if (!(err instanceof ArgumentValidationError)) {
        // hide errors from db like printing sql query
        throw new Error('Unknown error occurred. Try again later!');
      }
      throw err;
    }
  }
}
