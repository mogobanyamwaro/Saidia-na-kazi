import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidatorParams } from '../interfaces';
import { QueryService } from '../services';

@Injectable()
@ValidatorConstraint({ async: true })
export class Exists implements ValidatorConstraintInterface {
  async validate(colmunValue: any, args: ValidationArguments) {
    const params: ValidatorParams = args.constraints[0];

    try {
      const condition = QueryService.getEqualQuery(colmunValue, params);
      const query = QueryService.getQuery(condition, params);
      const resultQuery = await QueryService.getDataQuery(query);

      if (params.isArray)
        return QueryService.isDataEqualArray(resultQuery, colmunValue);

      return QueryService.isHasData(resultQuery);
    } catch (error) {
      console.log(error);
    }
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    const params = args.constraints[0];

    if (!params.message) return `the ${args.property} doesn't exist `;
    else return params.message;
  }
}
