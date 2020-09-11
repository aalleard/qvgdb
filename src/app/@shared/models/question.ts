import { ModelBase } from './abstract/model-base.model';

export class Question extends ModelBase {
    private _appelAmi: string;
    private _appelReponse: string;
    private _cinquanteCinquante: string;
    private _dernierMot: boolean;
    private _musique: string;
    private _publicA: string;
    private _publicB: string;
    private _publicC: string;
    private _publicD: string;
    private _question: string;
    private _reponse: string;
    private _reponseA: string;
    private _reponseB: string;
    private _reponseC: string;
    private _reponseD: string;

    /*
     * Methods
     */

    public perform5050(): void {
        if (this._reponse !== 'A' && this._cinquanteCinquante !== 'A') {
            this._reponseA = "";
            this.publicB = (parseInt(this.publicA) + parseInt(this.publicB)).toString();
            this.publicA = "0";
        }
        if (this._reponse !== 'B' && this._cinquanteCinquante !== 'B') {
            this._reponseB = "";
            this.publicC = (parseInt(this.publicB) + parseInt(this.publicC)).toString();
            this.publicB = "0";
        }
        if (this._reponse !== 'C' && this._cinquanteCinquante !== 'C') {
            this._reponseC = "";
            this.publicD = (parseInt(this.publicC) + parseInt(this.publicD)).toString();
            this.publicC = "0";
        }
        if (this._reponse !== 'D' && this._cinquanteCinquante !== 'D') {
            this._reponseD = "";
            if (this.reponseA != "") {
                this.publicA = (parseInt(this.publicA) + parseInt(this.publicD)).toString();
            } else {
                this.publicB = (parseInt(this.publicB) + parseInt(this.publicD)).toString();
            }
            this.publicD = "0";
        }
    }

    /*
     * GETTERS 
     */

    public get appelAmi(): string {
        return this._appelAmi;
    }
    public get appelReponse(): string {
        return this._appelReponse;
    }
    public get cinquanteCinquante(): string {
        return this._cinquanteCinquante;
    }
    public get dernierMot(): boolean {
        return this._dernierMot;
    }
    public get musique(): string {
        return this._musique;
    }
    public get publicA(): string {
        return this._publicA;
    }
    public get publicB(): string {
        return this._publicB;
    }
    public get publicC(): string {
        return this._publicC;
    }
    public get publicD(): string {
        return this._publicD;
    }
    public get question(): string {
        return this._question;
    }
    public get reponse(): string {
        return this._reponse;
    }
    public get reponseA(): string {
        return this._reponseA;
    }
    public get reponseB(): string {
        return this._reponseB;
    }
    public get reponseC(): string {
        return this._reponseC;
    }
    public get reponseD(): string {
        return this._reponseD;
    }

    /*
     * SETTERS 
     */
    
    public set appelAmi(appelAmi: string) {
        this._appelAmi = appelAmi;
    }
    public set appelReponse(appelReponse: string) {
        this._appelReponse = appelReponse;
    }
    public set cinquanteCinquante(cinquanteCinquante: string) {
        this._cinquanteCinquante = cinquanteCinquante;
    }
    public set dernierMot(dernierMot: boolean) {
        this._dernierMot = this._toBoolean(dernierMot);
    }
    public set musique(musique: string) {
        this._musique = musique;
    }
    public set publicA(publicA: string) {
        this._publicA = publicA;
    }
    public set publicB(publicB: string) {
        this._publicB = publicB;
    }
    public set publicC(publicC: string) {
        this._publicC = publicC;
    }
    public set publicD(publicD: string) {
        this._publicD = publicD;
    }
    public set question(question: string) {
        this._question = question;
    }
    public set reponse(reponse: string) {
        this._reponse = reponse;
    }
    public set reponseA(reponseA: string) {
        this._reponseA = reponseA;
    }
    public set reponseB(reponseB: string) {
        this._reponseB = reponseB;
    }
    public set reponseC(reponseC: string) {
        this._reponseC = reponseC;
    }
    public set reponseD(reponseD: string) {
        this._reponseD = reponseD;
    }
}