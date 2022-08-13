import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./../css/orderList.module.css";
import { getLocations, getOrderItems, getOrders, getShoppingItems, getShoppingLists, getSuppliers } from "../api";
import { ILocation, IOrder, IOrderItem, IShoppingItem, IShoppingList, ISupplier, TotalOrderItem, TotalOrderList, TotalShoppingItem } from "../type";
import { LoadingSpinner } from "./LoadinSpinnerComponent";
import { BsChevronDown } from "react-icons/bs";
import { BiCheckbox, BiCheckboxChecked } from "react-icons/bi";
import { ButtonComponent } from "./ButtonComponent";
import { text } from "stream/consumers";
import { WarningOverlayComponent } from "./WarningOverlayComponent";
import { LanguageContext } from "../App";


type Props = {
}

type DisplayItem = {
    id:string,
    name:string,
    quantity?:number,
    subItems?: DisplayItem[]
}
type ShoppingItemListType = {
    [key:string]:{
        shoppingItemId:string,
        shoppingItemQuantity:number, 
        shoppingItemName:string,
        isUsed?:boolean
    }
}

type SelectionType = {
    value:string,
    display:string
}

type ListFilterFunction = (list:IShoppingList|IOrder, index?:number, array?:IShoppingList[]|IOrder[], type?:"Order"|"ShoppingList") => boolean

const defaultListFilterFunction:ListFilterFunction = (list) => !list.isCompleted;

