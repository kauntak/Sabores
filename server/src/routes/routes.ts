import {Router} from 'express';
import bodyParser from 'body-parser';
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});

import { createEmployee, updateEmployee, getEmployee, deleteEmployee } from '../controllers/employee';
import { createEmployeeLog, updateEmployeeLog, getEmployeeLog, deleteEmployeeLog } from '../controllers/employeeLog';
import { createLocation, updateLocation, getLocation, deleteLocation } from '../controllers/location';
import { createMessage, updateMessage, getMessage, deleteMessage } from '../controllers/message';
import { createModule, updateModule, getModule, deleteModule } from '../controllers/module';
import { createOrder, updateOrder, getOrder, deleteOrder } from '../controllers/order';
import { createOrderItem, updateOrderItem, getOrderItem, deleteOrderItem } from '../controllers/orderItem';
import { createOrderCategory, updateOrderCategory, getOrderCategory, deleteOrderCategory } from '../controllers/orderCategory';

import { createReminder, updateReminder, getReminder, deleteReminder } from '../controllers/reminder';
import { createRole, updateRole, getRole, deleteRole } from '../controllers/role';
import { createShoppingItem, updateShoppingItem, getShoppingItem, deleteShoppingItem } from '../controllers/shoppingItem';
import { createShoppingList, updateShoppingList, getShoppingList, deleteShoppingList } from '../controllers/shoppingList';
import { createShoppingCategory, updateShoppingCategory, getShoppingCategory, deleteShoppingCategory } from '../controllers/shoppingCategory';



const router:Router = Router();

router.post('/api/createEmployee', jsonParser, createEmployee);
router.put('/api/updateEmployee/:id', jsonParser, updateEmployee);
router.get('/api/getEmployee/:id', jsonParser, getEmployee);
router.delete('/api/deleteEmployee/:id', jsonParser, deleteEmployee);

router.post('/api/createEmployeeLog', jsonParser, createEmployeeLog);
router.put('/api/updateEmployeeLog/:id', jsonParser, updateEmployeeLog);
router.get('/api/getEmployeeLog/:id', jsonParser, getEmployeeLog);
router.delete('/api/deleteEmployeeLog/:id', jsonParser, deleteEmployeeLog);

router.post('/api/createLocation', jsonParser, createLocation);
router.put('/api/updateLocation/:id', jsonParser, updateLocation);
router.get('/api/getLocation/:id', jsonParser, getLocation);
router.delete('/api/deleteLocation/:id', jsonParser, deleteLocation);

router.post('/api/createMessage', jsonParser, createMessage);
router.put('/api/updateMessage/:id', jsonParser, updateMessage);
router.get('/api/getMessage/:id', jsonParser, getMessage);
router.delete('/api/deleteMessage/:id', jsonParser, deleteMessage);

router.post('/api/createModule', jsonParser, createModule);
router.put('/api/updateModule/:id', jsonParser, updateModule);
router.get('/api/getModule/:id', jsonParser, getModule);
router.delete('/api/deleteModule/:id', jsonParser, deleteModule);

router.post('/api/createOrder', jsonParser, createOrder);
router.put('/api/updateOrder/:id', jsonParser, updateOrder);
router.get('/api/getOrder/:id', jsonParser, getOrder);
router.delete('/api/deleteOrder/:id', jsonParser, deleteOrder);

router.post('/api/createOrderItem', jsonParser, createOrderItem);
router.put('/api/updateOrderItem/:id', jsonParser, updateOrderItem);
router.get('/api/getOrderItem/:id', jsonParser, getOrderItem);
router.delete('/api/deleteOrderItem/:id', jsonParser, deleteOrderItem);

router.post('/api/createOrderCategory', jsonParser, createOrderCategory);
router.put('/api/updateOrderCategory/:id', jsonParser, updateOrderCategory);
router.get('/api/getOrderCategory/:id', jsonParser, getOrderCategory);
router.delete('/api/deleteOrderCategory/:id', jsonParser, deleteOrderCategory);

router.post('/api/createReminder', jsonParser, createReminder);
router.put('/api/updateReminder/:id', jsonParser, updateReminder);
router.get('/api/getReminder/:id', jsonParser, getReminder);
router.delete('/api/deleteReminder/:id', jsonParser, deleteReminder);

router.post('/api/createRole', jsonParser, createRole);
router.put('/api/updateRole/:id', jsonParser, updateRole);
router.get('/api/getRole/:id', jsonParser, getRole);
router.delete('/api/deleteRole/:id', jsonParser, deleteRole);

router.post('/api/createShoppingItem', jsonParser, createShoppingItem);
router.put('/api/updateShoppingItem/:id', jsonParser, updateShoppingItem);
router.get('/api/getShoppingItem/:id', jsonParser, getShoppingItem);
router.delete('/api/deleteShoppingItem/:id', jsonParser, deleteShoppingItem);

router.post('/api/createShoppingList', jsonParser, createShoppingList);
router.put('/api/updateShoppingList/:id', jsonParser, updateShoppingList);
router.get('/api/getShoppingList/:id', jsonParser, getShoppingList);
router.delete('/api/deleteShoppingList/:id', jsonParser, deleteShoppingList);

router.post('/api/createShoppingCategory', jsonParser, createShoppingCategory);
router.put('/api/updateShoppingCategory/:id', jsonParser, updateShoppingCategory);
router.get('/api/getShoppingCategory/:id', jsonParser, getShoppingCategory);
router.delete('/api/deleteShoppingCategory/:id', jsonParser, deleteShoppingCategory);

export default router;