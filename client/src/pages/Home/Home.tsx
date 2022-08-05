/* eslint-disable no-fallthrough */
import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import styles from "./../../css/home.module.css";

import { getEmployeesMostRecentLog, getLocations, getReminderByRoleId, getRemindersByIds, getRole, updateEmployeeLog } from "../../api";
import { accessRoleType, IEmployee, IEmployeeLog, NavListType, ReminderListType } from "../../type";
import { AdminComponent } from "../Admin";
import { RemindersComponent } from "../../components/RemindersComponent";
import { CheckOutComponent } from "../CheckOut";
import { LocationsComponent } from "../Locations";
import { NavBarComponent } from "../../components/NavBarComponent";
import { ShoppingComponent } from "../Shopping";
import { WarningOverlayComponent } from "../../components/WarningOverlayComponent";
import { ButtonComponent } from "../../components/ButtonComponent";
import { defaultEmployee, EmployeeContext, LanguageContext } from "../../App";

type Props = {
    token:string,
    setLoggedIn: Dispatch<SetStateAction<boolean>>,
    setEmployee: Dispatch<SetStateAction<Omit<IEmployee, "password">>>,
    reminderList: ReminderListType[],
    setReminderList: Dispatch<SetStateAction<ReminderListType[]>>
};

type ModulesType = "home"| "admin" | "check-out" | "ordering";

const defaultLog:IEmployeeLog = {
    employee: ""
}

const homeNavigation:NavListType[] = [{moduleName:"home", displayName:"Home"}]

