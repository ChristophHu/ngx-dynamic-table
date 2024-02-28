import { TableActionEnum } from "./tableaction.enum";

export interface TableAction {
    name: string,
    icon: string,
    action: TableActionEnum
}

export interface TableActionReturn {
    action: TableActionEnum,
    id?: string
    row?: any
}