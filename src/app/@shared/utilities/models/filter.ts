import * as moment from 'moment';

export interface IFilterParam {
	aFilters?: Filter[];
	bAnd?: boolean;
	bNot?: boolean;
	sComparator?: string;
	sProperty?: string;
	value?: any;
}

export class Filter implements IFilterParam {
	static readonly URL_KEY: string = '$filter=';
	static readonly COMPARATOR = {
		// Value comparators
		EQ: 'eq',
		NE: 'ne',
		GE: 'ge',
		GT: 'gt',
		LE: 'le',
		LT: 'lt',
		// String functions
		Contains: 'substringof',
		EndsWith: 'endswith',
		StartsWith: 'startwith'
	};
	static readonly OPERATOR = {
		AND: ' and ',
		NOT: 'not ',
		OR: ' or '
	};
	static readonly SEPARATOR: string = ',';

	aFilters?: Filter[];
	bAnd: boolean;
	bNot: boolean;
	sComparator: string;
	sProperty: string;
	value: any;

	constructor(oParam: IFilterParam) {
		this.aFilters = typeof oParam.aFilters !== 'undefined' ? oParam.aFilters : [];
		this.bAnd = typeof oParam.bAnd !== 'undefined' ? oParam.bAnd : true;
		this.bNot = typeof oParam.bNot !== 'undefined' ? oParam.bNot : false;
		this.sComparator = typeof oParam.sComparator !== 'undefined' ? oParam.sComparator : null;
		this.sProperty = typeof oParam.sProperty !== 'undefined' ? oParam.sProperty : null;
		this.value = typeof oParam.value !== 'undefined' ? oParam.value : null;
	}

	static fromStringToArray(sFilters: string): Filter[] {
		let aFilterParts = sFilters.split(',');
		let aFilters: Filter[] = [];
		aFilterParts.forEach((sPart: string) => {
			let aParts = sPart.split(' ');
			let oFilterTmp = new Filter({
				sProperty: aParts[0].replace(/\//g, '.'),
				sComparator: aParts[1],
				value: aParts[2].replace(/\'/g, '')
			});
			aFilters.push(oFilterTmp);
		});
		return aFilters;
	}

	public toString(): string {
		let sUrl: string = '';

		// Not operator
		sUrl += this.bNot ? Filter.OPERATOR.NOT : '';

		// Simple Filter or array of Filters ?
		if (typeof this === 'string') {
			return this;
		} else if (this.aFilters.length > 0) {
			sUrl += '(';

			for (let i = 0; i < this.aFilters.length; i++) {
				// Recursive call
				sUrl += this.aFilters[i].toString();

				// Logical operator
				if (i < this.aFilters.length - 1) {
					sUrl += this.bAnd ? Filter.OPERATOR.AND : Filter.OPERATOR.OR;
				}
			}

			sUrl += ')';
		} else {
			let sValue: string;
			if (this.value === null || typeof this.value === 'undefined') {
				sValue = 'null';
			} else {
				switch (typeof this.value) {
					case 'boolean':
						sValue = this.value.toString();
						break;
					case 'number':
						if (this.sProperty.endsWith('.month')) {
							// Special handling for month as JS starts with index 0
							let iValue = this.value + 1;
							sValue = iValue.toString();
						} else {
							sValue = this.value.toString();
						}
						break;
					case 'string':
						sValue = "'" + this.value + "'";
						break;
					case 'object':
						if (moment.isMoment(this.value)) {
							sValue = "'" + this.value.format('YYYY-MM-DD') + "'";
						} else {
							throw 'Invalid filter value!';
						}
						break;
					default:
						throw 'Invalid filter value!';
				}
			}
			sUrl += this.sProperty.replace(/\./g, '/') + ' ' + this.sComparator + ' ' + sValue;
		}

		return sUrl;
	}

	static toUrlString(aFilters: Filter[]): string {
		// Init URL with keyword
		let sUrl = Filter.URL_KEY;

		// Concatenate filters
		for (let sKey in aFilters) {
			sUrl += aFilters[sKey].toString();
			sUrl += Filter.SEPARATOR;
		}
		// Remove last separator
		sUrl = sUrl.substr(0, sUrl.length - 1);

		return sUrl;
	}
}
