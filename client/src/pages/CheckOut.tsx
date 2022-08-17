import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { updateEmployee, updateEmployeeLog } from "../api";
import { EmployeeContext, LanguageContext } from "../App";
import { ButtonComponent } from "../components/ButtonComponent";
import { RemindersComponent } from "../components/RemindersComponent";
import { WarningOverlayComponent } from "../components/WarningOverlayComponent";
import { IEmployee, IEmployeeLog, ReminderListType } from "../type";


type Props = {
    setEmployee: Dispatch<SetStateAction<Omit<IEmployee, "password">>>,
    reminderList: ReminderListType[],
    setReminderList: Dispatch<SetStateAction<ReminderListType[]>>,
    setLoggedIn: Dispatch<SetStateAction<boolean>>,
    log:IEmployeeLog
}
export const CheckOutComponent:React.FC<Props> = ({reminderList, setReminderList, setLoggedIn, log}) => {
    const [showCheckoutWarning, setShowCheckOutWarning] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");
    const text = useContext(LanguageContext);
    const employee = useContext(EmployeeContext);

    const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.currentTarget.value);
    }


    const onCheckOutClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        setShowCheckOutWarning(true);
    }

    const onFinishDayClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        const newEmployee = {...employee};
        newEmployee.checkedIn = false;
        const newLog = {...log};
        newLog.checkOutTime = new Date();
        updateEmployee(newEmployee)
        .then(res => {
            updateEmployeeLog(newLog)
            .then(res => {
                setLoggedIn(false);
            })
        })
        
    }

    return (
        <>
            {
                showCheckoutWarning
                ?<WarningOverlayComponent 
                    warning={text.checkOut.finishDay} 
                    onClick={onFinishDayClick}
                    setShowWarning={setShowCheckOutWarning} 
                    canCancel={true}/>
                :""
            }
            <RemindersComponent
                reminderList={reminderList}
                setReminderList={setReminderList}
            />
            <div
                style={
                    {
                        display:"flex",
                        flexDirection:"column",
                        margin: "10px",
                        width: "400px"
                    }
                }
            >
                <label htmlFor="logComment">{text.checkOut.comment}:</label>
                <textarea
                    value={comment}
                    onChange={onChange}
                />
            </div>
            <ButtonComponent
                onClick={onCheckOutClick}
                name={text.checkOut.checkoutButton}
                isNegativeColor={true}
            />
        </>
    );
}