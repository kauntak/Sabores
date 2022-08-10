import axios, {AxiosResponse} from "axios";
import Module from "module";
import { IError, returnError } from "./error";
import { EmployeeApiDataType, EmployeeLogApiDataType, IEmployee, IEmployeeLog, ILocation, IMessage, IOrder, IOrderCategory, IOrderItem, IRole, IShoppingCategory, IShoppingItem, IShoppingList, LocationApiDataType, MessageApiDataType, OrderApiDataType, OrderCategoryApiDataType, OrderItemApiDataType, RoleApiDataType, ShoppingCategoryApiDataType, ShoppingItemApiDataType, ShoppingListApiDataType, IReminder, ReminderApiDataType, LoginApiDataType, ModuleApiDataType, IModule, ISupplier, SupplierApiDataType } from "./type";
import { getToken } from "./App";


const url: string = "http://localhost:8080/api";

async function getHeaders() {
    const token = await getToken();
    return {
        headers: {
            "x-access-token":token
        }
    }
}

export const createEmployee = async(formData:Omit<IEmployee, "_id">):Promise<EmployeeApiDataType> => {
    try {
        const newEmployee: Omit<IEmployee, "_id"> = formData;
        const employee: AxiosResponse<EmployeeApiDataType|IError> = await axios.post(`${url}/createEmployee`, newEmployee, await getHeaders());
        const error = (employee.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return employee.data as EmployeeApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const updateEmployee = async(employee: IEmployee): Promise<EmployeeApiDataType> => {
    try{
        if(employee.password===undefined || employee.password===""){
            var {password, ...newEmployee} = employee;
        } else newEmployee = employee;
        const updatedEmployee: AxiosResponse<EmployeeApiDataType|IError> = await axios.put(`${url}/updateEmployee/${employee._id}`, newEmployee, await getHeaders());
        const error = (updatedEmployee.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return updatedEmployee.data as EmployeeApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getEmployees = async():Promise<EmployeeApiDataType> => {
    try {
        const employee: AxiosResponse<EmployeeApiDataType|IError> = await axios.get(`${url}/getEmployees`);
        const error = (employee.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return employee.data as EmployeeApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getEmployee = async(_id:string):Promise<EmployeeApiDataType> => {
    try {
        const employee: AxiosResponse<EmployeeApiDataType|IError> = await axios.get(`${url}/getEmployee/${_id}`, await getHeaders());
        const error = (employee.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return employee.data as EmployeeApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const deleteEmployee = async (_id:string):Promise<EmployeeApiDataType> => {
    try {
        const deleted: AxiosResponse<EmployeeApiDataType|IError> = await axios.delete(`${url}/deleteEmployee/${_id}`, await getHeaders());
        const error = (deleted.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return deleted.data as EmployeeApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const authenticateEmployee = async (id:string, password:string):Promise<LoginApiDataType> => {
    try {
        const body = {
            id,
            password
        }
        const token: AxiosResponse<LoginApiDataType|IError> = await axios.post(`${url}/authenticateEmployee`, body);
        console.log("token", token);
        const error = (token.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return token.data as LoginApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}



export const createEmployeeLog = async(formData:Omit<IEmployeeLog, "_id">):Promise<EmployeeLogApiDataType> => {
    try {
        const newEmployeeLog: Omit<IEmployeeLog, "_id"> = formData;
        const log: AxiosResponse<EmployeeLogApiDataType|IError> = await axios.post(`${url}/createEmployeeLog`, newEmployeeLog, await getHeaders());
        const error = (log.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return log.data as EmployeeLogApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const updateEmployeeLog = async(log: IEmployeeLog): Promise<EmployeeLogApiDataType> => {
    try{
        const updatedEmployeeLog: AxiosResponse<EmployeeLogApiDataType|IError> = await axios.put(`${url}/updateEmployeeLog/${log._id}`, log, await getHeaders());
        const error = (updatedEmployeeLog.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return updatedEmployeeLog.data as EmployeeLogApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getEmployeeLogs = async():Promise<EmployeeLogApiDataType> => {
    try {
        const log: AxiosResponse<EmployeeLogApiDataType|IError> = await axios.get(`${url}/getEmployeeLogs`, await getHeaders());
        const error = (log.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return log.data as EmployeeLogApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getEmployeesLog = async(_id:string):Promise<EmployeeLogApiDataType> => {
    try {
        const log: AxiosResponse<EmployeeLogApiDataType|IError> = await axios.get(`${url}/getEmployeesLog/${_id}`, await getHeaders());
        const error = (log.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return log.data as EmployeeLogApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getEmployeesMostRecentLog = async(_id:string):Promise<EmployeeLogApiDataType> => {
    try {
        const log: AxiosResponse<EmployeeLogApiDataType|IError> = await axios.get(`${url}/getEmployeesMostRecentLog/${_id}`, await getHeaders());
        const error = (log.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return log.data as EmployeeLogApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getEmployeeLogsByDateRange = async(start:Date|null, end:Date|null):Promise<EmployeeLogApiDataType> => {
    try {
        const log: AxiosResponse<EmployeeLogApiDataType|IError> = await axios.get(`${url}/getEmployeeLogsByDateRange/start/${start?start.getTime():0}/end/${end?end.getTime():0}/`, await getHeaders());
        const error = (log.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return log.data as EmployeeLogApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const deleteEmployeeLog = async (_id:string):Promise<EmployeeLogApiDataType> => {
    try {
        const deleted: AxiosResponse<EmployeeLogApiDataType|IError> = await axios.delete(`${url}/deleteEmployeeLog/${_id}`, await getHeaders());
        const error = (deleted.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return deleted.data as EmployeeLogApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}





export const createLocation = async(formData:Omit<ILocation, "_id">):Promise<LocationApiDataType> => {
    try {
        const newLocation: Omit<ILocation, "_id"> = formData;
        const location: AxiosResponse<LocationApiDataType|IError> = await axios.post(`${url}/createLocation`, newLocation, await getHeaders());
        const error = (location.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return location.data as LocationApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const updateLocation = async(location: ILocation): Promise<LocationApiDataType> => {
    try{
        const updatedLocation: AxiosResponse<LocationApiDataType|IError> = await axios.put(`${url}/updateLocation/${location._id}`, location, await getHeaders());
        const error = (updatedLocation.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return updatedLocation.data as LocationApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getLocations = async():Promise<LocationApiDataType> => {
    try {
        let headers = await getHeaders();
        while(headers.headers["x-access-token"] === ""){
            headers = await getHeaders();
        }
        const location: AxiosResponse<LocationApiDataType|IError> = await axios.get(`${url}/getLocations`, headers);
        const error = (location.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return location.data as LocationApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const deleteLocation = async (_id:string):Promise<LocationApiDataType> => {
    try {
        const deleted: AxiosResponse<LocationApiDataType|IError> = await axios.delete(`${url}/deleteLocation/${_id}`, await getHeaders());
        const error = (deleted.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return deleted.data as LocationApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}


export const createMessage = async(formData:Omit<IMessage, "_id">):Promise<MessageApiDataType> => {
    try {
        const newMessage: Omit<IMessage, "_id"> = formData;
        const message: AxiosResponse<MessageApiDataType|IError> = await axios.post(`${url}/createMessage`, newMessage, await getHeaders());
        const error = (message.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return message.data as MessageApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const updateMessage = async(message: IMessage): Promise<MessageApiDataType> => {
    try{
        const updatedMessage: AxiosResponse<MessageApiDataType|IError> = await axios.put(`${url}/updateMessage/${message._id}`, message, await getHeaders());
        const error = (updatedMessage.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return updatedMessage.data as MessageApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const readMessage = async(_id:string): Promise<MessageApiDataType> => {
    try{
        const updatedMessage: AxiosResponse<MessageApiDataType|IError> = await axios.put(`${url}/readMessage/${_id}`, await getHeaders());
        const error = (updatedMessage.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return updatedMessage.data as MessageApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const lockMessage = async(_id:string): Promise<MessageApiDataType> => {
    try{
        const updatedMessage: AxiosResponse<MessageApiDataType|IError> = await axios.put(`${url}/lockMessage/${_id}`, await getHeaders());
        const error = (updatedMessage.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return updatedMessage.data as MessageApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const unlockMessage = async(_id:string): Promise<MessageApiDataType> => {
    try{
        const updatedMessage: AxiosResponse<MessageApiDataType|IError> = await axios.put(`${url}/unlockMessage/${_id}`, await getHeaders());
        const error = (updatedMessage.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return updatedMessage.data as MessageApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getMessage = async(_id:string):Promise<MessageApiDataType> => {
    try {
        const message: AxiosResponse<MessageApiDataType|IError> = await axios.get(`${url}/getMessage/${_id}`, await getHeaders());
        const error = (message.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return message.data as MessageApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getMessagesByEmployee = async(_id:string):Promise<MessageApiDataType> => {
    try {
        const message: AxiosResponse<MessageApiDataType|IError> = await axios.get(`${url}/getMessagesByEmployee/${_id}`, await getHeaders());
        const error = (message.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return message.data as MessageApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getMessagesByDateRange = async(start:Date|null, end:Date|null):Promise<MessageApiDataType> => {
    try {
        const message: AxiosResponse<MessageApiDataType|IError> = await axios.get(`${url}/getMessagesByDateRange/start/${start?start.getTime():0}/end/${end?end.getTime():0}`, await getHeaders());
        const error = (message.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return message.data as MessageApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const deleteMessage = async (_id:string):Promise<MessageApiDataType> => {
    try {
        const deleted: AxiosResponse<MessageApiDataType|IError> = await axios.delete(`${url}/deleteMessage/${_id}`, await getHeaders());
        const error = (deleted.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return deleted.data as MessageApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}


export const createModule = async(formData:Omit<IModule, "_id">):Promise<ModuleApiDataType> => {
    try {
        const newModule: Omit<IModule, "_id"> = formData;
        newModule.moduleName = newModule.displayName.replace(/\s/g, "");
        const module: AxiosResponse<ModuleApiDataType|IError> = await axios.post(`${url}/createModule`, newModule, await getHeaders());
        const error = (module.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return module.data as ModuleApiDataType;
    } catch(error) {
        throw new Error(String(error))
    }
}

export const getModules = async():Promise<ModuleApiDataType> => {
    try {
        const module: AxiosResponse<ModuleApiDataType|IError> = await axios.get(`${url}/getModules`, await getHeaders());
        const error = (module.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return module.data as ModuleApiDataType;
    } catch(error) {
        throw new Error(String(error))
    }
}



export const createOrder = async(formData:Omit<IOrder, "_id">):Promise<OrderApiDataType> => {
    try {
        const newOrder: Omit<IOrder, "_id"> = formData;
        const order: AxiosResponse<OrderApiDataType|IError> = await axios.post(`${url}/createOrder`, newOrder, await getHeaders());
        const error = (order.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return order.data as OrderApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const updateOrder = async(order: IOrder): Promise<OrderApiDataType> => {
    try{
        const updatedOrder: AxiosResponse<OrderApiDataType|IError> = await axios.put(`${url}/updateOrder/${order._id}`, order, await getHeaders());
        const error = (updatedOrder.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return updatedOrder.data as OrderApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getOrders = async(_id:string):Promise<OrderApiDataType> => {
    try {
        const order: AxiosResponse<OrderApiDataType|IError> = await axios.get(`${url}/getOrders`, await getHeaders());
        const error = (order.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return order.data as OrderApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getOrder = async(_id:string):Promise<OrderApiDataType> => {
    try {
        const order: AxiosResponse<OrderApiDataType|IError> = await axios.get(`${url}/getOrder/${_id}`, await getHeaders());
        const error = (order.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return order.data as OrderApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getActiveOrderByLocation = async(_id:string):Promise<OrderApiDataType> => {
    try {
        const order: AxiosResponse<OrderApiDataType|IError> = await axios.get(`${url}/getActiveOrderByLocation/${_id}`, await getHeaders());
        const error = (order.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return order.data as OrderApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const deleteOrder = async (_id:string):Promise<OrderApiDataType> => {
    try {
        const deleted: AxiosResponse<OrderApiDataType|IError> = await axios.delete(`${url}/deleteOrder/${_id}`, await getHeaders());
        const error = (deleted.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return deleted.data as OrderApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}



export const createOrderItem = async(formData:Omit<IOrderItem, "_id">):Promise<OrderItemApiDataType> => {
    try {
        const newOrderItem: Omit<IOrderItem, "_id"> = formData;
        const item: AxiosResponse<OrderItemApiDataType|IError> = await axios.post(`${url}/createOrderItem`, newOrderItem, await getHeaders());
        const error = (item.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return item.data as OrderItemApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const updateOrderItem = async(item: IOrderItem): Promise<OrderItemApiDataType> => {
    try{
        const updatedOrderItem: AxiosResponse<OrderItemApiDataType|IError> = await axios.put(`${url}/updateOrderItem/${item._id}`, item, await getHeaders());
        const error = (updatedOrderItem.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return updatedOrderItem.data as OrderItemApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getOrderItems = async ():Promise<OrderItemApiDataType> => {
    try {
        const item: AxiosResponse<OrderItemApiDataType|IError> = await axios.get(`${url}/getOrderItems`, await getHeaders());
        const error = (item.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return item.data as OrderItemApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getOrderItem = async(_id:string):Promise<OrderItemApiDataType> => {
    try {
        const item: AxiosResponse<OrderItemApiDataType|IError> = await axios.get(`${url}/getOrderItem/${_id}`, await getHeaders());
        const error = (item.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return item.data as OrderItemApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const deleteOrderItem = async (_id:string):Promise<OrderItemApiDataType> => {
    try {
        const deleted: AxiosResponse<OrderItemApiDataType|IError> = await axios.delete(`${url}/deleteOrderItem/${_id}`, await getHeaders());
        const error = (deleted.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return deleted.data as OrderItemApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}



export const createOrderCategory = async(formData:Omit<IOrderCategory, "_id">):Promise<OrderCategoryApiDataType> => {
    try {
        const newOrderCategory: Omit<IOrderCategory, "_id"> = formData;
        const category: AxiosResponse<OrderCategoryApiDataType|IError> = await axios.post(`${url}/createOrderCategory`, newOrderCategory, await getHeaders());
        const error = (category.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return category.data as OrderCategoryApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const updateOrderCategory = async(category: IOrderCategory): Promise<OrderCategoryApiDataType> => {
    try{
        const updatedOrderCategory: AxiosResponse<OrderCategoryApiDataType|IError> = await axios.put(`${url}/updateOrderCategory/${category._id}`, category, await getHeaders());
        const error = (updatedOrderCategory.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return updatedOrderCategory.data as OrderCategoryApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getOrderCategories = async():Promise<OrderCategoryApiDataType> => {
    try {
        const category: AxiosResponse<OrderCategoryApiDataType|IError> = await axios.get(`${url}/getOrderCategories`, await getHeaders());
        const error = (category.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return category.data as OrderCategoryApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const deleteOrderCategory = async (_id:string):Promise<OrderCategoryApiDataType> => {
    try {
        const deleted: AxiosResponse<OrderCategoryApiDataType|IError> = await axios.delete(`${url}/deleteOrderCategory/${_id}`, await getHeaders());
        const error = (deleted.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return deleted.data as OrderCategoryApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const createReminder = async(formData:Omit<IReminder, "_id">):Promise<ReminderApiDataType> => {
    try {
        const newReminder: Omit<IReminder, "_id"> = formData;
        const reminder: AxiosResponse<ReminderApiDataType|IError> = await axios.post(`${url}/createReminder`, newReminder, await getHeaders());
        const error = (reminder.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return reminder.data as ReminderApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const updateReminder = async(reminder: IReminder): Promise<ReminderApiDataType> => {
    try{
        const updatedReminder: AxiosResponse<ReminderApiDataType|IError> = await axios.put(`${url}/updateReminder/${reminder._id}`, reminder, await getHeaders());
        const error = (updatedReminder.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return updatedReminder.data as ReminderApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getReminders = async():Promise<ReminderApiDataType> => {
    try {
        const reminder: AxiosResponse<ReminderApiDataType|IError> = await axios.get(`${url}/getReminders`, await getHeaders());
        const error = (reminder.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return reminder.data as ReminderApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}


export const getRemindersByIds = async(ids:string[]):Promise<ReminderApiDataType> => {
    try {
        const reminders: AxiosResponse<ReminderApiDataType|IError> = await axios.get(`${url}/getRemindersByIds/${ids.join(",")}`, await getHeaders());
        const error = (reminders.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return reminders.data as ReminderApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getReminderByRoleId = async(_id:string):Promise<ReminderApiDataType> => {
    try {
        let headers = await getHeaders();
        while(headers.headers["x-access-token"] === ""){
            headers = await getHeaders();
        }
        const reminder: AxiosResponse<ReminderApiDataType|IError> = await axios.get(`${url}/getReminderByRoleId/${_id}`, await getHeaders());
        const error = (reminder.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return reminder.data as ReminderApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const deleteReminder = async(_id:string):Promise<ReminderApiDataType> => {
    try {
        const deleted: AxiosResponse<ReminderApiDataType|IError> = await axios.delete(`${url}/deleteReminder/${_id}`, await getHeaders());
        const error = (deleted.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return deleted.data as ReminderApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}


export const createRole = async(formData:Omit<IRole, "_id">):Promise<RoleApiDataType> => {
    try {
        const role: Omit<IRole, "_id"> = formData;
        const savedRole: AxiosResponse<RoleApiDataType|IError> = await axios.post(`${url}/createRole`, role, await getHeaders());
        const error = (savedRole.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return savedRole.data as RoleApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const updateRole = async(role: IRole): Promise<RoleApiDataType> => {
    try{
        const updatedRole: AxiosResponse<RoleApiDataType|IError> = await axios.put(`${url}/updateRole/${role._id}`, role, await getHeaders());
        const error = (updatedRole.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return updatedRole.data as RoleApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getRole = async (_id: string): Promise<RoleApiDataType> => {
    try {
        let headers = await getHeaders();
        while(headers.headers["x-access-token"] === ""){
            headers = await getHeaders();
        }
        const roles: AxiosResponse<RoleApiDataType|IError> = await axios.get(`${url}/getRole/${_id}`, await getHeaders());
        const error = (roles.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return roles.data as RoleApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getRoles = async (): Promise<RoleApiDataType> => {
    try {
        const roles: AxiosResponse<RoleApiDataType|IError> = await axios.get(`${url}/getRoles`, await getHeaders());
        const error = (roles.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return roles.data as RoleApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const deleteRole = async (_id:string):Promise<RoleApiDataType> => {
    try {
        const deletedRole: AxiosResponse<RoleApiDataType|IError> = await axios.delete(`${url}/deleteRole/${_id}`, await getHeaders());
        const error = (deletedRole.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return deletedRole.data as RoleApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}


export const createShoppingItem = async(formData:Omit<IShoppingItem, "_id">):Promise<ShoppingItemApiDataType> => {
    try {
        const newShoppingItem: Omit<IShoppingItem, "_id"> = formData;
        const item: AxiosResponse<ShoppingItemApiDataType|IError> = await axios.post(`${url}/createShoppingItem`, newShoppingItem, await getHeaders());
        const error = (item.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return item.data as ShoppingItemApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const updateShoppingItem = async(item: IShoppingItem): Promise<ShoppingItemApiDataType> => {
    try{
        const updatedShoppingItem: AxiosResponse<ShoppingItemApiDataType|IError> = await axios.put(`${url}/updateShoppingItem/${item._id}`, item, await getHeaders());
        const error = (updatedShoppingItem.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return updatedShoppingItem.data as ShoppingItemApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getShoppingItem = async(_id:string):Promise<ShoppingItemApiDataType> => {
    try {
        const item: AxiosResponse<ShoppingItemApiDataType|IError> = await axios.get(`${url}/getShoppingItem/${_id}`, await getHeaders());
        const error = (item.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return item.data as ShoppingItemApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getShoppingItems = async():Promise<ShoppingItemApiDataType> => {
    try {
        const items: AxiosResponse<ShoppingItemApiDataType|IError> = await axios.get(`${url}/getShoppingItems`, await getHeaders());
        const error = (items.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return items.data as ShoppingItemApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const deleteShoppingItem = async (_id:string):Promise<ShoppingItemApiDataType> => {
    try {
        const deleted: AxiosResponse<ShoppingItemApiDataType|IError> = await axios.delete(`${url}/deleteShoppingItem/${_id}`, await getHeaders());
        const error = (deleted.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return deleted.data as ShoppingItemApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}


export const createShoppingCategory = async(formData:Omit<IShoppingCategory, "_id">):Promise<ShoppingCategoryApiDataType> => {
    try {
        const newShoppingCategory: Omit<IShoppingCategory, "_id"> = formData;
        const category: AxiosResponse<ShoppingCategoryApiDataType|IError> = await axios.post(`${url}/createShoppingCategory`, newShoppingCategory, await getHeaders());
        const error = (category.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return category.data as ShoppingCategoryApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const updateShoppingCategory = async(category: IShoppingCategory): Promise<ShoppingCategoryApiDataType> => {
    try{
        const updatedShoppingCategory: AxiosResponse<ShoppingCategoryApiDataType|IError> = await axios.put(`${url}/updateShoppingCategory/${category._id}`,category, await getHeaders());
        const error = (updatedShoppingCategory.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return updatedShoppingCategory.data as ShoppingCategoryApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getShoppingCategory = async(_id:string):Promise<ShoppingCategoryApiDataType> => {
    try {
        const category: AxiosResponse<ShoppingCategoryApiDataType|IError> = await axios.get(`${url}/getShoppingCategory/${_id}`, await getHeaders());
        const error = (category.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return category.data as ShoppingCategoryApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getShoppingCategories = async():Promise<ShoppingCategoryApiDataType> => {
    try {
        const categories: AxiosResponse<ShoppingCategoryApiDataType|IError> = await axios.get(`${url}/getShoppingCategories`, await getHeaders());
        const error = (categories.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return categories.data as ShoppingCategoryApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const deleteShoppingCategory = async (_id:string):Promise<ShoppingCategoryApiDataType> => {
    try {
        const deleted: AxiosResponse<ShoppingCategoryApiDataType|IError> = await axios.delete(`${url}/deleteShoppingCategory/${_id}`, await getHeaders());
        const error = (deleted.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return deleted.data as ShoppingCategoryApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const createShoppingList = async(formData:Omit<IShoppingList, "_id">):Promise<ShoppingListApiDataType> => {
    try {
        const newShoppingList: Omit<IShoppingList, "_id"> = formData;
        const list: AxiosResponse<ShoppingListApiDataType|IError> = await axios.post(`${url}/createShoppingList`, newShoppingList, await getHeaders());
        const error = (list.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return list.data as ShoppingListApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getShoppingList = async(_id:string):Promise<ShoppingListApiDataType> => {
    try {
        const list: AxiosResponse<ShoppingListApiDataType|IError> = await axios.get(`${url}/getShoppingList/${_id}`, await getHeaders());
        const error = (list.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return list.data as ShoppingListApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getActiveShoppingListByLocation = async (_id:string):Promise<ShoppingListApiDataType> => {
    try {
        const list: AxiosResponse<ShoppingListApiDataType|IError> = await axios.get(`${url}/getActiveShoppingListByLocation/${_id}`, await getHeaders());
        const error = (list.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return list.data as ShoppingListApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const getShoppingListsByLocation = async(_id:string):Promise<ShoppingListApiDataType> => {
    try {
        const lists: AxiosResponse<ShoppingListApiDataType|IError> = await axios.get(`${url}/getShoppingListsByLocation/${_id}`, await getHeaders());
        const error = (lists.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return lists.data as ShoppingListApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}


export const getShoppingLists = async():Promise<ShoppingListApiDataType> => {
    try {
        const lists: AxiosResponse<ShoppingListApiDataType|IError> = await axios.get(`${url}/getShoppingLists`, await getHeaders());
        const error = (lists.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return lists.data as ShoppingListApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const updateShoppingList = async(list: IShoppingList): Promise<ShoppingListApiDataType> => {
    try{
        const updatedShoppingList: AxiosResponse<ShoppingListApiDataType|IError> = await axios.put(`${url}/updateShoppingList/${list._id}`, list, await getHeaders());
        const error = (updatedShoppingList.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return updatedShoppingList.data as ShoppingListApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const deleteShoppingList = async (_id:string):Promise<ShoppingListApiDataType> => {
    try {
        const deleted: AxiosResponse<ShoppingListApiDataType|IError> = await axios.delete(`${url}/deleteShoppingList/${_id}`, await getHeaders());
        const error = (deleted.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return deleted.data as ShoppingListApiDataType;
    } catch(error) {
        console.log(error);
		throw new Error(String(error));
    }
}

export const createSupplier = async (formData:Omit<ISupplier, "_id">): Promise<SupplierApiDataType> => {
    try {
        const newSupplier: Omit<ISupplier, "_id"> = formData;
        const suppliers: AxiosResponse<SupplierApiDataType|IError> = await axios.post(`${url}/createSupplier`, newSupplier, await getHeaders());
        const error = (suppliers.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return suppliers.data as SupplierApiDataType;
    } catch(error) {
        console.log(error);
        throw new Error(String(error));
    }
}

export const updateSupplier = async (supplier:ISupplier): Promise<SupplierApiDataType> => {
    try {
        const updatedSuppliers: AxiosResponse<SupplierApiDataType|IError> = await axios.put(`${url}/updateSupplier/${supplier._id}`, supplier, await getHeaders());
        const error = (updatedSuppliers.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return updatedSuppliers.data as SupplierApiDataType;
    } catch(error) {
        console.log(error);
        throw new Error(String(error));
    }
}

export const getSupplier = async (_id:string): Promise<SupplierApiDataType> => {
    try {
        const suppliers: AxiosResponse<SupplierApiDataType|IError> = await axios.get(`${url}/getSupplier/${_id}`, await getHeaders());
        const error = (suppliers.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return suppliers.data as SupplierApiDataType;
    } catch(error) {
        console.log(error);
        throw new Error(String(error));
    }
}

export const getSuppliers = async (): Promise<SupplierApiDataType> => {
    try {
        const suppliers: AxiosResponse<SupplierApiDataType|IError> = await axios.get(`${url}/getSuppliers`, await getHeaders());
        const error = (suppliers.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return suppliers.data as SupplierApiDataType;
    } catch(error) {
        console.log(error);
        throw new Error(String(error));
    }
}

export const deleteSupplier = async (_id:string): Promise<SupplierApiDataType> => {
    try {
        const suppliers: AxiosResponse<SupplierApiDataType|IError> = await axios.delete(`${url}/deleteSupplier/${_id}`, await getHeaders());
        const error = (suppliers.data as IError).error;
        if(error !== undefined){
            throw new Error(error);
        }
        return suppliers.data as SupplierApiDataType;
    } catch(error) {
        console.log(error);
        throw new Error(String(error));
    }
}