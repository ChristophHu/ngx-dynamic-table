import { animate, sequence, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Tableoptions } from './models/tableoptions.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { TableActionReturn } from './models/tableaction.model';
import { MatSort, MatSortModule, MatSortable } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DynamicTableService } from './services/dynamic-table.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TableActionEnum } from './models/tableaction.enum';
import { CommonModule } from '@angular/common';
import { DynamicPipe } from './pipes/dynamic/dynamic.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu'
import { ScrollIndicatorComponent } from './components/scroll-indicator/scroll-indicator.component';
import { StickyDirective } from './directives/sticky/sticky.directive';

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
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
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
  @Input() isClickable: boolean = true
  @Output() action: EventEmitter<TableActionReturn> = new EventEmitter<TableActionReturn>()

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator | null
  @ViewChild(MatSort) sort!: MatSort

  private readonly _changePaginator = new BehaviorSubject<boolean>(false)
  changePaginator$: Observable<boolean> = this._changePaginator.asObservable()

  dataSource: any

  pageSize: number = 20
  pageSizeOptions: number[] = [5, 10, 15, 20, 50, 100]

  isEditable$: Observable<boolean> = this._dynamicTableService.isEditable$

  constructor(private _dynamicTableService: DynamicTableService) {
    this.dataSource = new MatTableDataSource([])
  }
  
  ngOnInit(): void {
    this.data$.subscribe({
      next: (data: any[]) => {  
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
            this.dataSource.data = data;

            // ToDo: date is hardcoded!
            this.dataSource.sortingDataAccessor = (item: any, property: any) => {
              switch (property) {
                 case 'date': return new Date(item.date);
                 default: return item[property];
              }
            };
  
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

  clickAction(id: string, action: TableActionEnum) {
    this.action.emit({ id, action })
  }

  isSticky(id: string) {
    const buttonToggleGroup: string[] = ['count', 'name']
    return (buttonToggleGroup || []).indexOf(id) !== -1;
  }

  textfilter(filterText: string) {
    this.dataSource.filter = filterText.trim().toLowerCase()
  }

  show(row: any) {
    if (this.isClickable) {
      let action: TableActionEnum = 2
      this.action.emit({ row, action })
    }
  }
  create() {
    let action: TableActionEnum = 0
    this.action.emit({ id: '', action })
  }

}
