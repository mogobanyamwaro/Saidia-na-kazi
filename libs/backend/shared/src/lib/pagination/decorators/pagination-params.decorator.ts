import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DefaultPagination } from '../../interfaces';

export const ApiQueryParams = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    let {
      query: { ...params },
    } = ctx.switchToHttp().getRequest();

    return Object.assign(data ? data : {}, { params });
  }
);

export const PaginationParams = createParamDecorator(
  (
    data: DefaultPagination = {
      defaultSkip: 0,
      defaultPage: 0,
      defaultLimit: 10,
      defaultOrder: {},
      defaultOrderDirection: 'ASC',
      maxAllowedSize: 20,
    },
    context: ExecutionContext
  ) => {
    let {
      query: { skip, page, limit, orderBy, orderDirection, ...params },
    } = context.switchToHttp().getRequest();

    const {
      defaultSkip,
      defaultPage,
      defaultLimit,
      defaultOrder,
      defaultOrderDirection,
      maxAllowedSize,
    } = data;

    const order = orderBy
      ? { [orderBy]: orderDirection ? orderDirection : defaultOrderDirection }
      : defaultOrder;
    limit = limit && limit > 0 ? +limit : defaultLimit;

    if (!skip) {
      if (page) {
        skip = (+page - 1) * +limit;
        skip = skip >= 0 ? skip : 0;
      } else {
        page = defaultPage;
        skip = defaultSkip;
      }
    } else {
      page = Math.floor(+skip / limit);
    }

    limit = +limit < +maxAllowedSize ? +limit : +maxAllowedSize;

    return Object.assign(data ? data : {}, {
      skip,
      page,
      limit,
      order,
      params,
    });
  }
);
