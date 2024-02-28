import { TableAction } from "./tableaction.model"
import { Column } from "./column.model"

export interface Tableoptions {
    actions?: TableAction[]
    columns: Column[]
    columnFilter: string[]
    columnNames: string[]
    showCount?: boolean
    showPaginator?: boolean
    sortColumn?: string
    sortStart?: 'asc' | 'desc'
}