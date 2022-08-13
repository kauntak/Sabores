/* eslint-disable no-fallthrough */
import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import styles from "./../../css/home.module.css";

import { getEmployeesMostRecentLog, getLocations, getMessagesByEmployee, getReminderByRoleId, getRemindersByIds, getRole, updateEmployee, updateEmployeeLog } from "../../api";
import { accessRoleType, IEmployee, IEmployeeLog, IMessage, NavListType, ReminderListType } from "../../type";
import { AdminComponent } from "../Admin";
import { RemindersComponent } from "../../components/RemindersComponent";
import { CheckOutComponent } from "../CheckOut";
import { LocationsComponent } from "../Locations";
import { NavBarComponent } from "../../components/NavBarComponent";
import { ShoppingComponent } from "../Shopping";
import { WarningOverlayComponent } from "../../components/WarningOverlayComponent";
import { ButtonComponent } from "../../components/ButtonComponent";
import { defaultEmployee, EmployeeContext, LanguageContext } from "../../App";
import { ViewLogs } from "./ViewLogsComponent";
import { ViewShoppingList } from "./ViewShoppingListComponent";
import { ViewMessages } from "./ViewMessagesComponent";
import { Messages } from "../Messages";

type Props = {
    token:string,
    isLoggedIn:boolean,
    setLoggedIn: Dispatch<SetStateAction<boolean>>,
    setEmployee: Dispatch<SetStateAction<Omit<IEmployee, "password">>>
    setCanClearToken: Dispatch<SetStateAction<boolean>>
};

type ModulesType = "home"| "admin" | "check-out" | "ordering" | "timeSheet" | "messages";

const defaultLog:IEmployeeLog = {
    employee: ""
}

const homeNavigation:NavListType[] = [{moduleName:"home", displayName:"Home"}]

