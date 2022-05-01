import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

export class HashHelper {
  private static salt: string = bcrypt.genSaltSync(10);

  /**
   *
   * @param { string } string
   * @returns
   */
  public static async encrypt(string: string): Promise<string> {
    return bcrypt.hash(string, HashHelper.salt);
  }

  public static slugify(string: string) {
    return string
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }

  /**
   *
   * @param { string } plain
   * @param { string } hash
   * @returns
   */
  public static async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  public static pluck<T, K extends keyof T>(objs: T[], key: K): T[K][] {
    return objs.map((obj) => obj[key]);
  }

  public static generateRandomIntegerInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public static generatePhoneNumber() {
    const reqex =
      '/(+?254|0){1}[7]{1}([0-2]{1}[0-9]{1}|[9]{1}[0-2]{1})[0-9]{6}/';
    const randonPhoneNumber = faker.phone.phoneNumber();

    return randonPhoneNumber;
  }
}
