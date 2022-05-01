import { SetMetadata } from '@nestjs/common';
export const restrictMetaKey = Symbol('restricted');

export const enum Strategy {
  JWT,
}

export const Restrict = (strategy: Strategy) =>
  SetMetadata(restrictMetaKey, strategy);
