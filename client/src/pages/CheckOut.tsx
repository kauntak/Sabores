import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { updateEmployee, updateEmployeeLog } from "../api";
import { EmployeeContext, LanguageContext, WarningContext } from "../App";
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
    const [comment, setComment] = useState<string>("");
    const text = useContext(LanguageContext);
    const employee = useContext(EmployeeContext);
    const warning = useContext(WarningContext);

    const CommentComponent:React.FC<{comment:string, onChange:(e:React.ChangeEvent<HTMLTextAreaElement>) =>void}> = ()=>{
        return (
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
        );
    }
    useEffect(()=> {
        warning.reset();
        warning.setMessage(text.checkOut.finishDay);
        warning.setOnClick(onFinishDayClick);
        warning.setExtraComponent(CommentComponent);
        warning.setCanCancel(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.currentTarget.value);
    }


    const onCheckOutClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        warning.setShow(true);
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
            <RemindersComponent
                reminderList={reminderList}
                setReminderList={setReminderList}
            />
            <ButtonComponent
                onClick={onCheckOutClick}
                name={text.checkOut.checkoutButton}
                isNegativeColor={true}
            />
        </>
    );
}