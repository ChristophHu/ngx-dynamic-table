import { animate, sequence, style, transition, trigger } from '@angular/animations'
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, TemplateRef } from '@angular/core'
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
import { TableIconsComponent } from './components/icons/table-icons.component'
import { state } from '@angular/animations'
import { ExpandTemplateService } from './services/expand-template.service'

// export const rowsAnimation = trigger('rowsAnimation', [
//   transition('void => *', [
//     style({ height: '*', opacity: '0', transform: 'translateX(-550px)', 'box-shadow': 'none' }),
//     sequence([
//       animate(".35s ease", style({ height: '*', opacity: '.2', transform: 'translateX(0)', 'box-shadow': 'none'  })),
//       animate(".35s ease", style({ height: '*', opacity: 1, transform: 'translateX(0)' }))
//     ])
//   ])
// ])

/**
 * This component to demonstrate Compodoc documentation.
 * It displays a greeting message.
 * 
 * @example
 * <dynamic-table [table]="table" [data$]="data$" [pageSize]="4" (action)="returnTableAction($event)" [isEditableInTable]="true"></dynamic-table>
 */
@Component({
  selector: 'dynamic-table',
  standalone: true,
  imports: [
    CommonModule,
    DynamicPipe,
    FormsModule,
    TableIconsComponent,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MobilePaginationDirective,
    ReactiveFormsModule,
    ScrollIndicatorComponent
  ],
  templateUrl: './ngx-dynamic-table.component.html',
  styleUrls: ['./ngx-dynamic-table.component.sass'],
  animations: [
    trigger('collapse', [
      state('true', style({ height: '*' })),
      state('false', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate('300ms ease')),
      transition('true => false', animate('300ms ease'))
    ])
  ],
})
export class NgxDynamicTableComponent implements OnInit {
  /**
   * The name to be displayed in the greeting.
   * @type {string}
   */
  @Input() tableoptions!: Tableoptions
  @Input() data$!: Observable<any[]>
  @Input() isEditableInTable: boolean = false
  @Input() pageSize: number = 10
  @Output() action: EventEmitter<TableActionReturn> = new EventEmitter<TableActionReturn>()

  // expandable
  // columnsToDisplayWithExpand = ['expand']
  expandedElement: any

  /**
   * @description default class of NgxDynamicTableComponent
   * @memberof NgxDynamicTableComponent
   */
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
  isInitialized: boolean = false

  constructor(private _dynamicTableService: DynamicTableService, private _expandTemplateService: ExpandTemplateService) {
    this.dataSource = new MatTableDataSource([])
  }
  
  ngOnInit(): void {
    this.data$.subscribe({
      next: (data: any[]) => {  
        // console.log('data', data)
        if (data && data.length > 0) {
          setTimeout(() => {
            this.setTableColumnNames(data[0])
            
            if (this.tableoptions.paginator && this.paginator) {
              this.paginator._intl.itemsPerPageLabel = 'Elemente pro Seite'
              this.paginator._intl.nextPageLabel = 'Nächste'
              this.paginator._intl.previousPageLabel = 'Vorherige'
              this.paginator._intl.getRangeLabel = this.getRangeLabel
              this.dataSource.paginator = this.paginator
            }
  
            if (this.tableoptions.sortColumn && this.tableoptions.sortStart && !this.isInitialized) {
              if (this.sort != undefined) this.sort.sort(({ id: this.tableoptions.sortColumn, start: this.tableoptions.sortStart }) as MatSortable)
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
              this.tableoptions.columnFilter?.forEach((element: string) => {
                match = (match || data[element].trim().toLowerCase().includes(filter)) // ToDo: error on filter "tr" in klarmeldung
              })
              return match
            }
  
            this._dynamicTableService.textFilter$.subscribe((data) => this.textfilter(data))
          }, 20)
          this.isInitialized = true
        }
      },
      error(err) {
        console.log(err)
      }
    })
  }

  setTableColumnNames(data: any): void {
    if (!this.tableoptions.columnNames) this.tableoptions.columnNames = Object.keys(data)
    if (this.tableoptions.checkbox) this.tableoptions.columnNames = ['checkbox', ...this.tableoptions.columnNames]
    if (this.tableoptions.count) this.tableoptions.columnNames = ['count', ...this.tableoptions.columnNames]
    if (this.tableoptions.unread) this.tableoptions.columnNames = ['unread', ...this.tableoptions.columnNames]
    if (this.tableoptions.sortRowManual) this.tableoptions.columnNames = ['sortrow', ...this.tableoptions.columnNames]
    if (this.tableoptions.isExpandable) this.tableoptions.columnNames = [...this.tableoptions.columnNames, 'expand']
    console.log('setTableColumnNames', this.tableoptions.columnNames)
    this.tableoptions.columnNames = [...new Set(this.tableoptions.columnNames)]
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
    const buttonToggleGroup: string[] = ['checkbox', 'count', 'name']
    return (buttonToggleGroup || []).indexOf(id) !== -1
  }

  expand(el: any) {
    this.expandedElement = this.expandedElement === el ? null : el
  }
  getExpandTemplate(temp: string): TemplateRef<any> {
    return this._expandTemplateService.get(temp)
  }

  /**
   * Set the datasource.filter to filter in table.
   *
   * @param filterText - Text to filter in table.
   */
  textfilter(filterText: string) {
    this.dataSource.filter = filterText.trim().toLowerCase()
  }

  /**
   * This function returns to returnTableAction by using @Output().
   * @param {string}  id - element.id.
   * @param {enum}    action - action enum.
   * 
   * @example:
   * <button mat-menu-item class="!flex items-center" (click)="clickAction(element.id, action.action)">
   */
  clickAction(id: string, action: TableActionEnum) {
    this.action.emit({ id, action })
  }

  /**
   * Emits a corresponding event to create an new row.
   */
  create() {
    this.action.emit({ id: '', action: TableActionEnum.CREATE })
  }
  /**
   * Emits a corresponding event to edit an row.
   * @param {string} row - The selected row.
   */
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
