import React, { useContext, useEffect, useState } from "react";
import { CategoryListType, ILocation, IOrder, IOrderCategory, IOrderItem, IShoppingCategory, IShoppingItem, IShoppingList, ItemObjectType, NavListType } from "../type";
import { NavBarComponent } from "../components/NavBarComponent";
import { ButtonComponent } from "../components/ButtonComponent";
import { getActiveOrderByLocation, getActiveShoppingListByLocation, getLocations, getOrderCategories, getOrderItems, getShoppingCategories, getShoppingItems, updateOrder, updateShoppingList } from "../api";
import { EmployeeContext, LanguageContext } from "../App";
import { EditItemListComponent } from "../components/EditItemListComponent";
import { LoadingSpinner } from "../components/LoadinSpinnerComponent";


type Props = {
    accessList: NavListType[]
}

export const LocationsComponent:React.FC<Props> = ({accessList}) => {
    const [currentLocation, setCurrentLocation] = useState<NavListType>({displayName:"", moduleName:""});
    
    useEffect(()=> {
        setCurrentLocation(accessList[0]);
    }, [accessList])

    
    const onClick= (e:React.MouseEvent<HTMLAnchorElement>):void => {
        e.preventDefault();
        setCurrentLocation({
            id:e.currentTarget.dataset.id,
            displayName:e.currentTarget.dataset.display!,
            moduleName:e.currentTarget.dataset.link!
        });
    }
    
    return (
        <>
            {accessList.length!==1?
                <NavBarComponent 
                    list={accessList}
                    currentActive={currentLocation.moduleName}
                    onClick={onClick}
                    isNegative={true}
                />
            :""}
            <LocationComponent locationName={currentLocation.displayName} id={currentLocation.id!}/>
        </>
    );
}

type LocationComponentProp = {
    locationName:string,
    id:string
}

const LocationComponent:React.FC<LocationComponentProp> = ({locationName, id }) => {
    const [list, setList] = useState<IShoppingList|IOrder|null>(null);
    const [categories, setCategories] = useState<CategoryListType[]>([]);
    const [itemList, setItemList] = useState<ItemObjectType>({});
    const [isMain, setIsMain] = useState<boolean>(false);
    const [locationList, setLocationList] = useState<ILocation[]>([]);
    const text = useContext(LanguageContext);
    const employee = useContext(EmployeeContext);

    useEffect(()=> {
        getLocations()
            .then(res => {
                setLocationList(res.locations);
            })
    }, []);


    useEffect(()=> {
        if(id === undefined) return;
        const location = locationList.find(location => location._id === id);
        if(location === undefined) return;
        setIsMain(location.isMain || false);
        if(location.isMain){
            getActiveOrderByLocation(id)
                .then(res => {
                    console.log(res, id);
                    setList(res.order!);
                });
            getOrderCategories()
                .then(categoryRes => {
                    getOrderItems()
                        .then(itemRes => {
                            setNewCategories(categoryRes.orderCategories, itemRes.orderItems);
                        });
                });
        } else {
            getActiveShoppingListByLocation(id)
                .then(res => {
                    setList(res.shoppingList!);
                });
            getShoppingCategories()
                .then(categoryRes => {
                    getShoppingItems()
                        .then(itemRes => {
                            setNewCategories(categoryRes.shoppingCategories, itemRes.shoppingItems);
                        });
                });
        }
        return setCategories([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, locationList]);

    useEffect(()=> {
        const newItemList:ItemObjectType = {};
        if(list === null) return;
        list.items.forEach(item => {
            newItemList[item.item] = {
                quantity: item.quantity,
                employee: item.employee
            }
        });
        setItemList(newItemList);
    }, [list])

    const setNewCategories = (categoryList:IOrderCategory[]|IShoppingCategory[], itemList:(IOrderItem|IShoppingItem)[]):void => {
        const newCategories:CategoryListType[] = categoryList
            .reduce<CategoryListType[]>((prevArray, category, _index) => {
            prevArray.push({
                id: category._id!,
                name: category.name,
                items: itemList
                    .filter((item:IOrderItem|IShoppingItem) => item.category === category._id).map((item:IOrderItem|IShoppingItem) => {
                        return {
                            name: item.name,
                            id: item._id!,
                            display: item.name
                        };
                    })
            });
            return prevArray;
        }, []);
        const noCategories:CategoryListType[] = [{
            id: "NULL",
            name:"---",
            items: itemList
                .filter( (item:IOrderItem|IShoppingItem) => 
                    item.category === undefined 
                    || item.category === null 
                    || item.category === "" 
                    || categoryList.findIndex(category => category._id === item.category) === -1)
                .map((item:IOrderItem|IShoppingItem) => {
                    return {
                        name: item.name,
                        id: item._id!,
                        display: item.name
                    };
                })
        }];
        setCategories(noCategories[0].items.length===0?newCategories:noCategories.concat(newCategories));
    }

    type ItemType = {
        item:string,
        quantity:number, 
        employee:string
    };

    const onSaveButtonClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        const newItems:ItemType[]  = [];
        for(const itemId in itemList) {
            if(itemList[itemId].quantity !== undefined && itemList[itemId].quantity !== 0) {
                newItems.push({
                    item:itemId,
                    quantity: itemList[itemId].quantity!,
                    employee: employee._id!
                })
            }
        }
        if(isMain) {
            const updatedOrder:IOrder = {...(list as IOrder)};
            updatedOrder.items = newItems;
            console.log(updatedOrder);
            updateOrder(updatedOrder)
                .then(res => console.log(res.order));
        } else {
            const updatedShoppingList:IShoppingList = {...(list as IShoppingList)};
            updatedShoppingList.items = newItems;
            console.log(updatedShoppingList);
            updateShoppingList(updatedShoppingList)
                .then(res => console.log(res.shoppingList))
        }
    }

    return (
        <>
            <h1>{locationName}{isMain?" Main":""}</h1>
            {categories.length!==0
            ?<>
                <EditItemListComponent 
                    categories={categories}
                    currentList={itemList}
                    setCurrentList={setItemList}
                />
                <ButtonComponent
                    onClick={onSaveButtonClick}
                    name={text.location.save}
                />
            </>
            :<LoadingSpinner />}
        </>
    )
}