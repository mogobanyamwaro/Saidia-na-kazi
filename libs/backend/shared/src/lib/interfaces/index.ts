export class DbConnectOptions {
  /**
   * Database Type
   */
  type: any;
  /**
   * server name or Ip address
   */

  host: string;

  /**
   * server port number
   */

  port: number;

  /**
   * database name
   */
  database: string;

  /**
   * username
   */

  username: string;

  /**
   * user password or a function that returns a password
   */

  password: string;
}

export class ValidatorParams {
  /**
   * Table name
   */

  table: string;

  /**
   * column name
   */
  column: string;

  /**
   * isArray: is column consider as Array
   */

  isArray?: boolean;
}

export interface DefaultPagination {
  defaultSkip?: number;
  defaultPage?: number;
  defaultLimit?: number;
  defaultOrder?: any;
  defaultOrderDirection?: string;
  maxAllowedSize?: number;
}

export interface PaginationRequest {
  skip?: number;

  page?: number;

  limit?: number;

  order?: { [field: string]: 'ASC' | 'DESC' };

  params?: any;
}
export interface ApiQueryRequest {
  params?: any;
}
