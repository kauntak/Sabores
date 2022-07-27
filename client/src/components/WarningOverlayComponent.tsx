import React, { Dispatch, SetStateAction, useContext } from "react";
import { LanguageContext } from "../App";
import styles from "./../css/warningOverlay.module.css"
import { ButtonComponent } from "./ButtonComponent";

type Props = {
    warning:string,
    setShowWarning: Dispatch<SetStateAction<boolean>>
    onClick?:(e:React.MouseEvent<HTMLButtonElement>)=>void,
    canCancel?: boolean
}

export const WarningOverlayComponent:React.FC<Props> = ({warning, setShowWarning, onClick, canCancel})=> {
    const text = useContext(LanguageContext);

    const onButtonClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if(onClick){
            onClick(e);
        }
        setShowWarning(false);
    }

    const onCancelClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        setShowWarning(false);
    }

    return (
        <div className={styles["overlay"]}>
            <div className={styles["warningBox"]}>
                <h2>{warning}</h2>
                <div className={styles["buttonsDiv"]}>
                    {canCancel?
                        <ButtonComponent onClick={onCancelClick} name={text.warning.cancel} isNegativeColor={true}/>
                        :""}
                    <ButtonComponent onClick={onButtonClick} name={text.warning.ok} isNegativeColor={canCancel?false:true}/>
                </div>
            </div>
        </div>
    );

}