export const HomeComponent:React.FC<Props> = ({token, isLoggedIn, setLoggedIn, setEmployee, setCanClearToken}) => {
    const [employeeLog, setEmployeeLog] = useState<IEmployeeLog>(defaultLog);
    const [reminderList, setReminderList] = useState<ReminderListType[]>([]);
    const [activeModule, setActiveModule] = useState<ModulesType>("home");
    const [activeListModule, setActiveListModule] = useState<NavListType>({moduleName:"home", displayName:"Home"});
    const [accessRole, setAccessRole] = useState<accessRoleType>("Employee");
    const [navBarList, setNavBarList] = useState<NavListType[]>(homeNavigation);
    const [navBarUpdated, setNavBarUpdated] = useState<boolean>(false);
    const [locationList, setLocationList] = useState<NavListType[]>([]);
    const [showCheckInWarning, setShowCheckInWarning] = useState<boolean>(false);
    const [isManager, setIsManager] = useState<boolean>(false);
    const [messageList, setMessageList] = useState<IMessage[]>([]);
    const [isMessagesSorted, setIsMessagesSorted] = useState<boolean>(false);
    const text = useContext(LanguageContext);
    const employee = useContext(EmployeeContext);

    useEffect(()=> {
        if(isLoggedIn){
            if(employee===undefined || employee===defaultEmployee || employee._id===undefined) return;
            const roleId = employee.role;
            getRole(roleId)
            .then(res => {
                const newRole = res.role;
                setAccessRole(newRole?.type?newRole.type:"Employee");
                let accessibleNavigation:NavListType[] = [{moduleName:"home", displayName:text.navList.home}, {moduleName:"messages", displayName:text.navList.messages}];
                const defaultNavigation:NavListType[]= [
                    {moduleName:"ordering", displayName:text.navList.ordering}
                ];
                switch(newRole?.type) {
                    case "Administrator":
                    case "Manager":
                        if(newRole.type ==="Administrator") {
                            accessibleNavigation.push({moduleName:"timeSheet", displayName:text.navList.timeSheet});
                        }
                        accessibleNavigation.push({moduleName:"admin", displayName:text.navList.admin});
                        setIsManager(true);
                        break;
                };
                accessibleNavigation = accessibleNavigation.concat(defaultNavigation);
                accessibleNavigation.push({moduleName:"check-out", displayName:text.navList.checkOut});
                setNavBarList(()=> {
                    setNavBarUpdated(true);
                    return accessibleNavigation;
                });
            });
            getEmployeesMostRecentLog(employee._id)
            .then(logResult => {
                setEmployeeLog(logResult.log!);
                const reminderIds = logResult.log?.reminder?.map(r => r.reminderId);
                if(reminderIds && reminderIds.length > 0){
                    getRemindersByIds(reminderIds)
                    .then(employeeReminders => {
                        setReminderList(employeeReminders.reminders.map(reminder => {
                            return {
                                reminder:reminder,
                                isCompleted:logResult.log?.reminder?.find(r => r.reminderId === reminder._id)?.isCompleted||false
                            }
                        })
                        )
                    });
                } else {
                    setAndReturnDefaultRemindersByRole()
                    .then(res => {
                        if((logResult.log?.reminder === undefined || (logResult.log.reminder.length === 0 && res.length !== 0)) && (employee.checkedIn === undefined || employee.checkedIn)){
                            setEmployee(oldEmployee => {
                                const updatedEmployee = {...oldEmployee};
                                updatedEmployee.checkedIn = false;
                                return updatedEmployee;
                            });
                        }
                    })
                }
            });
            getMessagesByEmployee(employee._id)
            .then(res => {
                setMessageList(res.messages);
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn]);

    useEffect(()=>{
        getLocations()
        .then(locationsList => {
            let list:NavListType[] = accessRole==="Administrator"?[{id:"ordering", moduleName:"ordering", displayName:"Orders"}]:[];
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
                    }, list)
                )
            })
        .catch(err => {
            console.log(err);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessRole, employee.access]);

    const setAndReturnDefaultRemindersByRole = ():Promise<ReminderListType[]> => {
        return new Promise((resolve, reject) => {
            getReminderByRoleId(employee.role)
            .then(result => {
                const newReminders = result.reminders.map(reminder => {
                    return {reminder:reminder, isCompleted:false};
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
        setEmployeeLog(oldLog => {
            const newLog = {...oldLog};
            newLog.reminder = reminderList.map(reminder => {
                return {
                    reminderId: reminder.reminder._id!,
                    isCompleted: reminder.isCompleted
                }
            });
            return newLog;
        });
    }, [reminderList]);

    useEffect(()=> {
        if(employeeLog?._id !== undefined && employeeLog._id !== "")
            updateEmployeeLog(employeeLog);
    }, [employeeLog]);

    useEffect(()=> {
        if(employee?._id !== undefined && employee._id !== "")
            updateEmployee(employee);
        if(employeeLog?._id !== undefined && employeeLog._id !== ""){
            setEmployeeLog(oldLog => {
                const updatedLog = {...oldLog};
                if(employee.checkedIn) {
                    updatedLog.checkInTime = new Date();
                } else if(employee.checkedIn !== undefined && (employeeLog.checkInTime !== undefined || employeeLog.checkInTime !== null)) {
                    updatedLog.checkOutTime = new Date();
                }
                updateEmployeeLog(updatedLog);
                return updatedLog;
            })
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employee.checkedIn])

    useEffect(()=> {
        if(isMessagesSorted){
            setIsMessagesSorted(false);
            return;
        }
        if(navBarUpdated) {
            setNavBarUpdated(false);
            if(messageList.filter(message => !(message.isRead)).length > 0){
                setNavBarList(oldNavBar => {
                    if(oldNavBar.length === 1) return oldNavBar;
                    const newNavBar = [...oldNavBar];
                    newNavBar[1].isNotification = true;
                    return newNavBar;
                })
            } else {
                setNavBarList(oldNavBar => {
                    if(oldNavBar.length === 1) return oldNavBar;
                    const newNavBar = [...oldNavBar];
                    newNavBar[1].isNotification = false;
                    return newNavBar;
                })
            }
        }
        setMessageList(oldMessages => {
            setIsMessagesSorted(true);
            const newMessages = [...oldMessages];
            newMessages.sort((a,b) => {
                if(a.isRead && !b.isRead) {
                  return 1;
                } else if(!a.isRead && b.isRead) {
                  return -1;
                } else if(a.isRead && b.isRead) {
                  if(a.isLocked && !b.isLocked) return -1;
                  else if(!a.isLocked && b.isLocked) return 1;
                }
                if(a.date < b.date) return 1;
                else if(a.date > b.date) return -1;
                return 0;
              }
            );
            return newMessages;
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messageList, navBarList]);
    
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
                    "timeSheet":<></>,
                    "messages":<Messages 
                        messages={messageList}
                        setMessages={setMessageList}
                    />
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
        });
    }
    
    const onButtonClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.dataset.id;
        if(id === currentListView) {
            setCurrentListView("");
            return;
        }
        if(id === undefined) return;
        setCurrentListView(id);
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
                                name={text.homeScreen.viewLogList}
                                id="logs"
                                isNegativeColor={currentListView==="logs"}
                            />
                        </div>
                        {
                            {
                                "shopping":<ViewShoppingList/>,
                                "messages":<ViewMessages/>,
                                "logs":<ViewLogs/>
                            }[currentListView]
                        }
                    </>
                :""}
            <p>{text.homeScreen.quote}</p>
            <p>{text.homeScreen.title}</p>
            <h3>{text.homeScreen.yourTaskList}</h3>
            <RemindersComponent
                reminderList={reminderList} 
                setReminderList={setReminderList} />
            {employee.checkedIn?"":<ButtonComponent onClick={onCheckInClick} name={text.homeScreen.checkIn.checkInButton}/>}
        </div>
    );
}