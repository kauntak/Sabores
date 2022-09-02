/* eslint-disable no-template-curly-in-string */
import React, {createContext, Dispatch, SetStateAction, useEffect, useState} from 'react';
import './App.css';

import { SetLanguageComponent } from './components/SetLanguageComponent';

import {LoginScreenComponent} from './components/LoginScreenComponent'
import { getEmployees, updateEmployee } from './api';
import { IEmployee } from './type';
import { HomeComponent } from './pages/Home/Home';
import { IdleTimerComponent } from './components/IdleTimerComponent';


var currentToken:string = "";

export function getToken():Promise<string>|string{
  if(currentToken===""){
    return new Promise(resolve => {
      let timerCount = 0;
      const tokenTimer = setTimeout(()=> {
        if(currentToken !== ""){
          clearInterval(tokenTimer);
          resolve(currentToken)
        }else if(timerCount >= 50){
          clearInterval(tokenTimer)
          resolve("");
        }
        timerCount++;
      }, 5)

    });
  } else return currentToken;
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
    "home":"Home",
    "messages":"Messages",
    "timeSheet":"Time Cards",
    "locations":"Locations"
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
      "hi":"Hi {replace}!"
  },
  "admin":{
    "shopping":{
      "categories":"Categories",
      "items":"Items"
    },
    "orders":{
      "categories":"Order Categories",
      "items":"Order Items",
      "suppliers": "Suppliers"
    },
    "roles":{
      "roles":"Roles",
      "tasks":"Tasks"
    },
    "select":"Select..."
  },
  "list":{
    "addCategory": "Add Category",
    "addItem":"Add Item",
    "addSupplier":"Add Supplier",
    "name":"Name",
    "category":"Category",
    "description":"Description",
    "edit":"Edit {replace}",
    "supplier":"Supplier",
    "bulkItem": "Bulk Item Link",
    "type":"Type",
    "addRole":"Add Role",
    "addReminder":"Add Task",
    "editReminder": "Edit Task",
    "role":"Role",
    "addLocation":"Add Location",
    "yes":"Yes",
    "no":"No",
    "addEmployee":"Add Employee",
    "isMain": "Is Main?",
    "firstName":"First Name",
    "middleName":"Middle Name",
    "firstAndMiddle":"First/Middle Name",
    "lastName":"Last Name",
    "password":"Password",
    "confirmPassword":"Confirm Password",
    "access":"Locations",
    "email":"e-Mail",
    "phone": "Phone Number",
    "address":"Address"
  },
  "checkOut":{
      "finishDay":"Do you Want to finish the day and log out?",
      "checkoutButton": "Finish the day",
      "comment":"Comment"
  },
  "warning":{
      "ok":"OK",
      "cancel":"Cancel",
      "delete":"This will PERMANENTLY delete {replace}.",
      "canNotDelete": "{replace} is being used. Can not delete.",
      "canNotDeleteSelf": "You can not delete yourself.",
      "discardChanges":"Discard Changes?"
  },
  "location":{
      "save": "Save Order",
      "saved": "Saved!"
  },
  "dataTable":{
    "searchToolTip":"Use commas to search different columns."
  },
  "createMessage":{
    "send":"Send",
    "to":"To",
    "subject":"Subject",
    "message":"Message",
    "newMessage":"New Message",
    "sending":"Sending...",
    "sent":"Message Sent!",
    "sendError":"Hmm...something went wrong...Please try again later.",
    "required":"{replace} is required.",
    "notFound":"{replace} not found."
  },
  "message":{
    "messages":"Messages",
    "messageExplanation":"Messages will automatically be deleted after 14 days unless locked.",
    "noMessages":"You don't have any messages yet!"
  },
  "totalOrder":{
    "currentTotal": "Current",
    "allLocations": "All Locations",
    "completedButton": "Finished",
    "markAsFinished": "Mark orders as finished?",
    "invalidDate":"INVALID DATE",
    "noOrders":"No order!"
  },
  "timeSheet":{
    "comment":"Comment",
    "date":"Date",
    "timeIn":"Time In",
    "timeOut":"Time Out",
    "shiftTotal":"Shift Total",
    "noTimeSheets":"No logs for this week."
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
export const ChangeContext = createContext<boolean>(false);
export const SetChangeContext = createContext<Dispatch<SetStateAction<boolean>>>((_)=>{return});

const App:React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loginId, setLoginId] = useState("");
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [loggedInEmployee, setLoggedInEmployee] = useState<Omit<IEmployee, "password">>(defaultEmployee);
  const [language, setLanguage] = useState<string>("en");
  const [token, setToken] = useState<string>("");
  const [loginTimer, setLoginTimer] = useState<ReturnType<typeof setTimeout>>();
  const [textTranslations, setTextTranslations] = useState<any>(defaultText);
  const [isChanges, setIsChanges] = useState<boolean>(false);

  window.onbeforeunload = (e:BeforeUnloadEvent) => {
    if(isChanges){
      e.preventDefault();
      return;// e.returnValue = textTranslations.warning.discardChanges;
    }
  }

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
      setLoginTimer(setTimeout(()=> {
          setIsLoggedIn(false);
        }, 3600000)
      )
      setIsLoggedIn(true);
    } else {
      clearTimeout(loginTimer);
      setIsLoggedIn(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(()=> {
    if(!isLoggedIn && token !=="") {
      setIsChanges(false);
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
                <ChangeContext.Provider value={isChanges}>
                  <SetChangeContext.Provider value={setIsChanges}>
                    <HomeComponent
                      isLoggedIn={isLoggedIn}
                      setLoggedIn={setIsLoggedIn}
                      setEmployee={setLoggedInEmployee as Dispatch<SetStateAction<Omit<IEmployee, "password">>>}
                    />
                  </SetChangeContext.Provider>
                </ChangeContext.Provider>
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