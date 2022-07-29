import { Filter } from '@app/@shared/utilities/models/filter';
import * as moment from 'moment';

export class Filtering {
  /**
   * Filter an array of elements
   * @param {any[]} aArray Array to filter
   * @param {Filter[]} aFilters Filtering parameters
   * @returns An array containing elements matching the filters
   */
  static filter(aArray: any[], aFilters: Filter[]): any[] {
    // Undefined array
    if (!aArray) {
      return [];
    }

    // Empty array
    if (aArray.length === 0) {
      return [];
    }

    // No filters
    if (aFilters.length === 0) {
      return aArray;
    }

    return aArray.filter((oElement) => {
      return Filtering._matchAll(oElement, aFilters);
    });
  }

  static _match(oElement: any, oFilter: Filter): boolean {
    if (!oFilter) {
      // Undefined filter
      return true;
    }
    // Check if this is a single filter or a complex filter
    else if (oFilter.aFilters.length > 0) {
      // Complex
      return Filtering._matchComplex(oElement, oFilter);
    } else {
      // Single
      return Filtering._matchSingle(oElement, oFilter);
    }
  }

  static _matchAll(oElement: any, aFilters: Filter[]): boolean {
    let bMatch: boolean = false;

    for (var sKey in aFilters) {
      bMatch = Filtering._match(oElement, aFilters[sKey]);
      if (!bMatch) {
        return false;
      }
    }

    return true;
  }

  static _matchComplex(oElement: any, oFilter: Filter): boolean {
    // Init match indicator depending on filter operator
    let bMatch: boolean = oFilter.bAnd;
    // Loop over filters to resolve them individually
    for (var sKey in oFilter.aFilters) {
      bMatch = Filtering._match(oElement, oFilter.aFilters[sKey]);
      if ((oFilter.bAnd && !bMatch) || (!oFilter.bAnd && bMatch)) {
        // 1 condition is not respected and operator is AND or
        // 1 condition is     respected and operator is OR
        // No need to go further
        break;
      }
    }

    // Check if we have a NOT operator on the filter
    bMatch = oFilter.bNot ? !bMatch : bMatch;

    return bMatch;
  }

  static _matchSingle(oElement: any, oFilter: Filter): boolean {
    let bMatch: boolean = false;
    let value = Filtering._resolve(oElement, oFilter.sProperty);
    if (Array.isArray(value)) {
      bMatch = Filtering.filter(value, [oFilter]).length > 0;
    } else {
      // Check if condition matches
      switch (oFilter.sComparator) {
        case Filter.COMPARATOR.EQ:
          if (moment.isMoment(value)) {
            bMatch = value.isSame(oFilter.value);
          } else {
            bMatch = value === oFilter.value;
          }
          break;
        case Filter.COMPARATOR.NE:
          if (moment.isMoment(value)) {
            bMatch = !value.isSame(oFilter.value);
          } else {
            bMatch = value !== oFilter.value;
          }
          break;
        case Filter.COMPARATOR.GE:
          if (moment.isMoment(value)) {
            bMatch = value.isSameOrAfter(oFilter.value);
          } else {
            bMatch = value >= oFilter.value;
          }
          break;
        case Filter.COMPARATOR.GT:
          if (moment.isMoment(value)) {
            bMatch = value.isAfter(oFilter.value);
          } else {
            bMatch = value > oFilter.value;
          }
          break;
        case Filter.COMPARATOR.LE:
          if (moment.isMoment(value)) {
            bMatch = value.isSameOrBefore(oFilter.value);
          } else {
            bMatch = value <= oFilter.value;
          }
          break;
        case Filter.COMPARATOR.LT:
          if (moment.isMoment(value)) {
            bMatch = value.isBefore(oFilter.value);
          } else {
            bMatch = value < oFilter.value;
          }
          break;
        case Filter.COMPARATOR.Contains:
          bMatch = value.toLowerCase().includes(oFilter.value.toLowerCase());
          break;
        case Filter.COMPARATOR.EndsWith:
          bMatch = value.toLowerCase().endsWith(oFilter.value.toLowerCase());
          break;
        case Filter.COMPARATOR.StartsWith:
          bMatch = value.toLowerCase().startsWith(oFilter.value.toLowerCase());
          break;
        default:
          throw 'Invalid filter comparator';
      }
    }

    // Check if we have a NOT operator on the filter
    bMatch = oFilter.bNot ? !bMatch : bMatch;

    return bMatch;
  }

  static _resolve(oObject: any, sPath: string): any {
    // If no path given, then return whole object as a string
    if (!sPath) {
      return JSON.stringify(oObject);
    }

    sPath = sPath.replace(/\./g, '/');
    var aPath = sPath.split('/');
    var current = oObject;
    var next = null;
    while (aPath.length) {
      if (typeof current !== 'object') {
        return current;
      }
      next = current[aPath.shift()];
      if (typeof next === 'function') {
        current = next.call(current);
      } else if (next === null || typeof next === 'undefined') {
        return null;
      } else if (Array.isArray(next)) {
        let aValues = [];
        for (let i = 0; i < next.length; i++) {
          aValues.push(Filtering._resolve(next[i], aPath.join('/')));
        }
        return aValues;
      } else {
        current = next;
      }
    }
    return current;
  }
}
