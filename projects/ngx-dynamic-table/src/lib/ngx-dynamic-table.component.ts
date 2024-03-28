import { animate, sequence, style, transition, trigger } from '@angular/animations'
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { Tableoptions } from './models/tableoptions.model'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { TableActionReturn } from './models/tableaction.model'
import { MatSort, MatSortModule, MatSortable } from '@angular/material/sort'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { DynamicTableService } from './services/dynamic-table.service'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { TableActionEnum } from './models/tableaction.enum'
import { CommonModule } from '@angular/common'
import { DynamicPipe } from './pipes/dynamic/dynamic.pipe'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatMenuModule } from '@angular/material/menu'
import { ScrollIndicatorComponent } from './components/scroll-indicator/scroll-indicator.component'
import { StickyDirective } from './directives/sticky/sticky.directive'
import { MobilePaginationDirective } from './directives/mobile-pagination/mobile-pagination.directive'
import { IconsComponent } from './components/icons/icons.component'

export const rowsAnimation = trigger('rowsAnimation', [
  transition('void => *', [
    style({ height: '*', opacity: '0', transform: 'translateX(-550px)', 'box-shadow': 'none' }),
    sequence([
      animate(".35s ease", style({ height: '*', opacity: '.2', transform: 'translateX(0)', 'box-shadow': 'none'  })),
      animate(".35s ease", style({ height: '*', opacity: 1, transform: 'translateX(0)' }))
    ])
  ])
])

@Component({
  selector: 'dynamic-table',
  standalone: true,
  imports: [
    CommonModule,
    DynamicPipe,
    FormsModule,
    IconsComponent,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MobilePaginationDirective,
    ReactiveFormsModule,
    ScrollIndicatorComponent,
    StickyDirective
  ],
  templateUrl: './ngx-dynamic-table.component.html',
  styleUrls: ['./ngx-dynamic-table.component.sass']
})
export class NgxDynamicTableComponent implements OnInit {
  @Input() table!: Tableoptions
  @Input() data$!: Observable<any[]>
  @Input() isEditableInTable: boolean = false
  @Input() pageSize: number = 10
  @Output() action: EventEmitter<TableActionReturn> = new EventEmitter<TableActionReturn>()

  // @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator | null
  paginator!: MatPaginator
  @ViewChild(MatPaginator) set _paginator(paginator: MatPaginator) {
    this.paginator = paginator
    this.dataSource.paginator = this.paginator
  }
  @ViewChild(MatSort) sort!: MatSort

  private readonly _changePaginator = new BehaviorSubject<boolean>(false) 
  changePaginator$: Observable<boolean> = this._changePaginator.asObservable()

  dataSource: any
  pageSizeOptions: number[] = [1, 5, 10, 15, 20, 50, 100]
  isEditable$: Observable<boolean> = this._dynamicTableService.isEditable$

  constructor(private _dynamicTableService: DynamicTableService) {
    this.dataSource = new MatTableDataSource([])
  }
  
  ngOnInit(): void {
    this.data$.subscribe({
      next: (data: any[]) => {  
        console.log('data', data)
        if (data && data.length > 0) {
          setTimeout(() => {
            if (this.table.showPaginator && this.paginator) {
              this.paginator._intl.itemsPerPageLabel = 'Elemente pro Seite'
              this.paginator._intl.nextPageLabel = 'Nächste'
              this.paginator._intl.previousPageLabel = 'Vorherige'
              this.paginator._intl.getRangeLabel = this.getRangeLabel
              this.dataSource.paginator = this.paginator
            }
  
            if (this.table.sortColumn && this.table.sortStart) {
              if (this.sort != undefined) this.sort.sort(({ id: this.table.sortColumn, start: this.table.sortStart }) as MatSortable)
            }
            this.dataSource.sort = this.sort
            this.dataSource.data = data

            // ToDo: date is hardcoded!
            this.dataSource.sortingDataAccessor = (item: any, property: any) => {
              switch (property) {
                 case 'date': return new Date(item.date)
                 default: return item[property]
              }
            }
  
            this.dataSource.filterPredicate = (data: any, filter: string) => {
              let match: boolean = false
              this.table.columnFilter.forEach((element: string) => {
                match = (match || data[element].trim().toLowerCase().includes(filter)) // ToDo: error on filter "tr" in klarmeldung
              })
              return match
            }
  
            this._dynamicTableService.textFilter$.subscribe((data) => this.textfilter(data))
          }, 20)
        }
      },
      error(err) {
        console.log(err)
      }
    })
  }

  getRangeLabel = (page: number, pageSize: number, length: number): string => {
    const of = "von"
    if (length === 0 || pageSize === 0) {
      return "0 " + of + " " + length
    }
    length = Math.max(length, 0)
    const startIndex = page * pageSize > length ? (Math.ceil(length / pageSize) - 1) * pageSize : page * pageSize

    const endIndex = Math.min(startIndex + pageSize, length)
    return startIndex + 1 + " - " + endIndex + " " + of + " " + length
  }

  updatePaginator() {
    this._changePaginator.next(true)
  }

  isSticky(id: string) {
    const buttonToggleGroup: string[] = ['count', 'name']
    return (buttonToggleGroup || []).indexOf(id) !== -1
  }

  textfilter(filterText: string) {
    this.dataSource.filter = filterText.trim().toLowerCase()
  }

  clickAction(id: string, action: TableActionEnum) {
    this.action.emit({ id, action })
  }
  create() {
    this.action.emit({ id: '', action: TableActionEnum.CREATE })
  }
  edit(row: any) {
    if (!this.isEditableInTable) this.action.emit({ row, action: TableActionEnum.EDIT })
  }
  delete(row: any) {
    this.action.emit({ row, action: TableActionEnum.DELETE })
  }
  check(row: any) {
    this.action.emit({ row, action: TableActionEnum.CHECK })
  }
  checkAll() {
    this.action.emit({ action: TableActionEnum.CHECKALL })
  }
  refresh() {
    this.action.emit({ action: TableActionEnum.REFRESH })
  }
}
