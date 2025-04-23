import { Service } from 'typedi';

import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { IContext } from '../interfaces/IContext';

@Service()
export class LogAccessMiddleware implements MiddlewareInterface<IContext> {
  constructor() {}

  async use({ context, info }: ResolverData<IContext>, next: NextFn) {
   // console.log(
     // `Logging access: ${context?.user?.authorization?.id} - ${context?.user?.sub} -> ${info.parentType.name}.${info.fieldName}`,
    //);
    return next();
  }
}
