import React, { Dispatch, SetStateAction, useEffect } from "react";
import styles from "./../css/reminders.module.css";

import { getEmployeesMostRecentLog, getReminderByRoleId, getRemindersByIds } from "../api";
import { IEmployee, ReminderListType } from "../type";


type Props = {
    employee:Omit<IEmployee, "password">,
    reminderList: ReminderListType[],
    setReminderList: Dispatch<SetStateAction<ReminderListType[]>>,
}

export const RemindersComponent:React.FC<Props> = ({employee, reminderList, setReminderList}) => {
    useEffect(()=> {
        console.log(employee);
        if(reminderList.length > 0) return;
        if(employee.checkedIn){
            getEmployeesMostRecentLog(employee._id!)
                .then(logResult => {
                    const reminderIds = logResult.employeeLog?.reminder?.map(r => r.reminderId);
                    if(reminderIds){
                        getRemindersByIds(reminderIds)
                            .then(employeeReminders => {
                                setReminderList(employeeReminders.reminders.map(reminder => {
                                    return {
                                        reminder:reminder,
                                        completed:logResult.employeeLog?.reminder?.find(r => r.reminderId === reminder._id)?.completed||false
                                    }
                                })
                                )
                            });
                    } else {
                        setRemindersByRole();
                    }
                })
        } else {
            setRemindersByRole();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employee])

    const setRemindersByRole = ()=> {
        getReminderByRoleId(employee.role)
        .then(result => {
            setReminderList(
                result.reminders.map(reminder => {
                    return {reminder:reminder, completed:false};
                })
            );
        }).catch(err => {
            console.log(err);
        });
    }


    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const isCompleted:boolean = e.currentTarget.checked;
        const id:string = e.currentTarget.dataset.id!;
        setReminderList((previousReminderList) => {
            return previousReminderList.map(reminder=> {
                if(reminder.reminder._id === id){
                    return {
                        reminder:reminder.reminder,
                        completed: isCompleted
                    }
                } else return reminder;
            })
        });
    }

    return (
        <ul className={styles["reminderUL"]}>
                {reminderList.map((reminderItem, index) => {
                    return (
                        <li>
                            <input type="checkBox"
                                checked={reminderItem.completed}
                                key={reminderItem.reminder._id! + index}
                                id={reminderItem.reminder._id}
                                data-id={reminderItem.reminder._id}
                                onChange={onChange}/>
                            <label htmlFor={reminderItem.reminder._id}>{reminderItem.reminder.description}</label>
                        </li>
                    );
                })}
            </ul>
    );
}