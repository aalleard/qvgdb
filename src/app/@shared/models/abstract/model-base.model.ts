import * as moment from 'moment';
import { IModelMeta } from '@app/@core/interfaces/model-meta';

export abstract class ModelBase {
  static CLASS_NAME = '';
  private _id: number;

  __meta__: IModelMeta = {
    busy: false,
    deleted: false,
    has_changed: false,
    has_error: false,
    loaded: false,
    local: false,
    multi: false,
    new: false,
    selected: false,
    url: '',
  };

  constructor(oData: any) {
    this.hydrate(oData);
  }

  hydrate(oData: any) {
    for (let sKey in oData) {
      // Do not use meta for dynamic instanciation
      if (sKey === '__meta__') {
        continue;
      }

      // Clean property name
      sKey = sKey.replace(/^_+/gm, '');

      // Call setter method
      this[sKey] = oData[sKey];
    }
  }

  public get busy(): boolean {
    return this.__meta__.busy;
  }

  public set busy(bBusy: boolean) {
    this.__meta__.busy = this._toBoolean(bBusy);
  }

  public get deleted(): boolean {
    return this.__meta__.deleted;
  }

  public set deleted(ib_deleted: boolean) {
    this.__meta__.deleted = this._toBoolean(ib_deleted);
  }

  public set has_changed(ib_changed: boolean) {
    this.__meta__.has_changed = this._toBoolean(ib_changed);
  }

  public get id(): number {
    return this._id;
  }

  public set id(id: number) {
    this._id = this._toInt(id);
  }

  public get loaded(): boolean {
    return this.__meta__.loaded;
  }

  public get new(): boolean {
    return this.__meta__.new;
  }

  public get selected(): boolean {
    return this.__meta__.selected;
  }

  private _processValue(value: any, sType: string): any {
    // Check input type, and use corresponding method to convert value
    if (value !== null && typeof value !== 'undefined') {
      switch (sType) {
        case 'boolean':
          value = this._toBoolean(value);
          break;
        case 'date':
          value = this._toMoment(value);
          break;
        case 'float':
          value = this._toFloat(value);
          break;
        case 'integer':
          value = this._toInt(value);
          break;
        case 'string':
          value = this._toString(value);
          break;
      }
    } else {
      value = null;
    }
    return value;
  }

  public set__meta__(oMeta: any) {
    this.__meta__ = oMeta;
  }

  public setId(iId: number): boolean {
    return this._setValue('id', iId, 'integer');
  }

  public set selected(bSelected: boolean) {
    this.__meta__.selected = bSelected;
  }

  protected _setValue(sAttribute: string, value: any | any[], sType: string) {
    let bValueChanged = false;
    // Depending on value, if it is an array or not
    if (!Array.isArray(value)) {
      // Transform & check that value corresponds to required type
      let processedValue = this._processValue(value, sType);
      // Check if attribute is already defined
      if (typeof this[sAttribute] !== 'undefined') {
        // Check if data has changed
        if (
          (this[sAttribute] !== null && processedValue === null) ||
          (this[sAttribute] === null && processedValue !== null)
        ) {
          bValueChanged = true;
          this[sAttribute] = processedValue;
        } else if (!!this[sAttribute] && typeof this[sAttribute] === 'object') {
          // Date?
          if (moment.isMoment(this[sAttribute])) {
            if (!this[sAttribute].isSame(processedValue)) {
              bValueChanged = true;
              this[sAttribute] = processedValue;
            }
          } else {
            try {
              // Attribute is a Mihy object, compare IDs
              if (this[sAttribute].id !== processedValue.id) {
                bValueChanged = true;
                this[sAttribute] = processedValue;
              } else {
                // Hydrate, to have the most complete object possible
                this[sAttribute].hydrate(processedValue);
              }
            } catch (e) {}
          }
        } else {
          // Simple attribute, compare values
          if (this[sAttribute] !== processedValue) {
            bValueChanged = true;
            this[sAttribute] = processedValue;
          }
        }
      } else {
        if (typeof processedValue !== 'undefined') {
          // Init attribute
          this[sAttribute] = processedValue;
          if (this.loaded) {
            // Modification occurs after object has been instantiated
            bValueChanged = true;
          }
        }
      }
    } else {
      // Init array
      this[sAttribute] = [];
      // Iterate
      value.forEach((element) => {
        let processedValue = this._processValue(element, sType);
        this[sAttribute].push(processedValue);
      });
    }

    if (bValueChanged) {
      this.has_changed = true;
    }
    return bValueChanged;
  }

  protected _toBoolean(value: any) {
    if (value === 1 || value === '1' || value === 'X' || value === true || value === 'VRAI') {
      return true;
    } else {
      return false;
    }
  }

  protected _toFloat(value: any) {
    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    return Math.round(parseFloat(value) * 100) / 100;
  }

  protected _toInt(value: any) {
    if (typeof value === 'string') {
      value = parseInt(value);
    }
    return value;
  }

  public toJsonString(): string {
    let json = JSON.stringify(this);
    Object.keys(this)
      .filter((key) => key[0] === '_')
      .forEach((key) => {
        json = json.replace(key, key.substring(1));
      });

    return json;
  }

  protected _toMoment(date: any) {
    if (typeof date === 'string') {
      return moment(date);
    } else {
      return date;
    }
  }

  protected _toString(value: any) {
    return value.toString();
  }
}
