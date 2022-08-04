import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { LanguageContext } from "../App";
import { ButtonComponent } from "../components/ButtonComponent";
import { RemindersComponent } from "../components/RemindersComponent";
import { WarningOverlayComponent } from "../components/WarningOverlayComponent";
import { IEmployee, ReminderListType } from "../type";


type Props = {
    setEmployee: Dispatch<SetStateAction<Omit<IEmployee, "password">>>,
    reminderList: ReminderListType[],
    setReminderList: Dispatch<SetStateAction<ReminderListType[]>>,
    setLoggedIn: Dispatch<SetStateAction<boolean>>
}
export const CheckOutComponent:React.FC<Props> = ({reminderList, setReminderList, setLoggedIn}) => {
    const [showCheckoutWarning, setShowCheckOutWarning] = useState<boolean>(false);
    const text = useContext(LanguageContext);

    const onCheckOutClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        setShowCheckOutWarning(true);
    }

    const onFinishDayClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        
    }

    return (
        <>
            {showCheckoutWarning?
                <WarningOverlayComponent 
                    warning={text.checkOut.finishDay} 
                    onClick={onFinishDayClick}
                    setShowWarning={setShowCheckOutWarning} 
                    canCancel={true}/>
                :""}
            <RemindersComponent
                reminderList={reminderList}
                setReminderList={setReminderList}
                />
            <ButtonComponent
                onClick={onCheckOutClick}
                name={text.checkOut.checkoutButton}
                isNegativeColor={true}/>
        </>
    );
}