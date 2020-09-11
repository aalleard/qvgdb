import { Grouper } from '@app/@shared/utilities/models/grouper';
import { Sorter } from '@app/@shared/utilities/models/sorter';
import { TreeNode } from '@app/@shared/utilities/models/tree-node';

export class Sorting {
	static _group(aArray: any[], aSorters: Sorter[], oGrouper: Grouper, oParent: TreeNode): TreeNode[] {
		if (!oGrouper.sLabel) {
			oGrouper.sLabel = oGrouper.sProperty;
		}
		// If required, sort array using group property
		if (oGrouper.bSort) {
			aArray = Sorting.sort(aArray, [
				new Sorter({
					sProperty: oGrouper.sProperty
				})
			]);
		} else {
			// Perform a first sort
			aArray = Sorting.sort(aArray, aSorters);
		}

		// Then, sort each group individually
		let aArrayExp: any[] = [];
		let aArrayTmp: any[] = [];
		let oldValue = null;
		let newValue = null;
		let sGroupName = null;
		for (var i = 0; i < aArray.length; i++) {
			newValue = Sorting._resolve(aArray[i], oGrouper.sProperty);
			// Initialize group name
			if (i === 0) {
				sGroupName = Sorting._resolve(aArray[i], oGrouper.sLabel);
				oldValue = newValue;
			}
			// If first iteration or value changes
			if (i !== 0 && newValue !== oldValue) {
				// Sort subset
				aArrayTmp = Sorting.sort(aArrayTmp, aSorters);
				// Append new group to export array
				let oNode: TreeNode = new TreeNode({
					aChildren: aArrayTmp,
					iLevel: !!oParent ? oParent.iLevel + 1 : 0,
					key: oldValue,
					oParent: oParent,
					sName: sGroupName
				});
				aArrayExp.push(oNode);
				// Init with new value
				oldValue = newValue;
				aArrayTmp = [];
				sGroupName = Sorting._resolve(aArray[i], oGrouper.sLabel);
			}

			// Push value in subset
			aArrayTmp.push(aArray[i]);
		}
		// Last sort
		aArrayTmp = Sorting.sort(aArrayTmp, aSorters);
		// Append new node to export array
		let oNode: TreeNode = new TreeNode({
			aChildren: aArrayTmp,
			iLevel: !!oParent ? oParent.iLevel + 1 : 0,
			key: newValue,
			oParent: oParent,
			sName: sGroupName
		});
		aArrayExp.push(oNode);

		return aArrayExp;
	}

	static _grouping(aArray: any[], aSorters: Sorter[], aGroupers: Grouper[], oParent: TreeNode) {
		// Build the group
		let aTreeNodes: TreeNode[] = Sorting._group(aArray, aSorters, aGroupers[0], oParent);
		// Remove first element
		aGroupers.shift();
		// If there is other groups to build
		if (aGroupers.length) {
			// Create sub groups in groups
			aTreeNodes.forEach(oNode => {
				let aGroupersTmp = [].concat(aGroupers);
				oNode.aChildren = Sorting._grouping(oNode.aChildren, aSorters, aGroupersTmp, oNode);
			});
		}

		return aTreeNodes;
	}

	static _resolve(oObject: any, sPath: string) {
		var aPath = sPath.split('.');
		var current = oObject;
		var next = null;
		while (aPath.length) {
			let aArgs: any[] = [];
			if (typeof current !== 'object') {
				return undefined;
			}
			// Detect if current path part is a function with parameters
			// Identify '(' position
			if (aPath[0].includes('(')) {
				let aPathParts = aPath[0].split('(');
				aPath[0] = aPathParts[0];
				let sArgsString = aPathParts[1].substring(0, aPathParts[1].length - 1).replace(' ', '');
				aArgs = sArgsString.split(',');
			}

			next = current[aPath.shift()];
			if (typeof next === 'function') {
				current = next.call(current, ...aArgs);
			} else if (next === null || typeof next === 'undefined') {
				return null;
			} else {
				current = next;
			}
		}
		return current;
	}

