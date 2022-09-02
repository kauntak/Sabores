import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./../../css/timeSheet.module.css";
import { BiCheckbox, BiCheckboxChecked } from "react-icons/bi";
import { getEmployeeLogs, getEmployees, getReminders } from "../../api";
import { IEmployee, IEmployeeLog, IReminder } from "../../type";
import { LanguageContext } from "../../App";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";

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
    isTimeOver?:boolean
}

const biWeekMilliseconds = 1209600000;
const timeOffsetMilliseconds = 0;
const timeoutMilliseconds = 54000000;
const millisecondToHour = (milliseconds:number) => Math.floor(milliseconds / 36000) / 100;


type WeekType ={
    startOfWeek: Date,
    endOfWeek: Date
}

const dateFormat:Intl.DateTimeFormatOptions = {
    year:"numeric",
    day:"numeric",
    month:"numeric"
};

const timeFormat:Intl.DateTimeFormatOptions = {
    hour:"2-digit",
    hour12: false,
    minute:"2-digit"
};

export const TimeSheet: React.FC<Props> = () => {
    const [logs, setLogs] = useState<IEmployeeLog[]>([]);
    const [employeeList, setEmployeeList] = useState<IEmployee[]>([]);
    const [reminderList, setReminderList] = useState<IReminder[]>([]);
    const [employeeIndex, setEmployeeIndex] = useState<number>(0);
    const [weekList, setWeekList] = useState<WeekType[]>([]);
    const [weekIndex, setWeekIndex] = useState<number>(0);
    const [totalHours, setTotalHours] = useState<number>(0);
    const [displayList, setDisplayList] = useState<DisplayItem[]>([]);
    const text = useContext(LanguageContext);

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
            setLogs(res.logs!);
            let oldestLogMilliseconds = new Date(Math.min(...res.logs!.map(log => log.checkInTime?.getTime() || Infinity)) - timeOffsetMilliseconds).setHours(0, 0, 0, 0);
            const newWeekList:WeekType[] = [];
            while(oldestLogMilliseconds < Date.now()){
                const endOfWeek = new Date(oldestLogMilliseconds +  biWeekMilliseconds - 1);
                newWeekList.unshift({
                    startOfWeek:new Date(oldestLogMilliseconds),
                    endOfWeek
                });
                oldestLogMilliseconds += biWeekMilliseconds;
            }
            setWeekList(newWeekList);
        });
    }, []);



    useEffect(()=> {
        const employee = employeeList[employeeIndex];
        const week = weekList[weekIndex];
        const newDisplayList:DisplayItem[]= logs.filter(log => 
            log.employee === employee._id && log.checkInTime !== undefined
            && (log.checkInTime || 0) > week.startOfWeek 
            && (log.checkInTime || Infinity) < week.endOfWeek
        ).sort((a, b) => (a.checkInTime?.getTime() || Infinity) - (b.checkInTime?.getTime() || Infinity)
        ).map(log=> {
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
                comment:log.comment,
                isTimeOver: ((log.checkOutTime?.getTime() || 0) - (log.checkInTime?.getTime() || 0)) === timeoutMilliseconds
            }
            return displayItem;
        });
        setDisplayList(newDisplayList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employeeIndex, weekIndex]);

    useEffect(()=>{
        const newTotal = displayList.reduce((total, log) => {
            if(log.timeOut===undefined) return total;
            const logTotal = log.timeOut.getTime() - log.timeIn.getTime();
            return total + logTotal;
        },0);
        setTotalHours(millisecondToHour(newTotal));
    },[displayList])
    
    const onWeekSelectChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
        const newIndex = e.currentTarget.selectedIndex;
        setWeekIndex(newIndex);
    }

    const onEmployeeSelectChange = (e?:React.ChangeEvent<HTMLSelectElement>, direction?:"+"|"-") => {
        const selectedIndex = e?.target.selectedIndex;
        setEmployeeIndex(oldIndex => {
            const newIndex:number =  selectedIndex!== undefined? selectedIndex : direction==="+"?oldIndex + 1: oldIndex - 1;
            if(newIndex < 0)
                return employeeList.length - 1;
            else if(newIndex === employeeList.length)
                return 0;
            return newIndex;
        })
    }

    const getPrevOrNextEmployeeName = (isPrev:boolean):string => {
        let index = isPrev? employeeIndex - 1 : employeeIndex + 1;
        if(index === employeeList.length){
            index = 0;
        } else if(index < 0){
            index = employeeList.length - 1;
        }
        const returnEmployee = employeeList[index];
        return returnEmployee?.firstName || "---";
    }

    return (
        <>
            <div className={styles["top"]}>
                <div
                    onClick={() => onEmployeeSelectChange(undefined, "-")}
                    className={styles["arrowDiv"]}
                >
                    <MdOutlineKeyboardArrowLeft className={styles["arrow"]}/>
                    <h5>{getPrevOrNextEmployeeName(true)}</h5>
                </div>
                <div className={styles["selector"]}>
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
                                        {`${week.startOfWeek.toLocaleDateString("en-US", dateFormat)} ~ ${week.endOfWeek.toLocaleDateString("en-US", dateFormat)}`}
                                    </option>
                                );
                            })
                        }
                    </select>
                    <h4>Total Hours: {totalHours} hrs</h4>
                </div>
                <div
                    onClick={() => onEmployeeSelectChange(undefined, "+")}
                    className={styles["arrowDiv"]}
                >
                    <h5>{getPrevOrNextEmployeeName(false)}</h5>
                    <MdOutlineKeyboardArrowRight  className={styles["arrow"]}/>
                </div>
            </div>
            <div className={styles["container"]}>
                <ul className={styles["list"]}>
                    <li>
                        <div className={`${styles["header"]} ${styles["listItem"]}`}>
                            <h4>
                                {text.timeSheet.date}
                            </h4>
                            <h4>
                                {text.timeSheet.timeIn}
                            </h4>
                            <h4>
                                {text.timeSheet.timeOut}
                            </h4>
                            <h4>
                                {text.timeSheet.shiftTotal}
                            </h4>
                        </div>
                    </li>
                    {
                        displayList.length > 0
                        ?displayList.map(list => <EmployeeTimeSheet log={list}/>)
                        :<li><h2>{text.timeSheet.noTimeSheets}</h2></li>
                    }
                </ul>
            </div>
        </>
        
    );
}

