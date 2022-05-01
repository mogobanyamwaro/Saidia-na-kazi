import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { QueryService } from '../services';

/*
 * isUnique is custom  validator is to check if any X colmun of X table is Already exist
 */

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUnique implements ValidatorConstraintInterface {
  async validate(columnvalue: any, args: ValidationArguments) {
    const params = args.constraints[0];

    try {
      const condition = QueryService.getEqualQuery(columnvalue, params);
      const query = QueryService.getQuery(condition, params);
      const resultQuery = await QueryService.getDataQuery(query);

      return !QueryService.isHasData(resultQuery);
    } catch (error) {
      console.log(error);
    }
  }

  defaultMessage(args: ValidationArguments): string {
    // here you can provide default error message if validation failed
    const params = args.constraints[0];
    if (!params.message) return ` the ${args.property} already exist`;
    else return params.message;
  }
}
