import { IGrouper } from '@app/@shared/utilities/interfaces/grouper.interface';

export class Grouper implements IGrouper {
	bSort: boolean;
	sProperty: string;
	sLabel: string;

	constructor(oParam: IGrouper) {
		this.bSort = typeof oParam.bSort === 'undefined' ? true : oParam.bSort;
		this.sProperty = oParam.sProperty;
		this.sLabel = !!oParam.sLabel ? oParam.sLabel : this.sProperty;
	}
}
