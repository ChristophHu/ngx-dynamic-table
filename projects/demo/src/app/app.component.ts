import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxDynamicTableComponent } from '../../../ngx-dynamic-table/src/lib/ngx-dynamic-table.component';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Tableoptions } from '../../../ngx-dynamic-table/src/lib/models/tableoptions.model';
import { TableActionReturn } from '../../../ngx-dynamic-table/src/lib/models/tableaction.model';
import { TableActionEnum } from '../../../ngx-dynamic-table/src/lib/models/tableaction.enum';
import { CommonModule, DatePipe } from '@angular/common';
import { CircularSpinnerComponent } from '../../../ngx-dynamic-table/src/lib/components/circular-spinner/circular-spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CircularSpinnerComponent,
    CommonModule,
    DatePipe,
    NgxDynamicTableComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit, OnDestroy {
  /**
   * The isVisible property belongs to the data of the dynamic-table.
   * It is used to show or hide the table, depended on the data.
   * 
   * @type {boolean}
   */
  isVisible: boolean = false
  isSpinnerVisible: boolean = true;

  private readonly _data = new BehaviorSubject<any[]>([])
  data$: Observable<any[]> = this._data.asObservable()

  destroy$: Subject<boolean> = new Subject<boolean>()

  constructor() {
    this.setData()
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible = true
    },2000)
  }

  ngOnDestroy(): void {
    console.log('destroy')
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

  tableoptions: Tableoptions = {
    actions: [
      { name: 'delete', icon: 'trash', action: 1 },
      { name: 'edit', icon: 'edit', action: 2 },
      { name: 'show', icon: 'eye', action: 4 }
    ],
    columns: [
      { id: '1', name: 'id', header: 'ID', cell: 'id', hidden: true, sortable: true },
      { id: '2', name: 'name', header: 'Name', cell: 'name', hidden: false, sortable: true },
      { id: '3', name: 'date', header: 'Datum/Zeit', cell: 'date', pipe: { name: DatePipe, args: 'dd.MM.YYYY HH:mm:ss'}, hidden: false, sortable: true },
      { id: '4', name: 'ort', header: 'Ort', cell: 'ort', hidden: false, sortable: true },
    ],
    columnFilter: ['date', 'ort'],
    columnNames: ['checkbox', 'count', 'name', 'date', 'ort', 'actions'],
    showCheckbox: true,
    showCount: true,
    showPaginator: true,
    sortColumn: 'date',
    sortStart: 'asc'
  }

  /**
 * @param {TableActionReturn} event  The target to process
 * @returns The processed target number
 */
  returnTableAction(event: TableActionReturn) {
    switch (event.action) {
      case TableActionEnum.DELETE:
        console.log('delete row')
        break
      case TableActionEnum.EDIT:
        console.log('edit row')
        break
      case TableActionEnum.SHOW:
        console.log('show row')
        break
      case TableActionEnum.REFRESH:
        console.log('refresh table')
        this.setData()
        break
      case TableActionEnum.CHECK:
        console.log('check row', event.row)
        break
      case TableActionEnum.CHECKALL:
        console.log('check all rows')
        break
      default:
        console.log('default action')
    }
  }

  /**
   * @ignore
   */
  setData() {
    this._data.next([
      { id: '1', name: 'Tim', date: '01.01.2024 00:00:59', ort: 'Berlin', checked: false },
      { id: '2', name: 'Tom', date: '01.01.2023 00:00:59', ort: 'Hamburg', checked: true },
      { id: '3', name: 'Thomas', date: '01.02.2023 00:00:59', ort: 'Dresden', checked: true },
      { id: '4', name: 'Martin', date: '03.02.2023 00:00:59', ort: 'München', checked: false },
      { id: '5', name: 'Markus', date: '04.02.2023 00:00:59', ort: 'Köln', checked: false }
    ])
  }
}
