export class BinarySearch {
  /**
   * Method that performs a binary search within an array
   *
   * aArray and needle can be either Object or "simple" variable. needle can be the object property's value
   *
   * When using Objects, sProperty must be filled so the method knows what key
   * has to be compared
   *
   * When using Objects, sProperty can be a method. Object methods will be evaluated and the
   * find() method will compare results
   * @param {any[]} aArray An array of any elements, Object or not
   * @param {any} needle The element to search. Must be same type as aArray elements
   * @param {string} sProperty Mandatory when using objects. Indicates what property has to be compared
   */
  static find(aArray: any[], needle: any, sProperty: string = null) {
    let iStart = 0,
      iEnd = aArray.length - 1;

    // Iterate while start not meets end
    while (iStart <= iEnd) {
      // Find the mid index
      let iMid = Math.floor((iStart + iEnd) / 2);

      if (!sProperty) {
        // We are looking for a value inside an array of values
        // If element is present at mid, return True
        if (aArray[iMid] === needle) {
          return { found: true, index: iMid };
        } else if (aArray[iMid] < needle) {
          iStart = iMid + 1;
        } else {
          iEnd = iMid - 1;
        }
      } else {
        // Evaluate property/method to get simple values to compare
        let value1 =
          typeof aArray[iMid][sProperty] === 'function' ? aArray[iMid][sProperty]() : aArray[iMid][sProperty];
        let value2 =
          typeof needle === 'object'
            ? typeof needle[sProperty] === 'function'
              ? needle[sProperty]()
              : needle[sProperty]
            : needle;
        if (value1 === value2) {
          return { found: true, index: iMid };
        } else if (value1 < value2) {
          iStart = iMid + 1;
        } else {
          iEnd = iMid - 1;
        }
      }
    }

    return { found: false, index: iStart };
  }
}
