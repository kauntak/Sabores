import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import styles from "./../../css/home.module.css";

import { getLocations, getRole } from "../../api";
import { accessRoleType, IEmployee, NavListType, ReminderListType } from "../../type";
import { AdminComponent } from "../Admin";
import { RemindersComponent } from "../../components/RemindersComponent";
import { CheckOutComponent } from "../CheckOut";
import { LocationsComponent } from "../Locations";
import { NavBarComponent } from "../../components/NavBarComponent";
import { ShoppingComponent } from "../Shopping";
import { WarningOverlayComponent } from "../../components/WarningOverlayComponent";
import { ButtonComponent } from "../../components/ButtonComponent";
import { LanguageContext } from "../../App";

type Props = {
    token:string,
    setLoggedIn: Dispatch<SetStateAction<boolean>>,
    employee:Omit<IEmployee, "password">|undefined,
    setEmployee: Dispatch<SetStateAction<Omit<IEmployee, "password">>>,
    reminderList: ReminderListType[],
    setReminderList: Dispatch<SetStateAction<ReminderListType[]>>
};

type ModulesType = "home"| "admin" | "check-out" | "shopping" | "location";



export const HomeComponent:React.FC<Props> = ({token, setLoggedIn, employee, setEmployee, reminderList, setReminderList}) => {
    const [activeModule, setActiveModule] = useState<ModulesType>("home");
    const [activeListModule, setActiveListModule] = useState<NavListType>({moduleName:"home", displayName:"Home"});
    const [accessRole, setAccessRole] = useState<accessRoleType>("Employee");
    const [navBarList, setNavBarList] = useState<NavListType[]>([{moduleName:"home", displayName:"Home"}]);
    const [locationList, setLocationList] = useState<NavListType[]>([]);
    const [showCheckInWarning, setShowCheckInWarning] = useState<boolean>(false);
    const [isManager, setIsManager] = useState<boolean>(false);
    const text = useContext(LanguageContext);

    useEffect(()=> {
        if(employee===undefined) return;
        const roleId = employee.role;
        getRole(roleId)
        .then(res => {
            const newRole = res.role;
            console.log(newRole);
            let accessibleNavigation:NavListType[] = [{moduleName:"home", displayName:text.navList.home}];
            const defaultNavigation:NavListType[]= [
                {moduleName:"shopping", displayName:text.navList.shopping},
                {moduleName:"location", displayName:text.navList.location}
            ];
            switch(newRole?.type) {
                // eslint-disable-next-line no-fallthrough
                case "Administrator":
                case "Manager":
                    accessibleNavigation.push({moduleName:"admin", displayName:text.navList.admin});
                    accessibleNavigation = accessibleNavigation.concat(defaultNavigation);
                    setIsManager(true);
                    break;
                case "Employee":
                default:
                    accessibleNavigation = accessibleNavigation.concat(defaultNavigation);
                    accessibleNavigation.push({moduleName:"check-out", displayName:text.navList.checkOut});
            };
            setNavBarList(accessibleNavigation);
            setAccessRole(newRole?.type?newRole.type:"Employee");
            })
        
        getLocations().then(locationsList => {
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
        }).catch(err => {
            console.log(err);
        })
    }, [employee]);

    useEffect(()=> {
        setActiveModule(activeListModule.moduleName);
    }, [activeListModule])

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
            <NavBarComponent 
                list={navBarList}
                currentActive={activeModule}
                onClick={onNavBarClick}
                isNegative={false}
                />
            {
                {
                    "home": <HomeScreen 
                        employee={employee!}
                        setEmployee={setEmployee}
                        reminderList={reminderList}
                        setReminderList={setReminderList}
                        isManager={isManager}/>,
                    "admin":<AdminComponent
                        isAdmin={accessRole==="Administrator"}
                        currentEmployee={employee!}/>,
                    "shopping":<ShoppingComponent />,
                    "location":<LocationsComponent
                        locationList={locationList}
                        text={text}/>,
                    "check-out":<CheckOutComponent 
                        employee={employee!}
                        setEmployee={setEmployee}
                        reminderList={reminderList}
                        setReminderList={setReminderList}
                        setLoggedIn={setLoggedIn}
                        text={text}/>,
                }[activeModule]
            }
        </>
    );
}


type HomeScreenProps = {
    employee:Omit<IEmployee, "password">,
    setEmployee: Dispatch<SetStateAction<Omit<IEmployee, "password">>>,
    reminderList: ReminderListType[],
    setReminderList: Dispatch<SetStateAction<ReminderListType[]>>,
    isManager:boolean
}
const HomeScreen:React.FC<HomeScreenProps> = ({employee, setEmployee, reminderList, setReminderList, isManager})=> {
    const [currentListView, setCurrentListView] = useState<string>("");
    const text = useContext(LanguageContext);
    
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
                employee={employee} 
                reminderList={reminderList} 
                setReminderList={setReminderList} />
            {employee.checkedIn?"":<ButtonComponent onClick={onCheckInClick} name={text.homeScreen.checkIn.checkInButton}/>}
        </div>
    );
}