	/**
	 * Sort an array of elements
	 * @param aArray Array to sort
	 * @param aSorters Sorting parameters
	 */
	static sort(aArray: any[], aSorters: Sorter[], aGroupers?: Grouper[], oParent: TreeNode = null) {
		// Undefined array or Empty array
		if (!aArray || aArray.length === 0) {
			return [];
		}

		// No sorters
		if (!aSorters || aSorters.length === 0) {
			return aArray;
		}

		// If grouping is required
		if (!!aGroupers && aGroupers.length > 0) {
			return Sorting._grouping(aArray, aSorters, aGroupers, oParent);
		}

		// Parameters
		let sProperty = aSorters['0'].sProperty;
		let iLength = aArray.length;
		let bDesc, bEmptyFirst;
		for (let sKey in aSorters) {
			if (sKey === '0') {
				bDesc = !!aSorters['0'].bDescending;
				bEmptyFirst = !!aSorters['0'].bEmptyFirst;
				// Perform actual sorting
				aArray = Sorting._sort(aArray, sProperty, bDesc, bEmptyFirst);
			} else {
				// Array has been sorted using first property, now we go deeper
				let aNewArray: any[] = [];
				let aSubset = [];
				let oldValue = null;
				let newValue = null;
				// Remove first sorter
				let aNewSortings = aSorters.slice(1);
				// Split the array into subarrays with the same first sort criteria, and sort them
				for (let j = 0; j < iLength; j++) {
					newValue = Sorting._resolve(aArray[j], sProperty);
					// If first iteration or value changes
					if (j === 0 || newValue !== oldValue) {
						// Sort subset
						aSubset = Sorting.sort(aSubset, aNewSortings);
						// Concat
						aNewArray = aNewArray.concat(aSubset);
						// Init with new value
						oldValue = newValue;
						aSubset = [];
					}

					// Push value in subset
					aSubset.push(aArray[j]);
				}
				// Last sort
				aSubset = Sorting.sort(aSubset, aNewSortings);
				// Concat
				aNewArray = aNewArray.concat(aSubset);
				// No need to go further, other sorts will occur with recursivity
				return aNewArray;
			}
		}
		return aArray;
	}

	static _sort(aArray: any[], sProperty: string, bDesc: boolean, bEmptyFirst: boolean) {
		let aArrayExp = [].concat(aArray);
		let iLength = aArrayExp.length;
		let bSwapped;
		let value1;
		let value2;
		// Sort the whole array
		do {
			bSwapped = false;
			for (let i = 0; i < iLength - 1; i++) {
				value1 = Sorting._resolve(aArrayExp[i], sProperty);
				value2 = Sorting._resolve(aArrayExp[i + 1], sProperty);
				// If both values are null, skip iteration
				if (!value1 && !value2) {
					continue;
					// If value1 is null and null have to be at the beginning
				} else if (!value1 && bEmptyFirst) {
					continue;
					// If value2 is null and null have to be at the end
				} else if (!value2 && !bEmptyFirst) {
					continue;
					// If value1 is null and null have to be at the end
				} else if (!value1 && !bEmptyFirst) {
					[aArrayExp[i], aArrayExp[i + 1]] = [aArrayExp[i + 1], aArrayExp[i]];
					bSwapped = true;
					// If value2 is null and null have to be at the beginning
				} else if (!value2 && bEmptyFirst) {
					[aArrayExp[i], aArrayExp[i + 1]] = [aArrayExp[i + 1], aArrayExp[i]];
					bSwapped = true;
					// Neither value1 nor value2 is null
				} else if (!bDesc) {
					// Ascending sort
					if (value1 > value2) {
						[aArrayExp[i], aArrayExp[i + 1]] = [aArrayExp[i + 1], aArrayExp[i]];
						bSwapped = true;
					}
				} else {
					// Descending sort
					if (value1 < value2) {
						[aArrayExp[i], aArrayExp[i + 1]] = [aArrayExp[i + 1], aArrayExp[i]];
						bSwapped = true;
					}
				}
			}
		} while (bSwapped);

		return aArrayExp;
	}
}
