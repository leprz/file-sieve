export class DateParser {
  static getMonth(date: Date): string {
    return ("0" + (date.getMonth() + 1)).slice(-2);
  }

  static getDay(date: Date): number {
    return date.getDate();
  }

  static getYear(date: Date): number {
    return date.getFullYear();
  }
}
