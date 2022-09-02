import React, { useState, useEffect } from "react";
import styles from "./../../css/management.module.css";

import { ButtonComponent } from "../../components/ButtonComponent";
import {BsPencil, BsPersonPlusFill, BsTrash} from "react-icons/bs"
import { Field, ILocation, MultiField, SingleField } from "../../type";
import { createLocation, deleteLocation, getLocations, updateLocation } from "../../api";
import { WarningOverlayComponent } from "../../components/WarningOverlayComponent";
import { AddAndEditComponent, deepCopyFields } from "../../components/AddAndEditComponent";
import { DataTable } from "../../components/DataTable";
import { useContext } from "react";
import { LanguageContext } from "../../App";

type Props = {

}

const defaultButton = (e:React.MouseEvent<HTMLButtonElement>):void => {e.preventDefault()};


export const LocationManagement: React.FC<Props> = () => {
    const text = useContext(LanguageContext);
    const [activeLocationId, setActiveLocationId] = useState<string>("");
    const [locationList, setLocationList] = useState<ILocation[]>([]);
    const [showWarning, setShowWarning] = useState<boolean>(false);
    const [warningButton, setWarningButton] = useState<(e:React.MouseEvent<HTMLButtonElement>) => void>(() => defaultButton);
    const [canCancel, setCanCancel] = useState<boolean>(true);
    const [warningMessage, setWarningMessage] = useState<string>("");
    const [showAddEditComponent, setShowAddEditComponent] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [addEditTitle, setAddEditTitle] = useState<string>("");
    const [addEditFields, setAddEditFields] = useState<Field[]>([]);

    useEffect(()=> {
        getLocations()
            .then(res => setLocationList(res.locations));
    }, []);

    const booleanList:SingleField[] = [
        {
            name:"Yes",
            display:text.list.yes,
            id:"yes"
        }, {
            name:"No",
            display:text.list.no,
            id:"no"
        }
    ]

    const defaultLocationFields:Field[] =  [
        {
            name:"name",
            display:text.list.name,
            fieldType:"Single",
            required: true,
            field:{value:""}
        }, {
            name:"main",
            display:text.list.isMain,
            required: false,
            fieldType: "Multi",
            field: {
                isMultiSelect: false,
                name:"Is Main?",
                list:booleanList
            }
        }
    ];
    
    
    useEffect(()=> {
        if(addEditFields.length === 0) setShowAddEditComponent(false);
        else setShowAddEditComponent(true);
    }, [addEditFields]);

    useEffect(()=> {
        if(!showAddEditComponent){
            setActiveLocationId("");
            setAddEditTitle("");
            setAddEditFields([]);
        }
    },[showAddEditComponent]);

    const onAddClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setAddEditTitle(text.list.addLocation);
        setIsEdit(false);
        setAddEditFields(deepCopyFields(defaultLocationFields) as Field[]);
    }

    const onEditClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        const locationToEdit = locationList.find(location => location._id === activeLocationId);
        if(locationToEdit === undefined) return;
        const editFields:Field[] = deepCopyFields(defaultLocationFields) as Field[];
        (editFields[0].field as SingleField).value = locationToEdit.name;
        (editFields[1].field as MultiField).selected = locationToEdit.isMain?booleanList[0]:undefined;

        
        setAddEditTitle(text.list.edit.replace("{replace}", locationToEdit.name));
        setIsEdit(true);
        setAddEditFields(editFields);
        
    }

    const onDeleteClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const locationToDelete = locationList.find(location => location._id === activeLocationId);
        if(locationToDelete === undefined) return;
        setWarningMessage(text.warning.delete.replace("{replace}", locationToDelete.name));
        setWarningButton(() => onConfirmDelete);
        setCanCancel(true);
        setShowWarning(true);
    }

    const onConfirmDelete = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        deleteLocation(activeLocationId)
            .then(res => {
                setLocationList(res.locations);
                setActiveLocationId("");
                setShowWarning(false);
                setWarningButton(() => defaultButton);
            }
        );
    }

    const saveButton = (fields:Field[]):void => {
        const newLocation:ILocation = {
            name: (fields[0].field as SingleField).value as string,
            isMain: (fields[1].field as MultiField).selected?.id==="yes"
        };
        if(isEdit){
            newLocation._id = activeLocationId;
            updateLocation(newLocation)
                .then(res => {
                    setLocationList(res.locations);
                    setAddEditFields([]);
                });
            return;
        }
        createLocation(newLocation)
            .then(res => {
                setLocationList(res.locations);
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
                
                {activeLocationId!==""?
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
                headers={[text.list.name]}
                rows={locationList.map(location => {
                    return {
                        id:location._id!,
                        columns: [location.name]
                    }
                })}
                currentId={activeLocationId}
                setId={setActiveLocationId}
            />
        </>
    );
}