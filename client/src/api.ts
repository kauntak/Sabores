import axios, {AxiosResponse} from "axios";
import { IError, returnError } from "./error";
import { EmployeeApiDataType, EmployeeLogApiDataType, IEmployee, IEmployeeLog, ILocation, IMessage, IOrder, IOrderCategory, IOrderItem, IRole, IShoppingCategory, IShoppingItem, IShoppingList, LocationApiDataType, MessageApiDataType, OrderApiDataType, OrderCategoryApiDataType, OrderItemApiDataType, RoleApiDataType, ShoppingCategoryApiDataType, ShoppingItemApiDataType, ShoppingListApiDataType } from "./type";

const url: string = "http://localhost:3000/api";

export const getRole = async (_id: string|null): Promise<AxiosResponse<RoleApiDataType>|IError> => {
    try {
        if(_id == null) _id = "all";
        const roles: AxiosResponse<RoleApiDataType> = await axios.get(`${url}/getRole/${_id}`);
        return roles;
    } catch(error) {
        return returnError(error);
    }
}

export const getEmployee = async(_id:string|null):Promise<AxiosResponse<EmployeeApiDataType>|IError> => {
    try {
        if(_id == null) _id = "all";
        const employee: AxiosResponse<EmployeeApiDataType> = await axios.get(`${url}/getEmployee/${_id}`);
        return employee;
    } catch(error) {
        return returnError(error);
    }
}

export const getEmployeeLog = async(_id:string|null):Promise<AxiosResponse<EmployeeLogApiDataType>|IError> => {
    try {
        if(_id == null) _id = "all";
        const log: AxiosResponse<EmployeeLogApiDataType> = await axios.get(`${url}/getEmployeeLog/${_id}`);
        return log;
    } catch(error) {
        return returnError(error);
    }
}

export const getLocation = async(_id:string|null):Promise<AxiosResponse<LocationApiDataType>|IError> => {
    try {
        if(_id == null) _id = "all";
        const location: AxiosResponse<LocationApiDataType> = await axios.get(`${url}/getLocation/${_id}`);
        return location;
    } catch(error) {
        return returnError(error);
    }
}

export const getMessage = async(_id:string|null):Promise<AxiosResponse<MessageApiDataType>|IError> => {
    try {
        if(_id == null) _id = "all";
        const message: AxiosResponse<MessageApiDataType> = await axios.get(`${url}/getMessage/${_id}`);
        return message;
    } catch(error) {
        return returnError(error);
    }
}

// export const getModule = async(_id:string|null):Promise<AxiosResponse<ModuleApiDataTyp>|IError> => {
//     try {
//         if(_id == null) _id = "all";
//         const module: AxiosResponse<ModuleApiDataType> = await axios.get(`${url}/getModule/${_id}`);
//         return module;
//     } catch(error) {
//         return returnError(error);
//     }
// }

export const getOrderCategory = async(_id:string|null):Promise<AxiosResponse<OrderCategoryApiDataType>|IError> => {
    try {
        if(_id == null) _id = "all";
        const category: AxiosResponse<OrderCategoryApiDataType> = await axios.get(`${url}/getOrderCategory/${_id}`);
        return category;
    } catch(error) {
        return returnError(error);
    }
}

export const getOrderItem = async(_id:string|null):Promise<AxiosResponse<OrderItemApiDataType>|IError> => {
    try {
        if(_id == null) _id = "all";
        const item: AxiosResponse<OrderItemApiDataType> = await axios.get(`${url}/getOrderItem/${_id}`);
        return item;
    } catch(error) {
        return returnError(error);
    }
}

export const getOrder = async(_id:string|null):Promise<AxiosResponse<OrderApiDataType>|IError> => {
    try {
        if(_id == null) _id = "all";
        const order: AxiosResponse<OrderApiDataType> = await axios.get(`${url}/getOrder/${_id}`);
        return order;
    } catch(error) {
        return returnError(error);
    }
}

export const getShoppingCategory = async(_id:string|null):Promise<AxiosResponse<ShoppingCategoryApiDataType>|IError> => {
    try {
        if(_id == null) _id = "all";
        const category: AxiosResponse<ShoppingCategoryApiDataType> = await axios.get(`${url}/getShoppingCategory/${_id}`);
        return category;
    } catch(error) {
        return returnError(error);
    }
}

