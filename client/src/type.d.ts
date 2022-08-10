// export interface IModule{
//     '_id': string,
//     name: string
// }
export type RoleApiDataType = {
    role?: IRole,
    roles: IRole[];
}

export interface IRole {
    '_id'?: string,
    name: string,
    type: accessRoleType,
    description?: string
}

export interface IRoleProps {
    role: IRole
}

export type EmployeeApiDataType = {
    employee?: IEmployee,
    employees: IEmployee[]
}

export type LoginApiDataType = {
    token: string,
    employee: Omit<IEmployee, "password">
}

type accessRoleType = "Administrator"| "Manager" | "Employee";

export interface IEmployee {
    '_id'?: string,
    firstName: string,
    middleName?: string,
    lastName: string,
    password?:string,
    role: string,
    checkedIn?: boolean,
    access: {locationId: string}[],
    email?: string,
    phone?: string,
    address?: string
}

export interface IEmployeeProps {
    employee: IEmployee
}

export interface IModule {
    '_id': string,
    moduleName?:string,
    displayName:string
}

export type ModuleApiDataType= {
    modules: IModule[]
}


export type LocationApiDataType = {
    location?: ILocation,
    locations: ILocation[]
}

export interface ILocation {
    '_id'?: string
    name: string,
    isMain?:boolean
}

export interface ILocationProps {
    location: ILocation
}

export type MessageApiDataType = {
    message? : IMessage,
    messages: IMessage[]
}

export interface IMessage {
    '_id'?: string,
    to: string,
    subject:string,
    message: string,
    employee: string,
    date: Date,
    isRead?: boolean,
    isLocked?: boolean,
}

export interface IMessageProps {
    message: IMessage
}


export type EmployeeLogApiDataType = {
    log?: IEmployeeLog,
    logs?: IEmployeeLog[]
}
export interface IEmployeeLog {
    '_id'?: string,
    employee: string,
    checkInTime?: Date,
    checkOutTime?: Date,
    comment?: string,
    reminder?: {
        reminderId:string,
        isCompleted:boolean
    }[]
}

export interface IEmployeeLogProps {
    employeeLog: IEmployeeLog
}

export type OrderCategoryApiDataType = {
    orderCategory?: IOrderCategory,
    orderCategories: IOrderCategory[]
}

export interface IOrderCategory {
    '_id'?: string,
    name: string,
    description? : string
}

export interface IOrderCategoryProps {
    orderCategory : IOrderCategory
}

interface IItem {
    '_id'?:string,
    name: string,
    category: string
}

export type OrderItemApiDataType = {
    orderItem?: IOrderItem,
    orderItems: IOrderItem[]
}

export interface IOrderItem extends IItem {
    description?: string,
    supplier?: string
}

export interface IOrderItemProps {
    orderItem: IOrderItem
}

export type OrderApiDataType = {
    order?: IOrder,
    orders: IOrder[]
}

export interface IOrder {
    '_id'?: string,
    location: string,
    requestDate: Date,
    requestComment? : string,
    fulfilledBy?: string,
    fulfillDate?: Date,
    fulfillComment?: string,
    items: {
        item: string,
        quantity: number,
        employee: string
    }[]
}

export interface IOrderProps {
    order: IOrder 
}

export interface ISupplier {
    '_id'?: string,
    name: string,
    description?: string
}

export type SupplierApiDataType = {
    supplier?:ISupplier,
    suppliers:ISupplier[]
}

export type ShoppingCategoryApiDataType = {
    shoppingCategory?: IShoppingCategory,
    shoppingCategories: IShoppingCategory[]
}

export interface IShoppingCategory {
    '_id'?: string,
    name: string,
    description?: string
}

export interface IShoppingItemProps {
    shoppingItem: IShoppingItem
}

export type ShoppingItemApiDataType = {
    shoppingItem?: IShoppingItem,
    shoppingItems: IShoppingItem[]
}
export interface IShoppingItem extends IItem{
    description?: string,
    orderItem?: string
}

export interface IShoppingListProps {
    shoppingList: IShoppingList
}

export type ShoppingListApiDataType = {
    shoppingList?: IShoppingList,
    shoppingLists: IShoppingList[]
}

export interface IShoppingList {
    '_id': string,
    createdAt?:Date,
    comment?: string,
    items: {
        item: string,
        quantity: number,
        employee: string
    }[]
}

export interface IReminder {
    '_id'?: string,
    description: string,
    role: string
}

export type ReminderApiDataType = {
    reminder?: IReminder,
    reminders: IReminder[]
}

export type SuggestionListType = {
    name:string,
    id:string
}

export type NavListType = {
    id?:string,
    moduleName:ModulesType,
    displayName:string,
    isNotification?:boolean
}

export type ReminderListType = {
    reminder:IReminder,
    isCompleted:boolean
};

export type ItemListType = {
    name:string,
    id:string,
    display:string
}

export type ItemObjectType = {
    [key:string]:{
        quantity?:number,
        employee:string
    }
}

export type CategoryListType = {
    id:string,
    name:string,
    items: ItemListType[]
}

type FieldType = "Single" | "Multi";

export type Field = {
    fieldType:FieldType,
    field: SingleField|MultiField,
    display:string,
    name:string,
    required?:boolean,
    isCensored?:boolean,
    notMatching?:boolean
}

type SingleField = {
    id?:string,
    requireId?:boolean,
    name?: string,
    display?: string,
    value?:string|boolean,
    isError?:boolean
}

type MultiField = {
    name:string,
    list: SingleField[],
    selected?: SingleField,
    isMultiSelect?:boolean
    isError?: boolean
}