import React, { useState } from "react";
import { IEmployee, IEmployeeProps } from "../type";

type Props = IEmployeeProps & {
    
}

function searchEmployees(input:string, list:IEmployee[]):IEmployee[] {
    let newList:IEmployee[] = list.filter((employee:IEmployee):boolean => {
        return employee.firstName.indexOf(input) !== -1 || employee.lastName.indexOf(input) !== -1 || (employee.middleName !== undefined && employee.middleName.indexOf(input) !== -1);
    });
    return newList;
}

const LoginScreen: React.FC = () => {
    const [employeeNameInput, setEmployeeNameInpu] = useState("");
    const [employeeList, setEmployeeList] = useState([]);

    const 

    return (
        <>
            <div className="center_block">
                <form action="loginEmployee()" autoComplete="off">
                    <input id="employee-name-input" type="text" name="employee-name" placeholder="Name"/>
                    <input type="submit"/>
                </form>
            </div>
        </>
    );
}