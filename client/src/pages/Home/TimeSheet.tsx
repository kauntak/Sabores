import React, { useEffect, useState } from "react";
import { IEmployee, IEmployeeLog, IReminder } from "../../type";

type Props = {

}

type DisplayItem = {
    timeIn: Date,
    timeOut?: Date,
    reminders: {
        reminder:IReminder, 
        isComplete:boolean
    }[],
    comment?:string
    
}

export const TimeSheet: React.FC<Props> = ({}) => {
    const [logs, setLogs] = useState<IEmployeeLog[]>([]);
    const [employeeList, setEmployeeList] = useState<IEmployee[]>([]);
    const [employeeIndex, setEmployeeIndex] = useState<number>(0);
    const [weekList, setWeekList] = useState<IEmployeeLog[][]>([]);
    const [weekIndex, setWeekIndex] = useState<number>(0);
    const [displayList, setDisplayList] = useState<DisplayItem[]>([]);

    useEffect(()=> {
        const newDisplayList:DisplayItem[] = [];
        setDisplayList(newDisplayList);
    }, [employeeIndex, weekIndex])
    
    return (
        <>
        </>
    );
}