export const HomeComponent:React.FC<Props> = ({token, setLoggedIn, setEmployee, reminderList, setReminderList}) => {
    const firstUpdate = useRef<boolean>(true);
    const employeeUpdated = useRef<boolean>(false);
    const [employeeLog, setEmployeeLog] = useState<IEmployeeLog>(defaultLog);
    const [activeModule, setActiveModule] = useState<ModulesType>("home");
    const [activeListModule, setActiveListModule] = useState<NavListType>({moduleName:"home", displayName:"Home"});
    const [accessRole, setAccessRole] = useState<accessRoleType>("Employee");
    const [navBarList, setNavBarList] = useState<NavListType[]>(homeNavigation);
    const [locationList, setLocationList] = useState<NavListType[]>([]);
    const [showCheckInWarning, setShowCheckInWarning] = useState<boolean>(false);
    const [isManager, setIsManager] = useState<boolean>(false);
    const text = useContext(LanguageContext);
    const employee = useContext(EmployeeContext);

    useEffect(()=> {
        if(employee===undefined || employee===defaultEmployee || employeeUpdated.current) return;
        const roleId = employee.role;
        if(navBarList===homeNavigation){
            getRole(roleId)
            .then(res => {
                const newRole = res.role;
                let accessibleNavigation:NavListType[] = [{moduleName:"home", displayName:text.navList.home}];
                const defaultNavigation:NavListType[]= [
                    {moduleName:"ordering", displayName:text.navList.ordering}
                ];
                switch(newRole?.type) {
                    case "Administrator":
                    case "Manager":
                        accessibleNavigation.push({moduleName:"admin", displayName:text.navList.admin});
                        setIsManager(true);
                        break;
                };
                accessibleNavigation = accessibleNavigation.concat(defaultNavigation);
                accessibleNavigation.push({moduleName:"check-out", displayName:text.navList.checkOut});
                setNavBarList(accessibleNavigation);
                setAccessRole(newRole?.type?newRole.type:"Employee");
            })
        }
        if(locationList.length === 0){
            getLocations()
            .then(locationsList => {
                setLocationList(
                    employee.access.reduce<NavListType[]>((result, element) => {
                        const foundLocations = locationsList.locations.find((mod) => {return (mod._id === element.locationId)});
                        if(foundLocations === undefined) return result;
                        const newAccessPoint = {
                            id:foundLocations._id,
                            moduleName:foundLocations.name,
                            displayName:foundLocations.name};
                        result.push(newAccessPoint);
                        return result;
                        }, [])
                    )
                })
            .catch(err => {
                console.log(err);
            });
        }
        getEmployeesMostRecentLog(employee._id!)
            .then(logResult => {
                setEmployeeLog(logResult.employeeLog!);
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
                    setAndReturnRemindersByRole()
                        .then(res => {
                            if((logResult.employeeLog?.reminder === undefined || (logResult.employeeLog.reminder.length === 0 && res.length !== 0)) && (employee.checkedIn === undefined || employee.checkedIn)){
                                setEmployee(oldEmployee => {
                                    const updatedEmployee = {...oldEmployee};
                                    updatedEmployee.checkedIn = false;
                                    return updatedEmployee;
                                });
                            }
                        })
                }
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=> {
        if(firstUpdate.current){
            firstUpdate.current = false;
            return;
        }
        setEmployeeLog(oldLog => {
            const newLog = {...oldLog};
            newLog.reminder = reminderList.map(reminder => {
                return {
                    reminderId: reminder.reminder._id!,
                    completed: reminder.completed
                }
            });
            if(newLog._id !== undefined && newLog._id !== "")
                updateEmployeeLog(newLog);
            return newLog;
        });
    }, [reminderList])

    const setAndReturnRemindersByRole = ():Promise<ReminderListType[]> => {
        return new Promise((resolve, reject) => {
            getReminderByRoleId(employee.role)
            .then(result => {
                const newReminders = result.reminders.map(reminder => {
                    return {reminder:reminder, completed:false};
                });
                setReminderList(newReminders);
                resolve(newReminders)
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }

    useEffect(()=> {
        setActiveModule(activeListModule.moduleName);
    }, [activeListModule])

    const onLogoutClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        setLoggedIn(false);
    }
    const onNavBarClick = (e:React.MouseEvent<HTMLAnchorElement>):void => {
        e.preventDefault();
        if(!employee || ((employee.checkedIn === undefined || employee.checkedIn === false) && accessRole !== "Administrator")){
            setShowCheckInWarning(true);
            return;
        }
        setActiveListModule({
            displayName:e.currentTarget.dataset.display!,
            moduleName:e.currentTarget.dataset.link!
        });
    }

    return (
        <>
            {showCheckInWarning?
                <WarningOverlayComponent
                    warning={text.homeScreen.checkIn.pleaseCheckIn}
                    setShowWarning={setShowCheckInWarning}/>
                :""
            }
            <div className={styles["header"]}>
                <h1>{"Hi " + employee.firstName}</h1>
                <ButtonComponent
                    onClick={onLogoutClick}
                    name={text.homeScreen.logout}
                    isNegativeColor={true}
                    bottomMargin={"10px"}
                />
            </div>
            <NavBarComponent 
                list={navBarList}
                currentActive={activeModule}
                onClick={onNavBarClick}
                isNegative={false}
                />
            {
                {
                    "home": <HomeScreen
                        setEmployee={setEmployee}
                        reminderList={reminderList}
                        setReminderList={setReminderList}
                        isManager={isManager}/>,
                    "admin":<AdminComponent
                        isAdmin={accessRole==="Administrator"}
                        currentEmployee={employee!}/>,
                    "shopping":<ShoppingComponent />,
                    "ordering":<LocationsComponent
                        accessList={locationList}
                        />,
                    "check-out":<CheckOutComponent
                        setEmployee={setEmployee}
                        reminderList={reminderList}
                        setReminderList={setReminderList}
                        setLoggedIn={setLoggedIn}/>,
                }[activeModule]
            }
        </>
    );
}


type HomeScreenProps = {
    setEmployee: Dispatch<SetStateAction<Omit<IEmployee, "password">>>,
    reminderList: ReminderListType[],
    setReminderList: Dispatch<SetStateAction<ReminderListType[]>>,
    isManager:boolean
}
const HomeScreen:React.FC<HomeScreenProps> = ({setEmployee, reminderList, setReminderList, isManager})=> {
    const [currentListView, setCurrentListView] = useState<string>("");
    const text = useContext(LanguageContext);
    const employee = useContext(EmployeeContext);
    
    const onCheckInClick = (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        setEmployee(prevEmployee => {
            const newEmployee = {...prevEmployee};
            newEmployee.checkedIn = true;
            return newEmployee;
        })
    }
    
    const onButtonClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        if(e.currentTarget.dataset.id === currentListView) {
            setCurrentListView("");
            return;
        }
        if(e.currentTarget.dataset.id === undefined) return;
        setCurrentListView(e.currentTarget.dataset.id);
    }

    return (
        <div className={styles["home"]}>
            {isManager?
                    <>
                        <div className={styles["managerButtons"]}>
                            <ButtonComponent
                                onClick={onButtonClick} 
                                name={text.homeScreen.viewShoppingList} 
                                id="shopping" 
                                isNegativeColor={currentListView==="shopping"}
                            />
                            <ButtonComponent
                                onClick={onButtonClick}
                                name={text.homeScreen.viewMessageList}
                                id="messages"
                                isNegativeColor={currentListView==="messages"}
                            />
                            <ButtonComponent
                                onClick={onButtonClick}
                                name={text.homeScreen.viewLogList}
                                id="logs"
                                isNegativeColor={currentListView==="logs"}
                            />
                        </div>
                        {
                            {
                                "shopping":<></>,
                                "messages":<></>,
                                "logs":<></>
                            }[currentListView]
                        }
                    </>
                :""}
            <p>{text?.homeScreen?.quote?text.homeScreen.quote:"\"People rarely succeed unless they have fun in what they are doing.\" -Dale Carnegie"}</p>
            <p>{text?.homeScreen?.title?text.homeScreen.title:"Be awesome, have fun!"}</p>
            <h3>{text?.homeScreen?.yourTaskList?text.homeScreen.yourTaskList:"Your tasks for today:"}</h3>
            <RemindersComponent
                reminderList={reminderList} 
                setReminderList={setReminderList} />
            {employee.checkedIn?"":<ButtonComponent onClick={onCheckInClick} name={text.homeScreen.checkIn.checkInButton}/>}
        </div>
    );
}