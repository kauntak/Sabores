import React, { useEffect, useRef, useState } from "react";
import { BsCheckLg, BsXLg } from "react-icons/bs";
import { Field, MultiField, SingleField } from "../type";
import styles from "./../css/addAndEdit.module.css";
import { ButtonComponent } from "./ButtonComponent";

type Props = {
    title: string,
    propFields: Field[],
    isEdit?: boolean,
    save: (fields:Field[]) => void,
    cancel: (e:React.MouseEvent<HTMLButtonElement>) => void
}

type onFormChangeIndex = {
    index: number,
    innerIndex: number
}
export const deepCopyFields:(fieldsToCopy:Field[])=>Field[] = (fieldsToCopy) => {
    return JSON.parse(JSON.stringify(fieldsToCopy)) as Field[];
}

// type FieldCopyType = Field[]|Field|SingleField[]|SingleField|MultiField|FieldType|boolean|string;
// export const deepCopyFields:(fieldsToCopy:FieldCopyType, parentFieldName?:string)=>FieldCopyType = (fieldsToCopy, parentFieldName)=> {
    // if(Array.isArray(fieldsToCopy)){
    //     return (fieldsToCopy as Field[]|SingleField[]).map(item => {
    //         if(parentFieldName === undefined) return deepCopyFields(item as Field)
    //         return deepCopyFields(item as SingleField, parentFieldName);
    //         });
    // }
    // if(!(fieldsToCopy && typeof fieldsToCopy === "object")) {
    //     switch(typeof fieldsToCopy){
    //         case "boolean" :
    //             return fieldsToCopy as boolean;
    //         case "string":
    //             if(fieldsToCopy==="Single" || fieldsToCopy==="Multi") return fieldsToCopy as FieldType;
    //             return fieldsToCopy as string;
    //     }
    // }
    // const obj = Object.create(Object.getPrototypeOf(fieldsToCopy));
    // for(const propertyName in fieldsToCopy) {
    //     if(propertyName==="field"){
    //         if(((fieldsToCopy as any)[propertyName] as MultiField).list !== undefined){
    //             obj[propertyName] = deepCopyFields((fieldsToCopy as any)[propertyName] as MultiField, "list");
    //             continue;
    //         }
    //         obj[propertyName] = deepCopyFields((fieldsToCopy as any)[propertyName] as SingleField);
    //         continue;
    //     }
    //     obj[propertyName] = deepCopyFields((fieldsToCopy as any)[propertyName]);
    //     continue;
    // };
    // return obj;
// }

