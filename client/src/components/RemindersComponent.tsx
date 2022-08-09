import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { ReminderListType } from "../type";
import styles from "./../css/reminders.module.css";


type Props = {
    reminderList: ReminderListType[],
    setReminderList: Dispatch<SetStateAction<ReminderListType[]>>,
}

export const RemindersComponent:React.FC<Props> = ({reminderList, setReminderList}) => {

    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const isCompleted:boolean = e.currentTarget.checked;
        const id:string = e.currentTarget.dataset.id!;
        setReminderList((previousReminderList) => {
            return previousReminderList.map(reminder=> {
                if(reminder.reminder._id === id){
                    return {
                        reminder:reminder.reminder,
                        isCompleted: isCompleted
                    }
                } else return reminder;
            })
        });
    }

    return (
        <ul className={styles["reminderUL"]}>
                {reminderList.map((reminderItem, index) => {
                    return (
                        <li
                            key={reminderItem.reminder._id! + index+ reminderItem.isCompleted}
                        >
                            <input type="checkBox"
                                checked={reminderItem.isCompleted}
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