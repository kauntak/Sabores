import React, { useContext, useEffect, useState } from "react";
import { EmployeeContext } from "../../App";
import { IShoppingList } from "../../type";

type Props = {

}

export const ViewShoppingList: React.FC<Props> = ({}) => {
    const [activeShoppingList, setActiveShoppingList] = useState<string>("");
    const [shoppingLists, setShoppingLists] = useState<IShoppingList[]>([]);
    const employee = useContext(EmployeeContext);

    useEffect(()=>{
        
    },[])
    
    return (
        <>
        </>
    );
}