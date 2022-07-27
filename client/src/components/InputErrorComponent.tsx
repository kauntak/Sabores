import React from "react"
import styles from "./../css/inputError.module.css"

type Props = {
    isDisplayed:boolean,
    message:string
}

export const InputErrorComponent:React.FC<Props> = ({isDisplayed, message})=>{

    return (
        <>
            {isDisplayed?<p className={styles["error"]}>{message}</p>:""}
        </>
    );
}