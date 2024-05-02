import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxDynamicTableComponent } from '../../../ngx-dynamic-table/src/lib/ngx-dynamic-table.component';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { Tableoptions } from '../../../ngx-dynamic-table/src/lib/models/tableoptions.model';
import { TableActionReturn } from '../../../ngx-dynamic-table/src/lib/models/tableaction.model';
import { TableActionEnum } from '../../../ngx-dynamic-table/src/lib/models/tableaction.enum';
import { CommonModule, DatePipe } from '@angular/common';
import { CircularSpinnerComponent } from '../../../ngx-dynamic-table/src/lib/components/circular-spinner/circular-spinner.component';
import { MatMenuModule } from '@angular/material/menu';
import { DynamicTableService, ExpandTemplateService } from '../../../ngx-dynamic-table/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CircularSpinnerComponent,
    CommonModule,
    DatePipe,
    MatMenuModule,
    NgxDynamicTableComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   * The isVisible property belongs to the data of the dynamic-table.
   * It is used to show or hide the table, depended on the data.
   * 
   * @type {boolean}
   */
  isVisible: boolean = false
  isSpinnerVisible: boolean = true
  isCheckedAll: boolean = false

  @ViewChild('expandtemplate') expandtemplate: any

  private readonly _data = new BehaviorSubject<any[]>([])
  data$: Observable<any[]> = this._data.asObservable()

  destroy$: Subject<boolean> = new Subject<boolean>()

  constructor(private _dynamicTableService: DynamicTableService, private _expandTemplateService: ExpandTemplateService) {
    this.setData()
  }

  ngAfterViewInit(): void {
    this._expandTemplateService.add('expandtemplate', this.expandtemplate)
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

  data: any = [
    { id: '1', name: 'Tim', date: '01.01.2024 00:00:59', ort: 'Berlin', checked: false, description: 'Test1' },
    { id: '2', name: 'Tom', date: '01.01.2023 00:00:59', ort: 'Hamburg', checked: false, description: 'Test2' },
    { id: '3', name: 'Thomas', date: '01.02.2023 00:00:59', ort: 'Dresden', checked: false, description: 'Test3' },
    { id: '4', name: 'Martin', date: '03.02.2023 00:00:59', ort: 'München', checked: false, description: 'Halllo1' },
    { id: '5', name: 'Markus', date: '04.02.2023 00:00:59', ort: 'Köln', checked: false, description: 'Hallo2' }
  ]

  // first table - easy table
  easydata$: Observable<any[]> = of([
    { date: '01.01.2024 00:00:59', description: 'Berlin' },
    { date: '01.01.2023 00:00:59', description: 'Hamburg' },
  ])
  easytable: Tableoptions = {
    columns: [
      { id: '1', name: 'date', header: 'Datum/Zeit', cell: 'date', pipe: { name: DatePipe, args: 'dd.MM.YYYY HH:mm:ss'}, hidden: false, sortable: true },
      { id: '2', name: 'description', header: 'Beschreibung', cell: 'description', hidden: false, sortable: true },
    ]
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
    columnFilter: ['name', 'date', 'ort', 'description'],
    columnNames: ['name', 'date', 'ort'],
    isExpandable: true,
    checkbox: true,
    count: false,
    paginator: true,
    sortRowManual: false,
    unread: false,
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
        this.isCheckedAll = !this.isCheckedAll
        this._data.value.forEach((row: any) => {
          row.checked = this.isCheckedAll
        })
        break
      default:
        console.log('default action')
    }
  }

  /**
   * @ignore
   */
  setData() {
    this._data.next(this.data)
  }

  refreshTable() {
    this._data.next(this.data)
  }

  useExpandTemplate(id: string) {
    let item = this.data.find((el: any) => el.id == id)
    this.data = this.data.filter((el: any) => el.id != id)
    item.checked = true
    this.data = [...this.data, item]
  }

  setTextfilter(filterText: any) {
    this._dynamicTableService.setTextFilter(filterText)
  }
  resetTextfilter() {
    this._dynamicTableService.setTextFilter('')
  }
}
