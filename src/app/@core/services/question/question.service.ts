import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Models 
import { Question } from '@app/@shared/models/question';
import { CSVConversion } from '@app/@shared/utilities/conversions/csv';
import { BinarySearch } from '@app/@shared/utilities/array/binary-search';

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
	providedIn: 'root'
})
export class QuestionService {
	private _aQuestions: Question[] | null = null;

	constructor(private _oHttp: HttpClient) {}

	get aQuestions(): Question[] {
		return this._aQuestions;
	}

	set aQuestions(aQuestions: Question[]) {
		this._aQuestions = aQuestions || null;
	}

	public fetchQuestions$(): Observable<Question[]> {
		return this._oHttp.get("assets/data/questions.csv", {responseType: 'text'}).pipe(
			map((body: any) => {
				this.setQuestions(CSVConversion.toJSON(body));
				return this.aQuestions;
			})
		);
	}

	public fetchQuestions() {
		this.fetchQuestions$().subscribe();
	}

	public setQuestions(aData: any[]) {
		let aQuestions: Question[];
		
		// Check if local db is initialized
		aQuestions = [];

		if (!!aData) {
			for (let oData of aData) {
				let oQuestion = new Question(oData);
				let oResult = BinarySearch.find(aQuestions, oQuestion, 'id');
				aQuestions.splice(oResult.index, 0, oQuestion);
			}
		}

		// Set data
		this.aQuestions = aQuestions;
	}
}