export const AddAndEditComponent:React.FC<Props> = ({title, propFields, isEdit, save, cancel}) => {
    const [fields, setFields] = useState<Field[]>([]);
    const refs = useRef<Array<HTMLSelectElement|HTMLInputElement>>([]);

    useEffect(()=> {
        setFields(propFields);
        refs.current = new Array(propFields.length);
    }, [propFields]);

    const onMultiChange = (e:React.ChangeEvent<HTMLInputElement>, {index, innerIndex}:onFormChangeIndex) => {
        setFields(oldFields =>{
            const newFields = [...oldFields];
            (newFields[index].field as MultiField).list[innerIndex].value = e.target.checked;
            if(e.target.checked) newFields[index].field.isError = false;
            return newFields;
        })
    }

    const onSelectChange = (e:React.ChangeEvent<HTMLSelectElement>, index:number) => {
        const selectedIndex = e.target.selectedIndex;
        if(selectedIndex === 0){ 
            setFields(oldFields => {
                const newFields = [...oldFields];
                (newFields[index].field as MultiField).selected = undefined;
                return newFields;
            });
            return;
        }
        const selectedField = (fields[index].field as MultiField).list.find(item => item.id === e.target.options[selectedIndex].dataset.id);
        
        if(selectedField === undefined) return;
        setFields(oldFields => {
            const newFields = [...oldFields];
            (newFields[index].field as MultiField).selected = selectedField;
            (newFields[index].field as MultiField).isError = false;
            return newFields;
        });
    }

    const onSingleChange = (e:React.ChangeEvent<HTMLInputElement>, index:number) => {
        const newValue = e.target.value;
        setFields(oldFields => {
            const newFields = [...oldFields];
            (newFields[index].field as SingleField).value = newValue;
            if(newValue !== "") (newFields[index].field as SingleField).isError = false;
            if(newFields[index].notMatching) newFields[index].notMatching = false;
            return newFields
        })
    }

    const saveClicked = ():void => {
        let errorExists:boolean = false;
        let match:string = "";
        for(let i = 0; i < fields.length; i++){
            if(fields[i].required){
                if(fields[i].fieldType === "Single" ){
                    if((fields[i].field as SingleField).value === "" && !(fields[i].isCensored && isEdit)){
                        setFields(oldFields => {
                            const newFields = [...oldFields];
                            newFields[i].field.isError = true;
                            return newFields;
                        })
                        errorExists = true;
                        continue;
                    }
                    if(fields[i].isCensored) {
                        if(match==="") match=(fields[i].field as SingleField).value as string;
                        else {
                            if(match!==(fields[i].field as SingleField).value) {
                                fields[i].notMatching = true;
                            }
                        }
                    }
                }
                if(fields[i].fieldType === "Multi"){
                    if((fields[i].field as MultiField).isMultiSelect){
                        const selected = (fields[i].field as MultiField).list.find(item => item.value === true);
                        if(selected === undefined) {
                            setFields(oldFields => {
                                const newFields = [...oldFields];
                                newFields[i].field.isError = true;
                                return newFields;
                            })
                            errorExists = true;
                            continue;
                        }
                    } else {
                        if((fields[i].field as MultiField).selected === undefined) {
                            setFields(oldFields => {
                                const newFields = [...oldFields];
                                newFields[i].field.isError = true;
                                return newFields;
                            })
                            errorExists = true;
                            continue;
                        }
                    }
                }
            }
        };
        if(errorExists) return;
        save(fields);
    }
    
    const onItemKeyDown = (e:React.KeyboardEvent<HTMLSelectElement|HTMLInputElement>, index:number, innerIndex?:number) => {
        if(e.key !== "Enter") return;
        if(innerIndex !== undefined) {
            setFields(oldFields =>{
                const newFields = [...oldFields];
                (newFields[index].field as MultiField).list[innerIndex].value = !((e.target as HTMLInputElement).checked);
                if(!(e.target as HTMLInputElement).checked) newFields[index].field.isError = false;
                return newFields;
            });
            return;
        }
        if(index < (refs.current.length - 1)) {
            if(fields[index].fieldType === "Multi") {
                onSelectChange(e as any as React.ChangeEvent<HTMLSelectElement>, index);
            }
            refs.current[index+1].focus();
            return;
        }
        saveClicked();
    }

    return (
        <div className={styles["overlay"]}>
            <div  className={styles["window"]}>
                <h2>{title}</h2>
                {fields.map((field, index) => {
                    switch(field.fieldType) {
                        case "Single":
                            return (
                                <div className={styles["field"]} key={field.name+index}>
                                    <label htmlFor={field.name+index}>{field.display}{field.required&&(!field.isCensored || (field.isCensored &&!isEdit))?"*":""}</label>
                                    <div className={styles["fieldInputAndError"]}>
                                        <input
                                            type={field.isCensored?"password":"text"}
                                            className={(field.field as SingleField).isError||field.notMatching?styles["error"]:""}
                                            id={field.name+index}
                                            value={(field.field as SingleField).value as string}
                                            required={field.required}
                                            onChange={(e)=>onSingleChange(e, index)}
                                            ref={element => refs.current[index] = element!}
                                            onKeyDown={(e)=>onItemKeyDown(e, index)}    
                                            />
                                        {(field.field as SingleField).isError?
                                            <p>{field.display} is required.</p>:""}
                                        {field.notMatching?
                                            <p>Passwords do not match.</p>:""}
                                    </div>
                                </div>
                            );
                        case "Multi":
                            return (
                                <div className={styles["field"]} key={field.name+index}>
                                    <label>{field.display}{field.required?"*":""}</label>
                                    {(field.field as MultiField).isMultiSelect?
                                        <div className={`${styles["checkList"]} ${styles["fieldInputAndError"]}`}>
                                            {field.field.isError?<p>{field.display} is required.</p>:""}
                                            <ul>
                                                {(field.field as MultiField).list.map((item, innerIndex) => {
                                                    return (
                                                        <li key={innerIndex+(item.id?item.id:"")}>
                                                            <input
                                                                id={item.id}
                                                                type="checkbox"
                                                                checked={item.value as boolean}
                                                                onChange={(e)=> {onMultiChange(e, {index, innerIndex})}}
                                                                onKeyDown={(e) => onItemKeyDown(e, index, innerIndex)}
                                                                ref = {element => {
                                                                    if(innerIndex===0) refs.current[index] = element!
                                                                }}
                                                            />
                                                            <label htmlFor={item.id}>{item.display}</label>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>:
                                        <div className={styles["fieldInputAndError"]}>
                                            <select
                                                name={field.name}
                                                value={(field.field as MultiField).selected?(field.field as MultiField).selected!.name:"Select..."}
                                                onChange={(e)=> {onSelectChange(e, index)}}
                                                required={field.required}
                                                ref={element => refs.current[index] = element!}
                                                onKeyDown={(e)=>onItemKeyDown(e, index)}
                                            >
                                                <option value="Select...">Select...</option>
                                                {(field.field as MultiField).list.map((item, innerIndex) => (
                                                    <option value={item.name} data-id={item.id} key={innerIndex+(item?.id?item.id:"")}>{item.display}</option>
                                                ))}
                                            </select>
                                            {field.field.isError?
                                            <p>{field.display} is required.</p>:""}
                                        </div>
                                    }
                                        
                                </div>
                            );
                        default:
                            return <></>;
                    }
                })}
                <h4>* is required.</h4>
                <div className={styles["buttonList"]}>
                    <ButtonComponent 
                        name={<BsXLg />}
                        onClick={cancel}
                        isNegativeColor={true}
                        width={"150px"}
                    />
                    <ButtonComponent
                        name={<BsCheckLg />}
                        onClick={saveClicked}
                        width={"150px"}
                    />
                </div>
            </div>
        </div>
    );
}