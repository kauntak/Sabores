import {Router} from 'express';
import bodyParser from 'body-parser';
const jsonParser = bodyParser.json();

import { createEmployee, updateEmployee, getEmployees, getEmployee, deleteEmployee, authenticateEmployee } from '../controllers/employee';
import { createEmployeeLog, updateEmployeeLog, getEmployeeLogs, getEmployeesLog, getEmployeeLogsByDateRange, deleteEmployeeLog, getEmployeesMostRecentLog } from '../controllers/employeeLog';
import { createLocation, updateLocation, getLocations, deleteLocation } from '../controllers/location';
import { createMessage, updateMessage,getMessagesByDateRange, getMessagesByEmployee, getMessage, deleteMessage, readMessage, lockMessage, unlockMessage } from '../controllers/message';
import { createModule, updateModule, getModules, deleteModule } from '../controllers/module';
import { createOrder, updateOrder, getOrders, getOrder, deleteOrder, getActiveOrderByLocation } from '../controllers/order';
import { createOrderItem, updateOrderItem, getOrderItems, deleteOrderItem, getOrderItem } from '../controllers/orderItem';
import { createOrderCategory, updateOrderCategory, getOrderCategories, deleteOrderCategory } from '../controllers/orderCategory';

import { createReminder, updateReminder, getReminders, getReminderByRoleId, deleteReminder, getRemindersByIds } from '../controllers/reminder';
import { createRole, updateRole, getRoles, getRole, deleteRole } from '../controllers/role';
import { createShoppingItem, updateShoppingItem, getShoppingItems, getShoppingItem, deleteShoppingItem } from '../controllers/shoppingItem';
import { createShoppingList, updateShoppingList, getShoppingLists, getShoppingList, deleteShoppingList, getActiveShoppingListByLocation, getShoppingListsByLocation } from '../controllers/shoppingList';
import { createShoppingCategory, updateShoppingCategory, getShoppingCategories, getShoppingCategory, deleteShoppingCategory } from '../controllers/shoppingCategory';
import { createSupplier, deleteSupplier, getSupplier, getSuppliers, updateSupplier } from '../controllers/supplier';



const router:Router = Router();

router.post('/api/createEmployee', jsonParser, createEmployee);
router.post('/api/authenticateEmployee', jsonParser, authenticateEmployee);
router.put('/api/updateEmployee/:id', jsonParser, updateEmployee);
router.get('/api/getEmployees', jsonParser, getEmployees);
router.get('/api/getEmployee/:id', jsonParser, getEmployee);
router.delete('/api/deleteEmployee/:id', jsonParser, deleteEmployee);

router.post('/api/createEmployeeLog', jsonParser, createEmployeeLog);
router.put('/api/updateEmployeeLog/:id', jsonParser, updateEmployeeLog);
router.get('/api/getEmployeeLogs', jsonParser, getEmployeeLogs);
router.get('/api/getEmployeesLog/:id', jsonParser, getEmployeesLog);
router.get('/api/getEmployeeLogsByDateRange/start/:startDate/end/:endDate', jsonParser, getEmployeeLogsByDateRange);
router.get('/api/getEmployeesMostRecentLog/:id', jsonParser, getEmployeesMostRecentLog);
router.delete('/api/deleteEmployeeLog/:id', jsonParser, deleteEmployeeLog);

router.post('/api/createLocation', jsonParser, createLocation);
router.put('/api/updateLocation/:id', jsonParser, updateLocation);
router.get('/api/getLocations', jsonParser, getLocations);
router.delete('/api/deleteLocation/:id', jsonParser, deleteLocation);

router.post('/api/createMessage', jsonParser, createMessage);
router.put('/api/updateMessage/:id', jsonParser, updateMessage);
router.put('/api/readMessage/:id', jsonParser, readMessage);
router.put('/api/lockMessage/:id', jsonParser, lockMessage);
router.put('/api/unlockMessage/:id', jsonParser, unlockMessage);
router.get('/api/getMessagesByEmployee/:id', jsonParser, getMessagesByEmployee);
router.get('/api/getMessagesByDateRange/start/:startDate/end/:endDate', jsonParser, getMessagesByDateRange);
router.get('/api/getMessage/:id', jsonParser, getMessage);
router.delete('/api/deleteMessage/:id', jsonParser, deleteMessage);