export const getShoppingItem = async(_id:string|null):Promise<AxiosResponse<ShoppingItemApiDataType>|IError> => {
    try {
        if(_id == null) _id = "all";
        const item: AxiosResponse<ShoppingItemApiDataType> = await axios.get(`${url}/getShoppingItem/${_id}`);
        return item;
    } catch(error) {
        return returnError(error);
    }
}

export const getShoppingList = async(_id:string|null):Promise<AxiosResponse<ShoppingListApiDataType>|IError> => {
    try {
        if(_id == null) _id = "all";
        const list: AxiosResponse<ShoppingListApiDataType> = await axios.get(`${url}/getShoppingList/${_id}`);
        return list;
    } catch(error) {
        return returnError(error);
    }
}


export const createRole = async(formData:Omit<IRole, "_id">):Promise<AxiosResponse<RoleApiDataType>|IError> => {
    try {
        const role: Omit<IRole, "_id"> = formData;
        const savedRole: AxiosResponse<RoleApiDataType> = await axios.post(`${url}/createRole`, role);
        return savedRole;
    } catch(error) {
        return returnError(error);
    }
}

export const createEmployee = async(formData:Omit<IEmployee, "_id">):Promise<AxiosResponse<EmployeeApiDataType>|IError> => {
    try {
        const newEmployee: Omit<IEmployee, "_id"> = formData;
        const employee: AxiosResponse<EmployeeApiDataType> = await axios.post(`${url}/createEmployee`, newEmployee);
        return employee;
    } catch(error) {
        return returnError(error);
    }
}

export const createLocation = async(formData:Omit<ILocation, "_id">):Promise<AxiosResponse<LocationApiDataType>|IError> => {
    try {
        const newLocation: Omit<ILocation, "_id"> = formData;
        const location: AxiosResponse<LocationApiDataType> = await axios.post(`${url}/create`, newLocation);
        return location;
    } catch(error) {
        return returnError(error);
    }
}

export const createMessage = async(formData:Omit<IMessage, "_id">):Promise<AxiosResponse<MessageApiDataType>|IError> => {
    try {
        const newMessage: Omit<IMessage, "_id"> = formData;
        const message: AxiosResponse<MessageApiDataType> = await axios.post(`${url}/createMessage`, newMessage);
        return message;
    } catch(error) {
        return returnError(error);
    }
}

export const createEmployeeLog = async(formData:Omit<IEmployeeLog, "_id">):Promise<AxiosResponse<EmployeeLogApiDataType>|IError> => {
    try {
        const newEmployeeLog: Omit<IEmployeeLog, "_id"> = formData;
        const log: AxiosResponse<EmployeeLogApiDataType> = await axios.post(`${url}/createEmployeeLog`, newEmployeeLog);
        return log;
    } catch(error) {
        return returnError(error);
    }
}

export const createOrderCategory = async(formData:Omit<IOrderCategory, "_id">):Promise<AxiosResponse<OrderCategoryApiDataType>|IError> => {
    try {
        const newOrderCategory: Omit<IOrderCategory, "_id"> = formData;
        const category: AxiosResponse<OrderCategoryApiDataType> = await axios.post(`${url}/createOrderCategory`, newOrderCategory);
        return category;
    } catch(error) {
        return returnError(error);
    }
}

export const createOrderItem = async(formData:Omit<IOrderItem, "_id">):Promise<AxiosResponse<OrderItemApiDataType>|IError> => {
    try {
        const newOrderItem: Omit<IOrderItem, "_id"> = formData;
        const item: AxiosResponse<OrderItemApiDataType> = await axios.post(`${url}/createOrderItem`, newOrderItem);
        return item;
    } catch(error) {
        return returnError(error);
    }
}

export const createOrder = async(formData:Omit<IOrder, "_id">):Promise<AxiosResponse<OrderApiDataType>|IError> => {
    try {
        const newOrder: Omit<IOrder, "_id"> = formData;
        const order: AxiosResponse<OrderApiDataType> = await axios.post(`${url}/createOrder`, newOrder);
        return order;
    } catch(error) {
        return returnError(error);
    }
}

export const createShoppingCategory = async(formData:Omit<IShoppingCategory, "_id">):Promise<AxiosResponse<ShoppingCategoryApiDataType>|IError> => {
    try {
        const newShoppingCategory: Omit<IShoppingCategory, "_id"> = formData;
        const category: AxiosResponse<ShoppingCategoryApiDataType> = await axios.post(`${url}/createShoppingCategory`, newShoppingCategory);
        return category;
    } catch(error) {
        return returnError(error);
    }
}

