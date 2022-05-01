import { getManager } from 'typeorm';
import { UtilService } from './util.service';

export class QueryService {
  static getEqualQuery(valueColumn: any, params: any) {
    let whereCondition = `1 = 1 and `;
    const isNum = /^\d+$/.test(valueColumn);

    if (
      params.isArray ||
      valueColumn.constructor === Array ||
      Array.isArray(valueColumn) ||
      valueColumn instanceof Array
    )
      whereCondition = ` ${params.column} in (${valueColumn}) `;
    else if (isNum || valueColumn instanceof Number)
      whereCondition = ` ${params.column} = ${valueColumn} `;
    else if (typeof valueColumn === 'string' || valueColumn instanceof String)
      whereCondition = ` ${params.column} like '${valueColumn}' `;

    return whereCondition;
  }

  static getQuery(conditionQuery: string, params: any): string {
    const query = `select ${params.column} from ${params.table} where ${conditionQuery}  `;

    return query;
  }

  static async getDataQuery(query): Promise<any> {
    try {
      return await getManager().query(query);
    } catch (error) {
      console.log(error);
    }
  }

  static isHasData(data: Array<any>): boolean {
    if (data.length > 0) return true;
  }

  static isDataEqualArray(data: Array<any>, inputArray: any): boolean {
    inputArray = UtilService.convertToArray(inputArray);
    inputArray = UtilService.deleteDuplicate(inputArray);

    return data.length >= inputArray.length ? true : false;
  }
}
