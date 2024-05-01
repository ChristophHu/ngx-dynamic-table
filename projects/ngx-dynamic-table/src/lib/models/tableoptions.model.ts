import { TableAction } from "./tableaction.model"
import { Column } from "./column.model"

export interface Tableoptions {
    columns         : Column[]
    columnNames?    : string[]
    actions?        : TableAction[]
    columnFilter?   : string[]
    isExpandable?   : boolean
    checkbox?       : boolean | { show: boolean, sticky: boolean }
    count?          : boolean | { show: boolean, sticky: boolean }
    paginator?      : boolean | { show: boolean, position: 'start' | 'end' }
    sortRowManual?  : boolean | { show: boolean, sticky: boolean }
    unread?         : boolean | { show: boolean, sticky: boolean }
    sortColumn?     : string
    sortStart?      : 'asc' | 'desc'
}