import { ISorter } from '@app/@shared/utilities/interfaces/sorter.interface';

export class Sorter implements ISorter {
  static readonly OPERATOR = {
    ASC: '',
    DESC: ' desc',
  };
  static readonly SEPARATOR: string = ',';
  static readonly URL_KEY: string = '$orderby=';

  bDescending: boolean;
  bEmptyFirst: boolean;
  sProperty: string;

  constructor(oParam: ISorter) {
    this.sProperty = oParam.sProperty;
    this.bDescending = !!oParam.bDescending ? oParam.bDescending : false;
    this.bEmptyFirst = !!oParam.bEmptyFirst ? oParam.bEmptyFirst : false;
  }

  public toString(): string {
    let sUrl = this.sProperty;
    if (this.bDescending) {
      sUrl += Sorter.OPERATOR.DESC;
    }

    return sUrl;
  }

  static toUrlString(aSorters: Sorter[]): string {
    let sUrl: string = Sorter.URL_KEY;

    // Concatenate sorters
    for (let sKey in aSorters) {
      sUrl += aSorters[sKey].toString();
      sUrl += Sorter.SEPARATOR;
    }
    // Remove last separator
    sUrl = sUrl.substr(0, sUrl.length - 1);

    return sUrl;
  }
}
