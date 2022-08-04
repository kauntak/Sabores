import React from "react";
import styles from "./../css/loadingSpinner.module.css"

export const LoadingSpinner:React.FC = () => {

    return (
        <div  className={styles["container"]}>
            <div className={styles["lds-ellipsis"]}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}