export const OrderListComponent:React.FC<Props> = ({}) => {
    const [supplierList, setSupplierList] = useState<ISupplier[]>([]);
    const [shoppingLists, setShoppingLists] = useState<IShoppingList[]>([]);
    const [orderList, setOrderList] = useState<IOrder[]>([]);
    const [shoppingItemList, setShoppingItemList] = useState<IShoppingItem[]>([]);
    const [orderItemList, setOrderItemList] = useState<IOrderItem[]>([]);
    const [totalList, setTotalList] = useState<TotalOrderList>({});
    const [locationList, setLocationList] = useState<ILocation[]>([]);
    const [selectOptionList, setSelectOptionList] = useState<SelectionType[]>([]);
    const [selectLocationList, setSelectLocationList] = useState<SelectionType[]>([]);
    const [displayList, setDisplayList] = useState<DisplayItem[]>([]);
    const [showWarning, setShowWarning] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const isLoaded = useRef<boolean[]>(new Array(5).fill(false));
    const text = useContext(LanguageContext);
    const dateIndex = useRef<number>(-1);
    const locationIndex = useRef<number>(-1);
    const listFilterFunction = useRef<ListFilterFunction>(()=>{return false;});
    // const [currentDisplayIndex, setCurrentDisplayIndex] = useState<number>(-1);
    // const [currentLocationIndex, setCurrentLocationIndex] = useState<number>(-1);
    // const [listFilterFunction, setListFilterFunction] = useState<ListFilterFunction>(() => ()=>{return false});
    const selectedFilterFunction:ListFilterFunction = (list) => {
        if(dateIndex.current === -1){
            if(locationIndex.current === -1){
                return !list.isCompleted;
            }
            let locationId = selectLocationList[locationIndex.current].value;
            return !list.isCompleted && locationId===list.location;
        } else {
            let batchId = selectOptionList[dateIndex.current].value;
            if(locationIndex.current === -1){
                return list.completedBatchId === batchId;
            }
            let locationId = selectLocationList[locationIndex.current].value;
            return list.completedBatchId === batchId && locationId===list.location;
        }
    }

    useEffect(()=>{
        setIsLoading(true);
        isLoaded.current = [ false, false, false, false, false ];
        getOrderItems()
        .then(res => {
            setOrderItemList(res.orderItems);
            isLoaded.current[4] = true;
        });
        getShoppingItems()
        .then(res => {
            setShoppingItemList(res.shoppingItems);
            isLoaded.current[3] = true;
        });
        getSuppliers()
        .then(res => {
            setSupplierList(res.suppliers);
            isLoaded.current[2] = true;
        });
        getShoppingLists()
        .then(res => {
            setShoppingLists(res.shoppingLists);
            isLoaded.current[1] = true;
        });
        getOrders()
        .then(res => {
            setOrderList(res.orders);
            isLoaded.current[0] = true;
        });
        getLocations()
        .then(res => {
            setLocationList(res.locations);
            const newLocationList:SelectionType[] = res.locations.map(location => {
                return {
                    value:location._id!,
                    display:location.name
                }
            })
            setSelectLocationList(newLocationList);
        });
    }, []);

    useEffect(()=> {
        for(let i in isLoaded.current){
            if(!(isLoaded.current[i])) return setIsLoading(true);
        }
        const newOptionList:SelectionType[] = ([] as Array<IOrder|IShoppingList>).concat(shoppingLists, orderList).sort((a, b) => {
            const aTime = a.createdAt?a.createdAt.getTime():0;
            const bTime = b.createdAt?b.createdAt.getTime():0;
            return bTime - aTime;
        }).reduce<SelectionType[]>((newList, item) => {
            if(!item.isCompleted) return newList;
            const id:string = item.completedBatchId!;
            if(newList.find(listItem => listItem.value === id)) return newList;
            const time:string = item.createdAt?item.createdAt.toLocaleString():text.totalOrder.invalidDate;
            newList.push({
                value:id,
                display: time
            });
            return newList;
        }, []);
        setSelectOptionList(newOptionList);
    }, [supplierList, shoppingLists, orderList]);

    useEffect(()=> {
        const newList:TotalOrderList = {};

        const [shoppingItemsToUse, noLinkShoppingItems]:[ShoppingItemListType, Array<TotalOrderItem>] = shoppingLists.filter(selectedFilterFunction).reduce<[ShoppingItemListType, Array<TotalOrderItem>]>(([linked, notLinked], list) => {
            if(list.items !== undefined) {
                list.items.forEach(item => {
                    const foundItem = shoppingItemList.find(shoppingItem => shoppingItem._id === item.item);
                    if(foundItem === undefined) return;
                    const id:string|undefined = foundItem.orderItem;
                    if(id === undefined) {
                        notLinked.push({
                            orderItemId: item.item,
                            orderItemName: foundItem.name,
                            orderItemQuantity: item.quantity
                        })
                    } else if(linked[id] === undefined){
                        linked[id] = {
                            shoppingItemId: item.item,
                            shoppingItemName: foundItem.name,
                            shoppingItemQuantity: 0,
                            isUsed: false
                        }
                        linked[id].shoppingItemQuantity += item.quantity;
                    }  
                })
            }
            return [linked, notLinked];
        }, [{}, []]);

        const findAndAddItem = (foundItem: IOrderItem = {_id:"---", name:"---", category:"---"}, quantity:number = 0, employee?: string):void => {
            const foundSupplier:ISupplier = (foundItem._id!=="---" && supplierList.find(supplier => supplier._id === foundItem?.supplier)) || {name:"---", _id:"---"};
            if(!(newList.hasOwnProperty(foundSupplier._id!))){
                newList[foundSupplier._id!] = {
                    supplierName: foundSupplier.name,
                    items:[]
                }
            }
            const newItem:TotalOrderItem = {
                orderItemId: foundItem._id!,
                orderItemName: foundItem.name,
                orderItemQuantity: quantity,
                shoppingItem: shoppingItemsToUse[foundItem._id!]
            }
            if(shoppingItemsToUse[foundItem._id!]) shoppingItemsToUse[foundItem._id!].isUsed = true;
            newList[foundSupplier._id!].items.push(newItem);
        }

        orderList.filter(selectedFilterFunction).forEach(order => {
            if(order.items !== undefined) {
                order.items.forEach(item => {
                    const foundItem = orderItemList.find(orderItem => item.item === orderItem._id);
                    findAndAddItem(foundItem, item.quantity);
                })
            }
        });

        for(let id in shoppingItemsToUse){
            if(shoppingItemsToUse[id].isUsed) continue;
            const foundItem = orderItemList.find(orderItem => id === orderItem._id);
            findAndAddItem(foundItem);
        }

        if(noLinkShoppingItems.length > 0) {
            if(!(newList.hasOwnProperty("---"))){
                newList["---"] = {
                    supplierName: "---",
                    items:[]
                }
            }
            newList["---"].items = newList["---"].items.concat(noLinkShoppingItems);
        }
        setTotalList(newList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateIndex.current, locationIndex.current, selectOptionList]);
    
    useEffect(()=> {
        const newDisplayList:DisplayItem[] = [];
        if(totalList["---"] !== undefined) {
            const newListItem:DisplayItem = {
                id:"---",
                name:"---",
                subItems:totalList["---"].items.map(item => {
                    return {
                        id:item.orderItemId,
                        name:item.orderItemName,
                        quantity:item.orderItemQuantity
                    };
                })
            }
            newDisplayList.push(newListItem);
        }
        for(let id in totalList){
            if(id==="---") continue;
            const newListItem:DisplayItem = {
                id,
                name:totalList[id].supplierName,
                subItems:totalList[id].items.map(item => {
                    const subItems:DisplayItem[]|undefined = item.shoppingItem?[{
                        id:item.shoppingItem.shoppingItemId,
                        name:item.shoppingItem.shoppingItemName,
                        quantity:item.shoppingItem.shoppingItemQuantity
                    }]:undefined;
                    return {
                        id: item.orderItemId,
                        name: item.orderItemName,
                        quantity: item.orderItemQuantity,
                        subItems
                    };
                })
            };
            newDisplayList.push(newListItem);
        }
        setDisplayList(newDisplayList);
        setIsLoading(false);
    }, [totalList]);

    const onSelectClick = (e:React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        dateIndex.current = parseInt(value);
        setIsLoading(true);
    }

    const onLocationClick = (e:React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        locationIndex.current = parseInt(value);
        setIsLoading(true);
    }

    const onCompleteClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        setShowWarning(true);
    }

    const onCompleteConfirmClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        setShowWarning(false);
    }

    return (
        <>
            {
                showWarning
                ?<WarningOverlayComponent
                    warning={text.totalOrder.markAsFinished}
                    setShowWarning={setShowWarning}
                    canCancel={true}
                    onClick={onCompleteConfirmClick}
                />
                :""
            }
            <div
                className={styles["topBar"]}
            >
                <div>
                    <select 
                        value={dateIndex.current}
                        onChange={onSelectClick}
                    >
                        <option value={-1}>{text.totalOrder.currentTotal}</option>
                        {
                            selectOptionList.map((option, index) => {
                                return (
                                    <option 
                                        key={option.value+index}
                                        value={index}
                                    >
                                        {option.display}
                                    </option>
                                )
                            })
                        }
                    </select>
                    <select 
                        value={locationIndex.current}
                        onChange={onLocationClick}
                    >
                        <option value={-1}>{text.totalOrder.allLocations}</option>
                        {
                            selectLocationList.map((location, index) => {
                                return (
                                    <option 
                                        key={location.value+index}
                                        value={index}
                                    >
                                        {location.display}
                                    </option>
                                )
                            })
                        }
                    </select>
                </div>
                {
                    dateIndex.current===-1 && locationIndex.current===-1
                    ?<ButtonComponent 
                        onClick={onCompleteClick}
                        name={text.totalOrder.completedButton}
                        bottomMargin="0px"
                    />
                    :""
                }
            </div>
            {
                isLoading
                ?<LoadingSpinner />
                :displayList.length > 0
                ?<ul className={styles["listUl"]}>
                    {displayList.map((listItem, index) => {
                        return (
                            <AccordionContent 
                                key={listItem.id+index} 
                                name={listItem.name} 
                                list={listItem.subItems!==undefined?listItem.subItems:[]}
                            />
                        );
                    })}
                </ul>
                :<h2>{text.totalOrder.noOrders}</h2>
            }  
        </>
    );
}

