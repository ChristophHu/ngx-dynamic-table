/**
 * This enumeration defines all options that will return from table.
 * @enum
 */
export enum TableActionEnum {
    CREATE = 0,
    DELETE = 1,
    EDIT = 2,
    SHOW = 4,
    REFRESH = 8,
    CHECK,
    CHECKALL = 128,
    QRCODE = 16,
    TANK = 32,
    CHECKLIST = 64
}