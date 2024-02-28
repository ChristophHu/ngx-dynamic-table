export interface Column {
    id: string,
    name: string,
    header: string,
    cell: string,
    hidden: boolean,
    sortable: boolean,
    disabled?: boolean,
    pipe?: { name: any, args: string }
    type?: 'checkbox' | 'datetime-local'
}