import React, { useState } from "react";
import { NavBarComponent } from "../components/NavBarComponent";
import { IEmployee, NavListType } from "../type";
import { EmployeeManagement } from "./Admin/EmployeeManagement";
import { ShoppingManagement } from "./Admin/ShoppingManagement";
import { RoleManagement } from "./Admin/RoleManagement";
import { OrderManagement } from "./Admin/OrderManagement";
import { LocationManagement } from "./Admin/LocationManagement";
import { useContext } from "react";
import { LanguageContext } from "../App";


type Props = {
    isAdmin:boolean
    currentEmployee:IEmployee
}

const MANAGER_LIST = [
    "Add/Edit/Delete Shopping items/categories",
    "Add/Edit/Delete Order Items/categories", 
    "Add/Edit/Delete Employee", 
    "Add/Edit/Delete Role Reminder",
    "View Employee Log",
    "View Messages",
    "View Shopping List"
] as const;
const ADMIN_LIST = [
    "Add Employee Role",
    "Add Location"
] as const


export const AdminComponent:React.FC<Props> = ({isAdmin, currentEmployee}) => {
    const text = useContext(LanguageContext);
    const managerList:NavListType[] = [
        {moduleName:"shopping", displayName:text.navList.shopping},
        {moduleName:"orders", displayName:text.navList.orders},
        {moduleName:"employee", displayName:text.navList.employee},
        {moduleName:"role", displayName:text.navList.role},
    ]
    const [activeModule, setActiveModule] = useState<string>("main");

    const navList:NavListType[] = isAdmin?managerList.concat([
        {moduleName:"location", displayName:"Locations"},
    ]):managerList;

    const onNavClick = (e:React.MouseEvent<HTMLAnchorElement>):void => {
        e.preventDefault();
        if(e.currentTarget?.dataset.link === undefined) return;
        setActiveModule(e.currentTarget.dataset.link);
    }

    return (
        <>
            <NavBarComponent
                list={navList}
                onClick={onNavClick}
                currentActive={activeModule}
                isNegative={true}
            />
            {
                {
                    "shopping":<ShoppingManagement />,
                    "orders":<OrderManagement />,
                    "employee":<EmployeeManagement
                        isAdmin={isAdmin}
                        currentEmployee={currentEmployee}/>,
                    "role":<RoleManagement />,
                    "location":<LocationManagement />,
                }[activeModule]
            }
        </>
    );
}