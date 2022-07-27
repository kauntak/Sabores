import React, { useEffect, useState } from "react";
import { NavListType } from "../type";
import { NavBarComponent } from "../components/NavBarComponent";
import { ButtonComponent } from "../components/ButtonComponent";


type Props = {
    locationList: NavListType[],
    text:any
}

export const LocationsComponent:React.FC<Props> = ({locationList, text}) => {
    const [currentLocation, setCurrentLocation] = useState<NavListType>({displayName:"", moduleName:""});
    
    useEffect(()=> {
        setCurrentLocation(locationList[0]);
    }, [locationList])


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
            <NavBarComponent 
                list={locationList}
                currentActive={currentLocation.moduleName}
                onClick={onClick}
                isNegative={true}
                />
            
            <LocationComponent locationName={currentLocation.displayName} id={currentLocation.id!} text={text}/>
        </>
    );
}

type LocationComponentProp = {
    locationName:string,
    id:string,
    text: any
}

const LocationComponent:React.FC<LocationComponentProp> = ({locationName, id, text}) => {

    const newOrderClick = (e:React.MouseEvent<HTMLButtonElement>) => {

    }

    return (
        <>
            <h1>{locationName}</h1>
            <ButtonComponent 
                name={text?.location.newOrder?text.location.newOrder:"New Order"}
                onClick={newOrderClick}
                />
        </>
    )
}