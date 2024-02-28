import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DynamicTableService {

  private readonly _textFilter = new BehaviorSubject<string>('')
  textFilter$: Observable<string> = this._textFilter.asObservable()

  private _isEditable = new BehaviorSubject<boolean>(false)
  isEditable$: Observable<boolean> = this._isEditable.asObservable()

  constructor() {}

  setTextFilter(textFilter: string) {
    this._textFilter.next(textFilter)
  }
  setIsEditable(isEditable: boolean) {
    this._isEditable.next(isEditable)
  }
}
