import { BinarySearch } from './binary-search';
import { ModelBase } from '@app/@shared/models/abstract/model-base.model';
import { IMergeOption } from '@app/@shared/utilities/interfaces/merge-option.interface';
import { Sorting } from '@app/@shared/utilities/array/sorting';
import { Sorter } from '@app/@shared/utilities/models/sorter';

export class Merging {
  private static _getDefaultOptions(oOptions?: IMergeOption) {
    if (!oOptions) {
      oOptions = {};
    }

    oOptions.bKeepSelection = typeof oOptions.bKeepSelection === 'undefined' ? true : oOptions.bKeepSelection;
    oOptions.bNewReference = typeof oOptions.bNewReference === 'undefined' ? false : oOptions.bNewReference;

    return oOptions;
  }

  /**
   * Method to merge two ModelBase arrays checking if same instance already
   * exists in target array. If so, it will update current values
   * For performance reasons, output array sorting is affected, instances will be sorted
   * by 'id'
   * @param aSource
   * @param aTarget
   */
  public static merge<T extends ModelBase>(aSource: T[], aTarget: T[], oOptions?: IMergeOption): T[] {
    // Build default options
    oOptions = Merging._getDefaultOptions(oOptions);

    // Sort target array
    let oSorter = new Sorter({
      sProperty: 'id',
    });
    aTarget = Sorting.sort(aTarget, [oSorter]);

    // Merge arrays
    aSource.forEach((oInstance) => {
      // Search if instance already exists in buffer
      let oResult = BinarySearch.find(aTarget, oInstance, 'id');
      if (oResult.found) {
        // Value to keep
        let bDeleted = aTarget[oResult.index].deleted || oInstance.deleted;
        let bSelected = (oOptions.bKeepSelection && aTarget[oResult.index].selected) || oInstance.selected;
        // Update value
        aTarget[oResult.index].hydrate(oInstance);
        aTarget[oResult.index].deleted = bDeleted;
        aTarget[oResult.index].selected = bSelected;
      } else {
        // Insert instance into buffer at right index
        aTarget.splice(oResult.index, 0, oInstance);
      }
    });

    if (oOptions.bNewReference) {
      // Returns a new array reference to trigger detection change
      return [].concat(aTarget);
    } else {
      return aTarget;
    }
  }
}
