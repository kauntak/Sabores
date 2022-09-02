import React, { useEffect, useState } from "react";
import styles from "./../../css/management.module.css";

import { ButtonComponent } from "../../components/ButtonComponent";
import {BsPencil, BsPersonPlusFill, BsTrash} from "react-icons/bs"
import { Field, IEmployee, ILocation, IRole, MultiField, SingleField } from "../../type";
import { createEmployee, deleteEmployee, getEmployee, getEmployees, getLocations, getRoles, updateEmployee } from "../../api";
import { WarningOverlayComponent } from "../../components/WarningOverlayComponent";
import { AddAndEditComponent, deepCopyFields } from "../../components/AddAndEditComponent";
import { DataTable } from "../../components/DataTable";
import { useContext } from "react";
import { LanguageContext } from "../../App";

type Props = {
    isAdmin:boolean
    currentEmployee:IEmployee
}

const defaultButton = (e:React.MouseEvent<HTMLButtonElement>):void => {e.preventDefault()};


export const EmployeeManagement: React.FC<Props> = ({isAdmin, currentEmployee}) => {
    const text = useContext(LanguageContext);
    const [activeEmployeeId, setActiveEmployeeId] = useState<string>("");
    const [defaultEmployeeFields, setDefaultEmployeeFields] = useState<Field[]>([]);
    const [employeeList, setEmployeeList] = useState<IEmployee[]>([]);
    const [roleList, setRoleList] = useState<IRole[]>([]);
    const [locationList, setLocationList] = useState<ILocation[]>([]);
    const [showWarning, setShowWarning] = useState<boolean>(false);
    const [warningButton, setWarningButton] = useState<(e:React.MouseEvent<HTMLButtonElement>) => void>(() => defaultButton);
    const [canCancel, setCanCancel] = useState<boolean>(true);
    const [warningMessage, setWarningMessage] = useState<string>("");
    const [showAddEditComponent, setShowAddEditComponent] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [addEditTitle, setAddEditTitle] = useState<string>("");
    const [addEditFields, setAddEditFields] = useState<Field[]>([]);

    const getList = (list:any[]) => {
        return list.map(item => {
            return {
                display: item.name,
                name:item.name.replace(/\s/g, ""),
                id:item._id,
                value: false
            }
        })
    }

    useEffect(()=> {
        getEmployees()
            .then(res => setEmployeeList(res.employees));
        getRoles()
            .then(res => setRoleList(res.roles));
        getLocations()
            .then(res => setLocationList(res.locations));
    }, []);

    useEffect(()=> {
        setDefaultEmployeeFields( [
            {
                name:"firstName",
                display:text.list.firstName,
                fieldType:"Single",
                required: true,
                field:{value:""}
            }, {
                name:"middleName",
                display:text.list.middleName,
                fieldType:"Single",
                required: false,
                field:{value:""}
            }, {
                name:"lastName",
                display:text.list.lastName,
                fieldType:"Single",
                required: true,
                field:{value:""}
            }, {
                name:"password",
                display:text.list.password,
                fieldType:"Single",
                required: true,
                isCensored: true,
                field:{value:""}
            }, {
                name:"confirmPassword",
                display:text.list.confirmPassword,
                fieldType:"Single",
                required: true,
                isCensored: true,
                field:{value:""}
            }, {
                name:"role",
                display:text.list.role,
                fieldType:"Multi",
                required: true,
                field:{
                    isMultiSelect:false,
                    name:"Role",
                    list: getList(roleList)
                }
            }, {
                name:"access",
                display:text.list.access,
                fieldType:"Multi",
                required: true,
                field:{
                    isMultiSelect:true,
                    name:"Access",
                    list: getList(locationList)
                }
            }, {
                name:"email",
                display:text.list.email,
                fieldType:"Single",
                required: false,
                field:{value:""}
            }, {
                name:"phone",
                display:text.list.phone,
                fieldType:"Single",
                required: false,
                field:{value:""}
            }, {
                name:"address",
                display:text.list.address,
                fieldType:"Single",
                required: false,
                field:{value:""}
            }
        ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locationList, roleList])
    
    useEffect(()=> {
        if(addEditFields.length === 0) setShowAddEditComponent(false);
        else setShowAddEditComponent(true);
    }, [addEditFields]);

    useEffect(()=> {
        if(!showAddEditComponent){
            setActiveEmployeeId("");
            setAddEditTitle("");
            setAddEditFields([]);
        }
    },[showAddEditComponent]);

    const onAddClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setAddEditTitle(text.list.addEmployee);
        setIsEdit(false);
        setAddEditFields(deepCopyFields(defaultEmployeeFields) as Field[]);
    }

    const onEditClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        getEmployee(activeEmployeeId)
            .then(res => {
                const employeeToEdit = res.employee;
                if(employeeToEdit === undefined) return;
                const editFields:Field[] = deepCopyFields(defaultEmployeeFields) as Field[];
                const employeeRole = roleList.find(role => role._id === employeeToEdit.role)!;
                (editFields[0].field as SingleField).value = employeeToEdit.firstName;
                (editFields[1].field as SingleField).value = employeeToEdit.middleName;
                (editFields[2].field as SingleField).value = employeeToEdit.lastName;
                (editFields[5].field as MultiField).selected = {
                    id:employeeRole?._id,
                    name: employeeRole.name.replace(/\s/g, ""),
                    display:employeeRole.name
                };
                (editFields[6].field as MultiField).list.forEach((item, index, array) => {
                    const isSelected:boolean = employeeToEdit.access.find(access => access.locationId === item.id) !== undefined;
                    array[index].value = isSelected;
                });
                (editFields[7].field as SingleField).value = employeeToEdit.email;
                (editFields[8].field as SingleField).value = employeeToEdit.phone;
                (editFields[9].field as SingleField).value = employeeToEdit.address;
                setAddEditTitle(text.list.edit.replace("{replace}", employeeToEdit.firstName));
                setIsEdit(true);
                setAddEditFields(editFields);
        });
        
    }

    const onDeleteClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if(activeEmployeeId === currentEmployee._id){
            setWarningMessage(text.warning.canNotDeleteSelf);
            setWarningButton(()=>defaultButton);
            setCanCancel(false);
            setShowWarning(true);
            return;
        }
        const employeeToDelete = employeeList.find(employee => employee._id === activeEmployeeId);
        if(employeeToDelete === undefined) return;
        setWarningMessage(text.warning.delete.replace("{replace}", employeeToDelete.firstName));
        setWarningButton(() => onConfirmDelete);
        setCanCancel(true);
        setShowWarning(true);
    }

    const onConfirmDelete = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        deleteEmployee(activeEmployeeId)
            .then(res => {
                setEmployeeList(res.employees);
                setActiveEmployeeId("");
                setShowWarning(false);
                setWarningButton(() => defaultButton);
            }
        );
    }

    const saveButton = (fields:Field[]):void => {
        const newEmployee:IEmployee = {
            firstName: (fields[0].field as SingleField).value as string,
            middleName: (fields[1].field as SingleField).value as string,
            lastName: (fields[2].field as SingleField).value as string,
            password: (fields[3].field as SingleField).value as string,
            role: (fields[5].field as MultiField).selected!.id!,
            access: (fields[6].field as MultiField).list.filter(item => item.value).map(item => {return {locationId:item.id!}}),
            email: (fields[7].field as SingleField).value as string,
            phone: (fields[8].field as SingleField).value as string,
            address: (fields[9].field as SingleField).value as string
        };
        console.log(newEmployee);
        if(isEdit){
            newEmployee._id = activeEmployeeId;
            updateEmployee(newEmployee)
                .then(res => {
                    setEmployeeList(res.employees);
                    setAddEditFields([]);
                });
            return;
        }
        createEmployee(newEmployee)
            .then(res => {
                setEmployeeList(res.employees);
                setAddEditFields([]);
            })
    }

    const onCancelButton = (e:React.MouseEvent<HTMLButtonElement>):void => {
        setAddEditFields([]);
    }

    return (
        <>
            {showWarning?
                <WarningOverlayComponent
                    warning={warningMessage}
                    setShowWarning={setShowWarning}
                    onClick={warningButton}
                    canCancel={canCancel}
                    />
                :""
            }
            {showAddEditComponent?
                <AddAndEditComponent
                    title={addEditTitle}
                    propFields={addEditFields}
                    isEdit={isEdit}
                    save={saveButton}
                    cancel={onCancelButton}
                    />
            :""}
            <div className={styles["buttonList"]}>
                <ButtonComponent
                    onClick={onAddClick}
                    name={<BsPersonPlusFill />}
                />
                
                {activeEmployeeId!==""?
                    <>
                        <ButtonComponent
                            onClick={onEditClick}
                            name={<BsPencil />}
                            width={"100px"}
                        />
                        <ButtonComponent
                            onClick={onDeleteClick}
                            name={<BsTrash />}
                            width={"100px"}
                            isNegativeColor={true}
                        />
                    </>
                    :""
                }
            </div>
            <DataTable 
                headers={[
                    text.list.firstAndMiddle,
                    text.list.lastName,
                    text.list.access
                ]}
                rows={employeeList.map(employee => {
                    return {
                        id:employee._id!,
                        columns: [
                            `${employee.firstName}${employee.middleName?" " + employee.middleName:""}`,
                             employee.lastName,
                             employee?.access !== undefined? employee.access.map(a => {
                                const foundLocation = locationList.find(location => location._id === a.locationId);
                                if(foundLocation===undefined) return "---";
                                return foundLocation.name;
                             }).join(", "):""
                        ]
                    }
                })}
                currentId={activeEmployeeId}
                setId={setActiveEmployeeId}
            />
        </>
    );
}