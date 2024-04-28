import { TableAction } from "./tableaction.model"
import { Column } from "./column.model"

export interface Tableoptions {
    columns         : Column[]
    columnNames?    : string[]
    actions?        : TableAction[]
    columnFilter?   : string[]
    isExpandable?   : boolean
    showCheckbox?   : boolean
    showCount?      : boolean
    showPaginator?  : boolean
    showUnread?     : boolean
    sortColumn?     : string
    sortStart?      : 'asc' | 'desc'
}