type AccordionContentProps = {
    list:DisplayItem[],
    name:string
}

const AccordionContent:React.FC<AccordionContentProps> = ({list, name})=>{
    const [isShown, setIsShown] = useState<boolean>(true);
    const INITIAL_MAX_HEIGHT = 10000;
    const maxHeightRef = useRef<number>(INITIAL_MAX_HEIGHT);
    const accordionRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        setIsShown(false);
    }, [])

    useEffect(()=> {
        if(accordionRef.current && maxHeightRef.current === INITIAL_MAX_HEIGHT){
            maxHeightRef.current = accordionRef.current.offsetHeight;
        }
    }, [isShown])

    const onHeaderClick = ()=> {
        setIsShown(oldState => !oldState);
    }

    return (
        <li className={styles["accordion"]}>
            <div 
                className={styles["accordionHeader"]}
                onClick={onHeaderClick}
            >
                <BsChevronDown
                    className={`${styles["showIcon"]} ${isShown?"":styles["rotated"]}`} 
                />
                <h4>{name}</h4>
            </div>
            <div
                className={styles["accordionContent"]}
                ref={accordionRef} 
                style={
                    isShown
                        ?{
                            maxHeight:maxHeightRef.current
                        }
                        :{
                            maxHeight:0
                        }
                }
            >
                <ul 
                >
                    {
                        list.map((listItem, index)=> {
                            return (
                                <li 
                                    key={listItem.id+index}
                                    className={styles["displayItem"]}
                                >
                                    <div className={styles["item"]}>
                                        <h5 className={styles["quantity"]}>{listItem.quantity}</h5>
                                        <h5>{listItem.name}</h5>
                                    </div>
                                    {
                                        listItem.subItems===undefined
                                        ?""
                                        :listItem.subItems.map((item, index) => {
                                                return (
                                                    <div
                                                        key={item.id+index}
                                                        className={styles["item"]}
                                                    >
                                                        <h6 className={styles["quantity"]}>+ {item.quantity!==undefined?item.quantity:""}</h6>
                                                        <h6>{item.name}</h6>
                                                    </div>
                                                );
                                        })
                                    }
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        </li>
    )
}