export const createShoppingItem = async(formData:Omit<IShoppingItem, "_id">):Promise<AxiosResponse<ShoppingItemApiDataType>|IError> => {
    try {
        const newShoppingItem: Omit<IShoppingItem, "_id"> = formData;
        const item: AxiosResponse<ShoppingItemApiDataType> = await axios.post(`${url}/createShoppingItem`, newShoppingItem);
        return item;
    } catch(error) {
        return returnError(error);
    }
}

export const createShoppingList = async(formData:Omit<IShoppingList, "_id">):Promise<AxiosResponse<ShoppingListApiDataType>|IError> => {
    try {
        const newShoppingList: Omit<IShoppingList, "_id"> = formData;
        const list: AxiosResponse<ShoppingListApiDataType> = await axios.post(`${url}/createShoppingList`, newShoppingList);
        return list;
    } catch(error) {
        return returnError(error);
    }
}

export const updateRole = async(role: IRole): Promise<AxiosResponse<RoleApiDataType>|IError> => {
    try{
        const updatedRole: AxiosResponse<RoleApiDataType> = await axios.put(`${url}/updateRole/${role._id}`, role);
        return updatedRole;
    } catch(error) {
        return returnError(error);
    }
}

export const updateEmployee = async(employee: IEmployee): Promise<AxiosResponse<EmployeeApiDataType>|IError> => {
    try{
        const updatedEmployee: AxiosResponse<EmployeeApiDataType> = await axios.put(`${url}/updateEmployee/${employee._id}`, employee);
        return updatedEmployee;
    } catch(error) {
        return returnError(error);
    }
}

export const updateLocation = async(location: ILocation): Promise<AxiosResponse<LocationApiDataType>|IError> => {
    try{
        const updatedLocation: AxiosResponse<LocationApiDataType> = await axios.put(`${url}/updateLocation/${location._id}`, location);
        return updatedLocation;
    } catch(error) {
        return returnError(error);
    }
}

export const updateMessage = async(message: IMessage): Promise<AxiosResponse<MessageApiDataType>|IError> => {
    try{
        const updatedMessage: AxiosResponse<MessageApiDataType> = await axios.put(`${url}/updateMessage/${message._id}`, message);
        return updatedMessage;
    } catch(error) {
        return returnError(error);
    }
}

export const updateEmployeeLog = async(log: IEmployeeLog): Promise<AxiosResponse<EmployeeLogApiDataType>|IError> => {
    try{
        const updatedEmployeeLog: AxiosResponse<EmployeeLogApiDataType> = await axios.put(`${url}/updateEmployeeLog/${log._id}`, log);
        return updatedEmployeeLog;
    } catch(error) {
        return returnError(error);
    }
}

export const updateOrderCategory = async(category: IOrderCategory): Promise<AxiosResponse<OrderCategoryApiDataType>|IError> => {
    try{
        const updatedOrderCategory: AxiosResponse<OrderCategoryApiDataType> = await axios.put(`${url}/updateOrderCategory/${category._id}`, category);
        return updatedOrderCategory;
    } catch(error) {
        return returnError(error);
    }
}

export const updateOrderItem = async(item: IOrderItem): Promise<AxiosResponse<OrderItemApiDataType>|IError> => {
    try{
        const updatedOrderItem: AxiosResponse<OrderItemApiDataType> = await axios.put(`${url}/updateOrderItem/${item._id}`, item);
        return updatedOrderItem;
    } catch(error) {
        return returnError(error);
    }
}

export const updateOrder = async(order: IOrder): Promise<AxiosResponse<OrderApiDataType>|IError> => {
    try{
        const updatedOrder: AxiosResponse<OrderApiDataType> = await axios.put(`${url}/updateOrder/${order._id}`, order);
        return updatedOrder;
    } catch(error) {
        return returnError(error);
    }
}

export const updateShoppingCategory = async(category: IShoppingCategory): Promise<AxiosResponse<ShoppingCategoryApiDataType>|IError> => {
    try{
        const updatedShoppingCategory: AxiosResponse<ShoppingCategoryApiDataType> = await axios.put(`${url}/updateShoppingCategory/${category._id}`,category);
        return updatedShoppingCategory;
    } catch(error) {
        return returnError(error);
    }
}

