import React, { Dispatch, SetStateAction, useState } from "react";
import { ButtonComponent } from "../components/ButtonComponent";
import { RemindersComponent } from "../components/RemindersComponent";
import { WarningOverlayComponent } from "../components/WarningOverlayComponent";
import { IEmployee, ReminderListType } from "../type";


type Props = {
    employee:Omit<IEmployee, "password">,
    setEmployee: Dispatch<SetStateAction<Omit<IEmployee, "password">>>,
    reminderList: ReminderListType[],
    setReminderList: Dispatch<SetStateAction<ReminderListType[]>>,
    setLoggedIn: Dispatch<SetStateAction<boolean>>,
    text: any
}
export const CheckOutComponent:React.FC<Props> = ({employee, reminderList, setReminderList, setLoggedIn, text}) => {
    const [showCheckoutWarning, setShowCheckOutWarning] = useState<boolean>(false);

    const onCheckOutClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        setShowCheckOutWarning(true);
    }

    const onFinishDayClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        
    }

    return (
        <>
            {showCheckoutWarning?
                <WarningOverlayComponent 
                    warning={text?.checkOut.finishDay?text.checkOut.finishDay:"Do you Want to finish the day and log out?"} 
                    onClick={onFinishDayClick}
                    setShowWarning={setShowCheckOutWarning} 
                    canCancel={true}/>
                :""}
            <RemindersComponent 
                employee={employee}
                reminderList={reminderList}
                setReminderList={setReminderList}
                />
            <ButtonComponent
                onClick={onCheckOutClick}
                name={text?.checkOut?.checkoutButton?text.checkOut.checkoutButton:"Finish the day"}
                isNegativeColor={true}/>
        </>
    );
}