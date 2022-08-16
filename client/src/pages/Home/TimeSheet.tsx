import React, { useEffect, useState } from "react";
import { getEmployeeLogs, getEmployees, getReminders } from "../../api";
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

const biWeekTime = 1209600000;
const timeOffset = 0;

const timeoutTime = 54000000;

type WeekType ={
    startOfWeek: Date,
    endOfWeek: Date
}

const timeFormat:Intl.DateTimeFormatOptions = {
    year:"numeric",
    day:"numeric",
    month:"numeric"
};

export const TimeSheet: React.FC<Props> = ({}) => {
    const [logs, setLogs] = useState<IEmployeeLog[]>([]);
    const [employeeList, setEmployeeList] = useState<IEmployee[]>([]);
    const [reminderList, setReminderList] = useState<IReminder[]>([]);
    const [employeeIndex, setEmployeeIndex] = useState<number>(0);
    const [weekList, setWeekList] = useState<WeekType[]>([]);
    const [weekIndex, setWeekIndex] = useState<number>(0);
    const [totalHours, setTotalHours] = useState<number>(0);
    const [displayList, setDisplayList] = useState<DisplayItem[]>([]);

    useEffect(()=> {
        getReminders()
        .then(res => {
            setReminderList(res.reminders);
        })
        getEmployees()
        .then(res => {
            setEmployeeList(res.employees.sort((a,b) => a.firstName.localeCompare(b.firstName)));
        });
        getEmployeeLogs()
        .then(res => {
            console.log(res);
            setLogs(res.logs!);
            const oldestLogDate = new Date(Math.min(...res.logs!.map(log => log.checkInTime?.getTime() || Infinity)) - timeOffset);
            oldestLogDate.setHours(0, 0, 0, 0);
            const newWeekList:WeekType[] = [];
            while(oldestLogDate < new Date()){
                const endOfWeek = new Date(oldestLogDate.getTime() +  biWeekTime - 1);
                newWeekList.unshift({
                    startOfWeek:oldestLogDate,
                    endOfWeek
                });
                oldestLogDate.setDate(oldestLogDate.getDate() + 14);
            }
            setWeekList(newWeekList);
        });
    }, []);



    useEffect(()=> {
        const employee = employeeList[employeeIndex];
        const week = weekList[weekIndex];
        const newDisplayList:DisplayItem[]= logs.filter(log => 
            log.employee === employee._id 
            && (log.checkInTime || 0) > week.startOfWeek 
            && (log.checkInTime || Infinity) < week.endOfWeek)
        .sort((a, b) => (a.checkInTime?.getTime() || Infinity) - (b.checkInTime?.getTime() || Infinity))
        .map(log=> {
            const displayItem:DisplayItem = {
                timeIn:log.checkInTime!,
                timeOut:log.checkOutTime,
                reminders:log.reminder?.map(reminder => {
                    const foundReminder = reminderList.find(r => r._id === reminder.reminderId);
                    return {
                        reminder: foundReminder || {description:"---", role:""},
                        isComplete: reminder.isCompleted
                    }
                }) || [],
                comment:log.comment
            }
            return displayItem;
        })
        setDisplayList(newDisplayList);
    }, [employeeIndex, weekIndex]);

    useEffect(()=>{
        const milliToHour = (milliseconds:number) => Math.floor(milliseconds / 36000) / 100;
        const quarterHourTime = 900000;
        const newTotal = displayList.reduce((total, log) => {
            if(log.timeOut===undefined) return total;
            const logTotal = log.timeOut.getTime() - log.timeIn.getTime();
            return total + logTotal;
        },0);
        setTotalHours(milliToHour(newTotal));
    },[displayList])
    
    const onWeekSelectChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
        const newIndex = e.currentTarget.selectedIndex;
        setWeekIndex(newIndex);
    }

    const onEmployeeSelectChange = (e?:React.ChangeEvent<HTMLSelectElement>, direction?:"+"|"-") => {
        setEmployeeIndex(oldIndex => {
            const newIndex:number = e?.currentTarget.selectedIndex || direction==="+"?oldIndex + 1: oldIndex - 1;
            if(newIndex < 0)
                return employeeList.length - 1;
            else if(newIndex === employeeList.length)
                return 0;
            return newIndex;
        })
    }

    return (
        <>
            <div>
                
                <div>
                    <select
                        value={employeeIndex}
                        onChange={onEmployeeSelectChange}
                    >
                        {
                            employeeList.map((employee, index) => {
                                return (
                                    <option
                                        value={index}
                                        key={employee._id||"" + index}
                                    >
                                        {`${employee.firstName} ${employee.middleName?`${employee.middleName} `:""}${employee.lastName}`}
                                    </option>
                                );
                            })
                        }
                    </select>
                    <select
                        value={weekIndex}
                        onChange={onWeekSelectChange}
                    >
                        {
                            weekList.map((week, index)=> {
                                return (
                                    <option
                                        value={index}
                                        key={week.startOfWeek.getTime() + "" + index}
                                    >
                                        {`${week.startOfWeek.toLocaleDateString("en-US", timeFormat)} ~ ${week.endOfWeek.toLocaleDateString("en-US", timeFormat)}`}
                                    </option>
                                );
                            })
                        }
                    </select>
                </div>
            </div>
            <EmployeeTimeSheet logs={displayList}/>
        </>
        
    );
}

type EmployeeTimeSheetProps = {
    logs:DisplayItem[]
}

const EmployeeTimeSheet: React.FC<EmployeeTimeSheetProps> = ({logs}) => {
    return (
        <div>
            {
                logs.map(log => {
                    return (
                        <li
                        >

                        </li>
                    )
                })
            }
        </div>
    )
}