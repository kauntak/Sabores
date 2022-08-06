/* eslint-disable no-template-curly-in-string */
import React, {createContext, Dispatch, SetStateAction, useEffect, useState} from 'react';
import './App.css';

import { SetLanguageComponent } from './components/SetLanguageComponent';

import {LoginScreenComponent} from './components/LoginScreenComponent'
import { getEmployees, updateEmployee } from './api';
import { IEmployee, ReminderListType } from './type';
import { HomeComponent } from './pages/Home/Home';
import { IdleTimerComponent } from './components/IdleTimerComponent';


var currentToken:string = "";

export function getToken(){
  return currentToken;
}

const languages = ["es"];

const defaultText = {
  "setLanguage":{
      "title": "en",
      "language": "English",
      "flag_url": "https://flagcdn.com/16x12/gb.png"
  },
  "idleTimer":{
      "stillThere":"Are you still there?",
      "logout":"Logout",
      "continue":"Continue"
  },
  "loginScreen":{
      "employeeNamePlaceHolder":"Name",
      "passwordPlaceHolder":"Password",
      "showPassword":"Show Password",
      "loginButton":"Login",
      "nameRequiredError":"Name is required.",
      "nameNotFound":"*Name not found.",
      "passwordRequiredError":"*Password is required.",
      "unknownError":"An unknown error occurred."
  },
  "suggestionsList":{

  },
  "navList":{
    "orders":"Orders",
    "shopping":"Shopping",
    "employee":"Employees",
    "ordering":"Orders",
    "role":"Roles",
    "admin":"Admin",
    "checkOut":"Check Out",
    "home":"Home"
  },
  "homeScreen":{
      "logout": "Logout",
      "navBar": ["home", "admin", "check-out", "shopping", "locations"],
      "title":"Be awesome, have fun!",
      "quote":"\"People rarely succeed unless they have fun in what they are doing.\" -Dale Carnegie",
      "yourTaskList":"Your tasks for today:",
      "checkIn":{
          "pleaseCheckIn":"Please start day first.",
          "checkInButton":"Start the day"
      },
      "viewShoppingList":"Shopping List",
      "viewMessageList":"Messages",
      "viewLogList":"Logs"
  },
  "admin":{

  },
  "shopping":{

  },
  "checkOut":{
      "finishDay":"Do you Want to finish the day and log out?",
      "checkoutButton": "Finish the day"
  },
  "warning":{
      "ok":"OK",
      "cancel":"Cancel",
      "delete":"This will PERMANENTLY delete {replace}.",
      "canNotDelete": "{replace} is being used. Can not delete.",
      "canNotDeleteSelf": "You can not delete yourself."
  },
  "location":{
      "save": "Save Order"
  },
  "dataTable":{
    "searchToolTip":"Use commas to search different columns."
  }
};

export const defaultEmployee = {
  firstName:"",
  lastName:"",
  role:"",
  access: []
};

export const LanguageContext = createContext(defaultText);
export const EmployeeContext = createContext<IEmployee>(defaultEmployee);

const App:React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loginId, setLoginId] = useState("");
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [loggedInEmployee, setLoggedInEmployee] = useState<Omit<IEmployee, "password">>(defaultEmployee);
  const [reminderList, setReminderList] = useState<ReminderListType[]>([]);
  const [language, setLanguage] = useState<string>("en");
  const [token, setToken] = useState<string>("");
  // const [loginTimer, setLoginTimer] = useState<ReturnType<typeof setTimeout>>();
  
  const [textTranslations, setTextTranslations] = useState<any>(defaultText);

  useEffect(()=>{
      if(language==="en") {
        setTextTranslations(defaultText);
        return;
      }
      fetch(`assets/translations/${language}.json`, {
          headers: {
              'Content-Type': 'application/json',
              'Accept':'application/json'
          }
      }).then(res=> {
          return (res.json());
      }).then(res =>{
          setTextTranslations(res);
      });
  }, [language]);

  useEffect( () => {
    getEmployees()
      .then((res) => {
        setEmployees(res.employees);
      }).catch(err => {
        console.log(err);
      }) ;
  }, [])

  useEffect(()=> {
    currentToken = token;
    if(token !== "") {
      // setLoginTimer(setTimeout(()=> {
      //   setIsLoggedIn(false);
      // }, 600000))
      setIsLoggedIn(true);
    } else {
      // clearTimeout(loginTimer);
      setIsLoggedIn(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(()=> {
    if(!isLoggedIn && token !=="") {
      updateEmployee(loggedInEmployee)
        .then(()=> {
          setToken("");
        })
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return (
    <>
      {/* <IdleTimerComponent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} text={textTranslations.idleTimer}/> */}
      <LanguageContext.Provider value={textTranslations}>
        <SetLanguageComponent
          setLanguage={setLanguage}
          languages={languages}
        />
        <IdleTimerComponent 
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
        <div className="main-window">
          {isLoggedIn
            ?<EmployeeContext.Provider value={loggedInEmployee!}>
                <HomeComponent
                  token={token}
                  setLoggedIn={setIsLoggedIn}
                  setEmployee={setLoggedInEmployee as Dispatch<SetStateAction<Omit<IEmployee, "password">>>}
                  reminderList={reminderList}
                  setReminderList={setReminderList}
                />
              </EmployeeContext.Provider>
            :<LoginScreenComponent
              employeeList={employees}
              id={loginId}
              setId={setLoginId}
              setToken={setToken}
              setIsLoggedIn={setIsLoggedIn}
              setEmployee={setLoggedInEmployee}
            />
          }
        </div>
      </LanguageContext.Provider>
    </>
  )
}

export default App;