router.post('/api/createModule', jsonParser, createModule);
router.put('/api/updateModule/:id', jsonParser, updateModule);
router.get('/api/getModules', jsonParser, getModules);
router.delete('/api/deleteModule/:id', jsonParser, deleteModule);

router.post('/api/createOrder', jsonParser, createOrder);
router.put('/api/updateOrder/:id', jsonParser, updateOrder);
router.get('/api/getOrders', jsonParser, getOrders);
router.get('/api/getOrder/:id', jsonParser, getOrder);
router.get('/api/getActiveOrderByLocation/:id', jsonParser, getActiveOrderByLocation);
router.delete('/api/deleteOrder/:id', jsonParser, deleteOrder);

router.post('/api/createOrderItem', jsonParser, createOrderItem);
router.put('/api/updateOrderItem/:id', jsonParser, updateOrderItem);
router.get('/api/getOrderItem/:id', jsonParser, getOrderItem);
router.get('/api/getOrderItems', jsonParser, getOrderItems);
router.delete('/api/deleteOrderItem/:id', jsonParser, deleteOrderItem);

router.post('/api/createOrderCategory', jsonParser, createOrderCategory);
router.put('/api/updateOrderCategory/:id', jsonParser, updateOrderCategory);
router.get('/api/getOrderCategories', jsonParser, getOrderCategories);
router.delete('/api/deleteOrderCategory/:id', jsonParser, deleteOrderCategory);

router.post('/api/createReminder', jsonParser, createReminder);
router.put('/api/updateReminder/:id', jsonParser, updateReminder);
router.get('/api/getReminders', jsonParser, getReminders);
router.get('/api/getRemindersByIds/:idString', jsonParser, getRemindersByIds);
router.get('/api/getReminderByRoleId/:id', jsonParser, getReminderByRoleId);
router.delete('/api/deleteReminder/:id', jsonParser, deleteReminder);

router.post('/api/createRole', jsonParser, createRole);
router.put('/api/updateRole/:id', jsonParser, updateRole);
router.get('/api/getRoles', jsonParser, getRoles);
router.get('/api/getRole/:id', jsonParser, getRole);
router.delete('/api/deleteRole/:id', jsonParser, deleteRole);

router.post('/api/createShoppingItem', jsonParser, createShoppingItem);
router.put('/api/updateShoppingItem/:id', jsonParser, updateShoppingItem);
router.get('/api/getShoppingItems', jsonParser, getShoppingItems);
router.get('/api/getShoppingItem/:id', jsonParser, getShoppingItem);
router.delete('/api/deleteShoppingItem/:id', jsonParser, deleteShoppingItem);

router.post('/api/createShoppingList', jsonParser, createShoppingList);
router.put('/api/updateShoppingList/:id', jsonParser, updateShoppingList);
router.get('/api/getShoppingLists', jsonParser, getShoppingLists);
router.get('/api/getShoppingList/:id', jsonParser, getShoppingList);
router.get('/api/getShoppingListsByLocation/:id', jsonParser, getShoppingListsByLocation);
router.get('/api/getActiveShoppingListByLocation/:id', jsonParser, getActiveShoppingListByLocation);
router.delete('/api/deleteShoppingList/:id', jsonParser, deleteShoppingList);

router.post('/api/createShoppingCategory', jsonParser, createShoppingCategory);
router.put('/api/updateShoppingCategory/:id', jsonParser, updateShoppingCategory);
router.get('/api/getShoppingCategories', jsonParser, getShoppingCategories);
router.get('/api/getShoppingCategory/:id', jsonParser, getShoppingCategory);
router.delete('/api/deleteShoppingCategory/:id', jsonParser, deleteShoppingCategory);

router.post('/api/createSupplier', jsonParser, createSupplier);
router.put('/api/updateSupplier/:id', jsonParser, updateSupplier);
router.get('/api/getSuppliers', jsonParser, getSuppliers);
router.get('/api/getSupplier/:id', jsonParser, getSupplier);
router.delete('/api/deleteSupplier/:id', jsonParser, deleteSupplier);


export default router;