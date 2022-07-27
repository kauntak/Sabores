import React, { useContext, useEffect, useState } from "react";
import styles from "./../../css/management.module.css";

import { BsPencil, BsPlusLg, BsTrash } from "react-icons/bs";
import { createShoppingCategory, createShoppingItem, deleteShoppingCategory, getShoppingCategories, getShoppingItems, updateShoppingCategory, updateShoppingItem } from "../../api";
import { ButtonComponent } from "../../components/ButtonComponent";
import { Field, IShoppingCategory, IShoppingItem, MultiField, SingleField } from "../../type";
import { AddAndEditComponent } from "../../components/AddAndEditComponent";
import { DataTable } from "../../components/DataTable";
import { WarningOverlayComponent } from "../../components/WarningOverlayComponent";
import { LanguageContext } from "../../App";


type Props = {
}

const defaultButton = (e:React.MouseEvent<HTMLButtonElement>):void => {e.preventDefault()};

export const ShoppingManagement: React.FC<Props> = () => {
    const text = useContext(LanguageContext);
    const [showWarning, setShowWarning] = useState<boolean>(false);
    const [warningButton, setWarningButton] = useState<(e:React.MouseEvent<HTMLButtonElement>) => void>(() => defaultButton);
    const [canCancel, setCanCancel] = useState<boolean>(true);
    const [warningMessage, setWarningMessage] = useState<string>("");
    const [showAddEditComponent, setShowAddEditComponent] = useState<boolean>(false);
    const [addEditTitle, setAddEditTitle] = useState<string>("");
    const [addEditFields, setAddEditFields] = useState<Field[]>([]);
    const [saveButton, setSaveButton] = useState<(e:React.MouseEvent<HTMLButtonElement>, fields:Field[]) => void>(() => defaultButton);
    const [categoryList, setCategoryList] = useState<IShoppingCategory[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [itemList, setItemList] = useState<IShoppingItem[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<string>("");

    useEffect(() => {
        getShoppingCategories()
            .then(res => {
                setCategoryList(res.shoppingCategories);
            });
        getShoppingItems()
            .then(res => {
                setItemList(res.shoppingItems);
            })
    }, [])

    useEffect(()=> {
        if(!showAddEditComponent){
            setSaveButton(() => defaultButton);
            setSelectedCategoryId("");
            setSelectedItemId("");
            setAddEditTitle("");
            setAddEditFields([]);
        }
    },[showAddEditComponent]);

    useEffect(()=> {
        if(addEditFields.length === 0) setShowAddEditComponent(false);
        else setShowAddEditComponent(true);
    }, [addEditFields]);

    const onAddCategoryClick = (e:React.MouseEvent<HTMLButtonElement>):void => {
        const newFields:Field[] = [
            {  
                name:"Name",
                display:"Name",
                fieldType:"Single",
                required: true,
                field:{value:""}
            }, {
                name: "Description",
                display:"Description",
                fieldType:"Single",
                required:false,
                field:{value:""}
            }
        ]
        setAddEditTitle("Add Category");
        setSaveButton(()=> onSaveCategoryButton);
        setAddEditFields(newFields);
        //setShowAddEditComponent(true);
    }

    const onEditCategoryClick = (e:React.MouseEvent<HTMLButtonElement>):void => {
        const categoryToEdit = categoryList.find(category => category._id === selectedCategoryId);
        if(categoryToEdit === undefined) return;
        const editFields:Field[] = [
            {
                name:"Name",
                display:"Name",
                fieldType:"Single",
                required: true,
                field:{value:categoryToEdit.name}
            }, {
                name: "Description",
                display:"Description",
                fieldType:"Single",
                required:false,
                field:{value:categoryToEdit.description}
            }
        ];
        setAddEditTitle("Edit " + categoryToEdit.name);
        setSaveButton(()=> onSaveCategoryButton);
        setAddEditFields(editFields);
    }
    
    const onDeleteCategoryClick = (e:React.MouseEvent<HTMLButtonElement>):void => {
        const categoryToDelete = categoryList.find(category => category._id === selectedCategoryId);
        if(categoryToDelete === undefined) return;
        if(itemList.find(item => item.category === selectedCategoryId) !== undefined) {
            setWarningMessage(text.warning.canNotDelete.replace("{replace}", categoryToDelete.name));
            setCanCancel(false);
            setShowWarning(true);
            return;
        }
        setWarningMessage(text.warning.delete.replace("{replace}", categoryToDelete.name));
        setWarningButton(()=> onConfirmDeleteCategoryClick);
        setCanCancel(true);
        setShowWarning(true);
    }

    const onConfirmDeleteCategoryClick = (e:React.MouseEvent<HTMLButtonElement>):void => {
        setWarningButton(() => defaultButton);
        deleteShoppingCategory(selectedCategoryId).then(res => {
            setCategoryList(res.shoppingCategories);
        }).catch(err => {
            setWarningMessage(err);
            setCanCancel(false);
            setShowWarning(true);
        });
        setShowWarning(false);
    }

    const onSaveCategoryButton = (e:React.MouseEvent<HTMLButtonElement>, fields:Field[]):void => {
        const newCategory:IShoppingCategory = {
            _id: selectedCategoryId===""?undefined:selectedCategoryId,
            name: (fields[0]?.field as SingleField)?.value as string,
            description:(fields[1]?.field as SingleField)?.value as string
        }
        if(selectedCategoryId===""){
            createShoppingCategory(newCategory)
                .then(res => {
                    setCategoryList(res.shoppingCategories)
                });
        } else updateShoppingCategory(newCategory)
            .then(res => {
                setCategoryList(res.shoppingCategories)
            });
        setShowAddEditComponent(false);
    }
    
    const onAddItemClick = (e:React.MouseEvent<HTMLButtonElement>):void => {
        const newFields:Field[] = [
            {  
                name:"Name",
                display:"Name",
                fieldType:"Single",
                required: true,
                field:{value:""}
            }, {
                name:"Category",
                display:"Category",
                required: true,
                fieldType:"Multi",
                field: {
                    isMultiSelect:false,
                    name:"Category",
                    list: categoryList.map(category => {
                        return {
                            id:category._id,
                            name:category.name,
                            display:category.name
                        }
                    })
                }

            },{
                name: "Description",
                display:"Description",
                fieldType:"Single",
                required:false,
                field:{value:""}
            }
        ]
        setAddEditTitle("Add Item");
        setSaveButton(()=> onSaveItemButton);
        setAddEditFields(newFields);
    }

    const onEditItemClick = (e:React.MouseEvent<HTMLButtonElement>):void => {
        const itemToEdit = itemList.find(item => item._id === selectedItemId);
        if(itemToEdit === undefined) return;
        const itemCategory = categoryList.find(category => category._id === itemToEdit._id);
        const selected = itemCategory === undefined? undefined: {
            id: itemCategory._id,
            name: itemCategory.name,
            display: itemCategory.name
        };
        const editFields:Field[] = [
            {
                name:"Name",
                display:"Name",
                fieldType:"Single",
                required: true,
                field:{value:itemToEdit.name}
            }, {
                name:"Category",
                display:"Category",
                fieldType:"Multi",
                field: {
                    isMultiSelect:false,
                    name:"Category",
                    list: categoryList.map(category => {
                        return {
                            id:category._id,
                            name:category.name,
                            display:category.name
                        }
                    }),
                    selected
                },

            },{
                name: "Description",
                display:"Description",
                fieldType:"Single",
                required:false,
                field:{value:itemToEdit.description}
            }
        ];
        setAddEditTitle("Edit " + itemToEdit.name);
        setSaveButton(()=> onSaveItemButton);
        setAddEditFields(editFields);
    }
    
    const onDeleteItemClick = (e:React.MouseEvent<HTMLButtonElement>):void => {

    }

    const onSaveItemButton = (e:React.MouseEvent<HTMLButtonElement>, fields:Field[]):void => {
        const newItem:IShoppingItem = {
            _id: selectedItemId===""?undefined:selectedItemId,
            name: (fields[0]?.field as SingleField)?.value as string,
            category:(fields[1].field as MultiField).selected?.id!,
            description:(fields[1]?.field as SingleField)?.value as string
        }
        if(selectedItemId===""){
            createShoppingItem(newItem)
                .then(res => {
                    setItemList(res.shoppingItems)
                });
        } else updateShoppingItem(newItem)
            .then(res => {
                setItemList(res.shoppingItems);
            });
        setShowAddEditComponent(false);
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
                    save={saveButton}
                    cancel={onCancelButton}
                    />
            :""}
            <h2>Shopping Categories</h2>
            <div className={styles["buttonList"]}>
                <ButtonComponent 
                    name={<BsPlusLg />}
                    onClick={onAddCategoryClick}
                />
                {selectedCategoryId !== ""?
                    <>
                        <ButtonComponent
                            onClick={onEditCategoryClick}
                            name={<BsPencil />}
                            width={"100px"}
                        />
                        <ButtonComponent
                            onClick={onDeleteCategoryClick}
                            name={<BsTrash />}
                            width={"100px"}
                            isNegativeColor={true}
                        />
                    </>:
                    ""
                }
            </div>
            <DataTable
                headers={["Name", "Description"]}
                rows={categoryList.map(category => {
                    return {
                        id:category._id!,
                        columns: [category.name, category.description||""]
                    }
                })}
                currentId={selectedCategoryId}
                setId={setSelectedCategoryId}
            />
            <h2>Shopping Items</h2>
            <div className={styles["buttonList"]}>
                <ButtonComponent 
                    name={<BsPlusLg />}
                    onClick={onAddItemClick}
                />
                {selectedItemId !== ""?
                    <>
                        <ButtonComponent
                            onClick={onEditItemClick}
                            name={<BsPencil />}
                            width={"100px"}
                        />
                        <ButtonComponent
                            onClick={onDeleteItemClick}
                            name={<BsTrash />}
                            width={"100px"}
                            isNegativeColor={true}
                        />
                    </>:
                    ""
                }
            </div>
            <DataTable
                headers={["Name", "Category", "Description"]}
                rows={itemList.map(item => {
                    return {
                        id: item._id!,
                        columns: [item.name, categoryList.find(category => category._id === item.category)?.name!, item.description||""]
                    }
                })}
                currentId={selectedItemId}
                setId={setSelectedItemId}
            />
        </>
    );
}