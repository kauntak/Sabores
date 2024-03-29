import React, { RefObject } from "react"
import styles from "./../css/button.module.css";

type Props = {
    onClick:(e:React.MouseEvent<HTMLButtonElement>) => void,
    name:string|JSX.Element,
    title?:string,
    isNegativeColor?:boolean,
    ref?:RefObject<HTMLButtonElement>,
    id?:string,
    width?:string,
    bottomMargin?:string
}


export const ButtonComponent:React.FC<Props> = ({onClick, name, title,isNegativeColor, ref, id, width, bottomMargin})=>{

    return (
        <>
            <button type="button"
                    className={isNegativeColor?`${styles["button"]} ${styles["negative"]}`:`${styles["button"]} ${styles["positive"]}`}
                    onClick={onClick}
                    title={title?title:""}
                    ref={ref}
                    data-id={id}
                    style={{width:width, marginBottom:bottomMargin}}
                    >
                {name}
            </button>
        </>
    )
}