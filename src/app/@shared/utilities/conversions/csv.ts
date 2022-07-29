export class CSVConversion {
  public static toJSON(sCsv: string, sSeparator = ';'): any[] {
    let aLines = sCsv.split('\n');

    let aResult = [];

    let aHeaders = aLines[0].split(sSeparator);

    for (let i = 1; i < aLines.length; i++) {
      let oLine = {};
      let aLine = aLines[i].split(sSeparator);

      for (let j = 0; j < aHeaders.length; j++) {
        oLine[aHeaders[j]] = aLine[j];
      }

      aResult.push(oLine);
    }

    return aResult; // JavaScript object
  }
}
