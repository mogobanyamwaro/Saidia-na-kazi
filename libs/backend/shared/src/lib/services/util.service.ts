export class UtilService {
  static convertToArray(toConvert: any) {
    if (Array.isArray(toConvert)) {
      return toConvert;
    }
    return toConvert.split(',');
  }

  static deleteDuplicate(array: Array<any>): Array<any> {
    return array.filter((item, index) => array.indexOf(item) === index);
  }
}
