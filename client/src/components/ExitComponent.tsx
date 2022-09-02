import React  from "react";
import styles from "./../css/exit.module.css";

type Props = {
    onClick: (event:React.MouseEvent<HTMLSpanElement>)=>void
}

export const ExitComponent:React.FC<Props> = ({onClick}) => {

    return (
        <>
        <span onClick={onClick} className={styles["close"]}>&times;</span>
        </>
    )
}