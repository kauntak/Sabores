import React from "react";
import styles from "./../css/navBar.module.css";

import { NavListType } from "../type";


type Props = {
    list: NavListType[],
    currentActive:string,
    isNegative:boolean,
    onClick:(e:React.MouseEvent<HTMLAnchorElement>) => void
};


export const NavBarComponent:React.FC<Props> = ({list, currentActive, isNegative, onClick}) => {


    
    return (
        <div className={`${isNegative? styles["negative"]:styles["positive"]} ${styles["navBar"]}`}>
            <ul>
                {list.map(listItem =>
                    <NavBarLink
                        key={listItem.id+listItem.displayName}
                        displayName={listItem.displayName}
                        moduleName={listItem.moduleName}
                        isNegative={isNegative}
                        id={listItem.id}
                        isActive={currentActive===listItem.moduleName}
                        onClick={onClick}
                        />
                    )}
            </ul>
        </div>
    );
}

type LinkProps = {
    displayName:string,
    moduleName:string,
    id?:string,
    isNegative:boolean,
    isActive:boolean,
    onClick: (e:React.MouseEvent<HTMLAnchorElement>)=>void,
}

const NavBarLink:React.FC<LinkProps> = ({displayName, moduleName, id, isNegative, isActive, onClick}) => {
    return (
        <li className={`${isNegative? styles["negativeLink"]:styles["positiveLink"]} ${isActive?styles["active"]:""}`}>
            <a
                href={moduleName}
                onClick={onClick}
                data-id={id}
                data-link={moduleName}
                data-display={displayName}
            >{displayName}</a>
        </li>
    );
}