export const updateShoppingItem = async(item: IShoppingItem): Promise<AxiosResponse<ShoppingItemApiDataType>|IError> => {
    try{
        const updatedShoppingItem: AxiosResponse<ShoppingItemApiDataType> = await axios.put(`${url}/updateShoppingItem/${item._id}`, item);
        return updatedShoppingItem;
    } catch(error) {
        return returnError(error);
    }
}

export const updateShoppingList = async(list: IShoppingList): Promise<AxiosResponse<ShoppingListApiDataType>|IError> => {
    try{
        const updatedShoppingList: AxiosResponse<ShoppingListApiDataType> = await axios.put(`${url}/updateShoppingList/${list._id}`, list);
        return updatedShoppingList;
    } catch(error) {
        return returnError(error);
    }
}

export const deleteRole = async (_id:string):Promise<AxiosResponse<RoleApiDataType>|IError> => {
    try {
        const deletedRole: AxiosResponse<RoleApiDataType> = await axios.delete(`${url}/deleteRole/${_id}`);
        return deletedRole;
    } catch(error) {
        return returnError(error);
    }
}

export const deleteEmployee = async (_id:string):Promise<AxiosResponse<EmployeeApiDataType>|IError> => {
    try {
        const deleted: AxiosResponse<EmployeeApiDataType> = await axios.delete(`${url}/deleteEmployee/${_id}`);
        return deleted;
    } catch(error) {
        return returnError(error);
    }
}

export const deleteLocation = async (_id:string):Promise<AxiosResponse<LocationApiDataType>|IError> => {
    try {
        const deleted: AxiosResponse<LocationApiDataType> = await axios.delete(`${url}/deleteLocation/${_id}`);
        return deleted;
    } catch(error) {
        return returnError(error);
    }
}

export const deleteMessage = async (_id:string):Promise<AxiosResponse<MessageApiDataType>|IError> => {
    try {
        const deleted: AxiosResponse<MessageApiDataType> = await axios.delete(`${url}/deleteMessage/${_id}`);
        return deleted;
    } catch(error) {
        return returnError(error);
    }
}

export const deleteEmployeeLog = async (_id:string):Promise<AxiosResponse<EmployeeLogApiDataType>|IError> => {
    try {
        const deleted: AxiosResponse<EmployeeLogApiDataType> = await axios.delete(`${url}/deleteEmployeeLog/${_id}`);
        return deleted;
    } catch(error) {
        return returnError(error);
    }
}

export const deleteOrderCategory = async (_id:string):Promise<AxiosResponse<OrderCategoryApiDataType>|IError> => {
    try {
        const deleted: AxiosResponse<OrderCategoryApiDataType> = await axios.delete(`${url}/deleteOrderCategory/${_id}`);
        return deleted;
    } catch(error) {
        return returnError(error);
    }
}

export const deleteOrderItem = async (_id:string):Promise<AxiosResponse<OrderItemApiDataType>|IError> => {
    try {
        const deleted: AxiosResponse<OrderItemApiDataType> = await axios.delete(`${url}/deleteOrderItem/${_id}`);
        return deleted;
    } catch(error) {
        return returnError(error);
    }
}

export const deleteOrder = async (_id:string):Promise<AxiosResponse<OrderApiDataType>|IError> => {
    try {
        const deleted: AxiosResponse<OrderApiDataType> = await axios.delete(`${url}/deleteOrder/${_id}`);
        return deleted;
    } catch(error) {
        return returnError(error);
    }
}

export const deleteShoppingCategory = async (_id:string):Promise<AxiosResponse<ShoppingCategoryApiDataType>|IError> => {
    try {
        const deleted: AxiosResponse<ShoppingCategoryApiDataType> = await axios.delete(`${url}/deleteShoppingCategory/${_id}`);
        return deleted;
    } catch(error) {
        return returnError(error);
    }
}

export const deleteShoppingItem = async (_id:string):Promise<AxiosResponse<ShoppingItemApiDataType>|IError> => {
    try {
        const deleted: AxiosResponse<ShoppingItemApiDataType> = await axios.delete(`${url}/deleteShoppingItem/${_id}`);
        return deleted;
    } catch(error) {
        return returnError(error);
    }
}

export const deleteShoppingList = async (_id:string):Promise<AxiosResponse<ShoppingListApiDataType>|IError> => {
    try {
        const deleted: AxiosResponse<ShoppingListApiDataType> = await axios.delete(`${url}/deleteShoppingList/${_id}`);
        return deleted;
    } catch(error) {
        return returnError(error);
    }
}