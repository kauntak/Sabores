import React, { useContext, useEffect, useState } from "react";
import styles from "./../../css/management.module.css";

import { BsPencil, BsPlusLg, BsTrash } from "react-icons/bs";
import { createReminder, createRole, deleteReminder, deleteRole, getEmployees, getReminders, getRole, getRoles, updateReminder, updateRole } from "../../api";
import { LanguageContext } from "../../App";
import { AddAndEditComponent, deepCopyFields } from "../../components/AddAndEditComponent";
import { WarningOverlayComponent } from "../../components/WarningOverlayComponent";
import { ButtonComponent } from "../../components/ButtonComponent";
import { DataTable } from "../../components/DataTable";
import { accessRoleType, Field, IEmployee, IReminder, IRole, MultiField, SingleField } from "../../type";

type Props = {

}

const defaultButton = (e:React.MouseEvent<HTMLButtonElement>):void => {e.preventDefault()};

export const RoleManagement: React.FC<Props> = () => {
    const text = useContext(LanguageContext);
    const [activeRoleId, setActiveRoleId] = useState<string>("");
    const [activeReminderId, setActiveReminderId] = useState<string>("");
    const [employeeList, setEmployeeList] = useState<IEmployee[]>([]);
    const [roleList, setRoleList] = useState<IRole[]>([]);
    const [reminderList, setReminderList] = useState<IReminder[]>([]);
    const [defaultReminderFields, setDefaultReminderFields] = useState<Field[]>([]);
    const [showWarning, setShowWarning] = useState<boolean>(false);
    const [warningButton, setWarningButton] = useState<(e:React.MouseEvent<HTMLButtonElement>) => void>(() => defaultButton);
    const [canCancel, setCanCancel] = useState<boolean>(true);
    const [warningMessage, setWarningMessage] = useState<string>("");
    const [showAddEditComponent, setShowAddEditComponent] = useState<boolean>(false);
    const [saveButton, setSaveButton] = useState<(fields:Field[]) => void>(() => defaultButton);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [addEditTitle, setAddEditTitle] = useState<string>("");
    const [addEditFields, setAddEditFields] = useState<Field[]>([]);
    
    const defaultRoleFields:Field[] = [
        {
            name:"name",
            display:"Name",
            fieldType:"Single",
            required: true,
            field:{value:""}
        }, {
            name:"type",
            display:"Type",
            fieldType:"Multi",
            required: true,
            field:{
                isMultiSelect:false,
                name:"Role",
                list: [{
                    display:"Employee",
                    name:"Employee",
                    id:"employee"
                }, {
                    display:"Manager",
                    name:"Manager",
                    id:"Manager"
                }, {
                    display:"Administrator",
                    name:"Administrator",
                    id:"admin"
                }]
            }
        }, {
            name:"description",
            display:"Description",
            fieldType:"Single",
            required: false,
            field:{value:""}
        }
    ];

    useEffect(()=> {
        getEmployees()
            .then(res => setEmployeeList(res.employees));
        getRoles()
            .then(res => setRoleList(res.roles));
        getReminders()
            .then(res => setReminderList(res.reminders));
    }, []);
    
    useEffect(()=> {
        const newDefaultReminder:Field[] = [
            {
                name:"role",
                display:"Role",
                fieldType:"Multi",
                required:true,
                field:{
                    isMultiSelect: false,
                    name:"Role",
                    list: roleList.map(role => {
                        return {
                            id: role._id!,
                            display:role.name,
                            name:role.name
                        }
                    })
                }
            }, {
                name: "description",
                display: "Description",
                fieldType:"Single",
                required: true,
                field:{value:""}
            }
        ]
        setDefaultReminderFields(newDefaultReminder);
    }, [roleList])


    useEffect(()=> {
        if(addEditFields.length === 0) setShowAddEditComponent(false);
        else setShowAddEditComponent(true);
    }, [addEditFields]);

    useEffect(()=> {
        if(!showAddEditComponent){
            setActiveRoleId("");
            setAddEditTitle("");
            setSaveButton(() => defaultButton);
            setAddEditFields([]);
        }
    },[showAddEditComponent]);

    const onAddRoleClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setAddEditTitle("Add Role");
        setIsEdit(false);
        setSaveButton(() => saveRoleButton);
        setAddEditFields(deepCopyFields(defaultRoleFields) as Field[]);
    }

    const onEditRoleClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if(activeRoleId === "") return;
        getRole(activeRoleId)
            .then(res => {
                const roleToEdit = res.role!;
                const editFields = deepCopyFields(defaultRoleFields);
                (editFields[0].field as SingleField).value = roleToEdit.name;
                (editFields[1].field as MultiField).selected = (editFields[1].field as MultiField).list.find(item => item.display === roleToEdit.type);
                (editFields[2].field as SingleField).value = roleToEdit.description;
                setAddEditTitle(`Edit ${roleToEdit.name}`);
                setIsEdit(true);
                setSaveButton(() => saveRoleButton);
                setAddEditFields(editFields);
        });
        
    }

    const onDeleteRoleClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if(employeeList.find(employee => employee.role === activeRoleId)){
            setWarningMessage(text.warning.canNotDelete);
            setWarningButton(()=>defaultButton);
            setCanCancel(false);
            setShowWarning(true);
            return;
        }
        const roleToDelete = roleList.find(role => role._id === activeRoleId);
        if(roleToDelete === undefined) return;
        setWarningMessage(text.warning.delete.replace("{replace}", roleToDelete.name));
        setWarningButton(() => onConfirmRoleDelete);
        setCanCancel(true);
        setShowWarning(true);
    }

    const onConfirmRoleDelete = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        deleteRole(activeRoleId)
            .then(res => {
                setRoleList(res.roles);
                setActiveRoleId("");
                setShowWarning(false);
                setWarningButton(() => defaultButton);
            }
        );
    }

    const saveRoleButton = (fields:Field[]):void => {
        const newRole:IRole = {
            name: (fields[0].field as SingleField).value as string,
            type: (fields[1].field as MultiField).selected!.display! as accessRoleType,
            description: (fields[2].field as SingleField).value as string
        };
        if(isEdit){
            newRole._id = activeRoleId;
            updateRole(newRole)
                .then(res => {
                    setRoleList(res.roles);
                });
        } else {
            createRole(newRole)
                .then(res => {
                    setRoleList(res.roles);
                });
        }
        setAddEditFields([]);
    }
    const onAddReminderClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setAddEditTitle("Add Reminder");
        setIsEdit(false);
        setSaveButton(() => saveReminderButton);
        setAddEditFields(deepCopyFields(defaultReminderFields) as Field[]);
    }

    const onEditReminderClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if(activeReminderId === "") return;
        
        const reminderToEdit = reminderList.find(reminder => reminder._id === activeReminderId);
        if(reminderToEdit === undefined) return;
        const editFields = deepCopyFields(defaultReminderFields);
        (editFields[0].field as MultiField).selected = (editFields[0].field as MultiField).list.find(item => item.id === reminderToEdit.role);
        (editFields[1].field as SingleField).value = reminderToEdit.description;
        setAddEditTitle(`Edit Reminder`);
        setIsEdit(true);
        setSaveButton(() => saveReminderButton);
        setAddEditFields(editFields);
    }

    const onDeleteReminderClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const reminderToDelete = reminderList.find(reminder => reminder._id === activeReminderId);
        if(reminderToDelete === undefined) return;
        setWarningMessage(text.warning.delete.replace("{replace}", reminderToDelete.description));
        setWarningButton(() => onConfirmReminderDelete);
        setCanCancel(true);
        setShowWarning(true);
    }

    const onConfirmReminderDelete = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        deleteReminder(activeReminderId)
            .then(res => {
                setReminderList(res.reminders);
                setActiveRoleId("");
                setShowWarning(false);
                setWarningButton(() => defaultButton);
            }
        );
    }

    const saveReminderButton = (fields:Field[]):void => {
        const newReminder:IReminder = {
            role: (fields[0].field as MultiField).selected!.id!,
            description: (fields[1].field as SingleField).value as string
        };
        if(isEdit){
            newReminder._id = activeReminderId;
            updateReminder(newReminder)
                .then(res => {
                    setReminderList(res.reminders);
                });
        } else {
            createReminder(newReminder)
                .then(res => {
                    setReminderList(res.reminders);
                });
        }
        setAddEditFields([]);
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
                    onClick={onAddRoleClick}
                    name={<BsPlusLg />}
                />
                
                {activeRoleId!==""?
                    <>
                        <ButtonComponent
                            onClick={onEditRoleClick}
                            name={<BsPencil />}
                            width={"100px"}
                        />
                        <ButtonComponent
                            onClick={onDeleteRoleClick}
                            name={<BsTrash />}
                            width={"100px"}
                            isNegativeColor={true}
                        />
                    </>
                    :""
                }
            </div>
            <DataTable 
                headers={["Role", "Type", "Description"]}
                rows={roleList.map(role => {
                    return {
                        id:role._id!,
                        columns: [role.name, role.type, role.description||""]
                    }
                })}
                currentId={activeRoleId}
                setId={setActiveRoleId}
            />
            <div className={styles["buttonList"]}>
                <ButtonComponent
                    onClick={onAddReminderClick}
                    name={<BsPlusLg />}
                />
                
                {activeReminderId!==""?
                    <>
                        <ButtonComponent
                            onClick={onEditReminderClick}
                            name={<BsPencil />}
                            width={"100px"}
                        />
                        <ButtonComponent
                            onClick={onDeleteReminderClick}
                            name={<BsTrash />}
                            width={"100px"}
                            isNegativeColor={true}
                        />
                    </>
                    :""
                }
            </div>
            <DataTable 
                headers={["Role", "Description"]}
                rows={reminderList.map(reminder => {
                    return {
                        id:reminder._id!,
                        columns: [roleList.find(role=> role._id === reminder.role)?.name||"", reminder.description]
                    }
                })}
                currentId={activeReminderId}
                setId={setActiveReminderId}
            />
        </>
    );
}