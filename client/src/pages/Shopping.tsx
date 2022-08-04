import React, { useEffect, useState } from "react";
import { getEmployees, getShoppingCategories, getShoppingItems, getShoppingLists } from "../api";
import { EditItemListComponent } from "../components/EditItemListComponent";
import { NavBarComponent } from "../components/NavBarComponent";
import { CategoryListType, IEmployee, IShoppingCategory, IShoppingItem, IShoppingList, ItemObjectType } from "../type";


type Props = {

}

export const ShoppingComponent:React.FC<Props> = ({}) => {
    const [itemList, setItemList] = useState<IShoppingItem[]>([]);
    const [categoryList, setCategoryList] = useState<IShoppingCategory[]>([]);
    const [employeeList, setEmployeeList] = useState<IEmployee[]>([]);
    const [shoppingLists, setShoppingLists] = useState<IShoppingList[]>([]);
    const [activeShoppingList, setActiveShoppingList] = useState<IShoppingList|null>(null);
    const [itemObject, setItemObject] = useState<ItemObjectType>({});
    const [categories, setCategories] = useState<CategoryListType[]>([]);

    useEffect(()=> {
        getShoppingLists()
            .then(res => {
                setShoppingLists(res.shoppingLists);
            })
        getShoppingCategories()
            .then(res => {
                setCategoryList(res.shoppingCategories);
            });
        getShoppingItems()
            .then(res => {
                setItemList(res.shoppingItems);
            });
        getEmployees()
            .then(res => {
                setEmployeeList(res.employees);
            });
    }, []);

    useEffect(()=> {
        const newCategories:CategoryListType[] = categoryList.sort((a, b)=> {
            if(a.name > b.name) return 1;
            else if(a.name < b.name) return -1;
            return 0;
        }).map(category => {
            return {
                name: category.name,
                id:category._id!,
                items: itemList.filter(item => item.category === category._id).map(item => {
                    return {
                        id:item._id!,
                        name:item.name.replace(/\s/g, ""),
                        display:item.name
                    }
                })
            }
        })
        setCategories(newCategories);
    }, [categoryList, itemList])

    useEffect(()=> {
        if(activeShoppingList===null) return;
        const newItems:ItemObjectType = {};
        activeShoppingList.items.forEach(item => {
            const foundItem = itemList.find(shoppingItem => item.item === shoppingItem._id);
            if(foundItem === undefined) return;
            const foundEmployee = employeeList.find(employee => employee._id === item.employee);
            newItems[foundItem._id!] = {
                employee: foundEmployee===undefined?"-Deleted-":`${foundEmployee.firstName} ${foundEmployee.middleName?foundEmployee.middleName + " ":""}${foundEmployee.lastName}`,
                quantity: item.quantity
            }
        });
        setItemObject(newItems);
    }, [activeShoppingList])

    return (
        <EditItemListComponent 
            categories={categories}
            currentList={itemObject}
            setCurrentList={setItemObject}
        />
    );
}