type EmployeeTimeSheetProps = {
    log:DisplayItem
}

const logTimeToString = (log:DisplayItem) => {
    const time = millisecondToHour(log.timeOut!.getTime() - log.timeIn.getTime());
    const timeString:string[] = (time + "").split(".");
    if(timeString.length === 1){
        timeString[1] = "";
    }
    while(timeString[1].length < 2){
        timeString[1] += "0" ;
    }
    return timeString.join(".") + " hrs";
}

const EmployeeTimeSheet: React.FC<EmployeeTimeSheetProps> = ({log}) => {
    const [isShown, setIsShown] = useState<boolean>(true);
    const INITIAL_MAX_HEIGHT = 10000;
    const maxHeightRef = useRef<number>(INITIAL_MAX_HEIGHT);
    const accordionRef = useRef<HTMLDivElement>(null);
    
    useEffect(()=>{
        setIsShown(false);
    }, [])

    useEffect(()=> {
        if(accordionRef.current && maxHeightRef.current === INITIAL_MAX_HEIGHT){
            maxHeightRef.current = accordionRef.current.offsetHeight;
        }
    }, [isShown])

    const onClick = (e:React.MouseEvent<HTMLDivElement>) => {
        setIsShown(oldState => !oldState);
    }

    return (
        <li>
            <div
                className={`${styles["accordionHeader"]} ${styles["listItem"]}`}
                onClick={onClick}
            >
                <h4>
                    {log.timeIn.toLocaleDateString("en-Us", dateFormat)}
                </h4>
                <h4>
                    {log.timeIn.toLocaleTimeString("en-Us", timeFormat)}
                </h4>
                <div className={styles["timeOut"]}>
                    {
                        log.timeOut !== undefined && log.timeIn.getDate() !== log.timeOut.getDate()
                        ?<h6>{log.timeOut.toLocaleDateString("en-Us", dateFormat)}</h6>
                        :<h6>{""}</h6>
                    }
                    <h4 className={styles["timeOutTime"]}>
                        {log.timeOut?.toLocaleTimeString("en-Us", timeFormat) || ""}
                    </h4>
                </div>
                {
                    log.timeOut
                    ?<h4>{logTimeToString(log)}</h4>
                    :""
                }
            </div>
            <div
                className={styles["accordionContent"]}
                style={
                    isShown
                    ?{
                        maxHeight: "100px"
                    }:{
                        maxHeight: 0
                    }
                }
                ref={accordionRef}
                onClick={onClick}
            >
                
                {
                    log.comment
                    ?<p>{log.comment}</p>
                    :""
                }
                <div className={styles["reminders"]}>
                    {log.reminders.map((reminder, index)=> {
                        return (
                            <div
                                className={styles["reminder"]}
                                key={index}
                            >
                                {reminder.isComplete?<BiCheckboxChecked/>:<BiCheckbox/>}
                                {reminder.reminder.description}
                            </div>
                        )
                    })}
                </div>
            </div>
        </li>
                    
    )
}