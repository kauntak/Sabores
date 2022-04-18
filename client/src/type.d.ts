// export interface IModule{
//     _id: string,
//     name: string
// }
export type RoleApiDataType = {
    role?: IRole,
    roles: IRole[];
}

export interface IRole {
    _id: string,
    name: string,
    description?: string
}

export interface IRoleProps {
    role: IRole
}

export type EmployeeApiDataType = {
    employee?: IEmployee,
    employees: IEmployee[]
}

export interface IEmployee {
    _id: string,
    firstName: string,
    middleName?: string,
    lastName: string,
    role: string,
    access: [{module: string}],
    email?: string,
    phone?: string,
    address?: string
}

export interface IEmployeeProps {
    employee: IEmployee
}

export type LocationApiDataType = {
    location?: ILocation,
    locations: ILocation[]
}

export interface ILocation {
    _id: string
    name: string
}

export interface ILocationProps {
    location: ILocation
}

export type MessageApiDataType = {
    message? : IMessage,
    messages: IMessage[]
}

export interface IMessage {
    _id: string,
    message: string,
    employee: string,
    date: Date
}

export interface IMessageProps {
    message: IMessage
}

export type EmployeeLogApiDataType = {
    employeeLog?: IEmployeeLog,
    employeeLogs: IEmployeeLog[]
}
export interface IEmployeeLog {
    _id: string,
    description: string,
    employee: string,
    checkInTime?: Date,
    checkOutTime?: Date,
    comment?: string,
    reminder?: string
}

export interface IEmployeeLogProps {
    employeeLog: IEmployeeLog
}

export type OrderCategoryApiDataType = {
    orderCategory?: IOrderCategory,
    orderCategories: IOrderCategory[]
}

export interface IOrderCategory {
    _id: string,
    name: string,
    description? : string
}

export interface IOrderCategoryProps {
    orderCategory : IOrderCategory
}

export type OrderItemApiDataType = {
    orderItem?: IOrderItem,
    orderItems: IOrderItem[]
}

export interface IOrderItem {
    _id: string,
    name: string,
    description?: string,
    category: string
}

export interface IOrderItemProps {
    orderItem: IOrderItem
}

export type OrderApiDataType = {
    order?: IOrder,
    orders: IOrder[]
}

export interface IOrder {
    _id: string,
    location: string,
    requestedBy: string,
    requestDate: Date,
    requestComment? : string,
    fulfilledBy?: string,
    fulfillDate?: Date,
    fulfillComment?: string,
    items: [
        {
            item: string,
            quantity: Number
        }
    ]
}

export interface IOrderProps {
    order: IOrder 
}

export type ShoppingCategoryApiDataType = {
    shoppingCategory?: IShoppingCategory,
    shoppingCategories: IShoppingCategory[]
}

export interface IShoppingCategory {
    _id: string,
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
export interface IShoppingItem {
    _id: string,
    category: string,
    name: string,
    description?: string
}

export interface IShoppingListProps {
    shoppingList: IShoppingList
}

export type ShoppingListApiDataType = {
    shoppingList?: IShoppingList,
    shoppingLists: IShoppingList[]
}

export interface IShoppingList {
    _id: string,
    dateCreated:Date,
    comment: string,
    items: [
        {
            item: string,
            quantity: Number,
            employee: string
        }
    ]
}
 