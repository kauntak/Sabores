import React, { useEffect, useState } from "react";
import styles from "./../../css/management.module.css";

import { BsPencil, BsPlusLg, BsTrash } from "react-icons/bs";
import { createOrderCategory, createOrderItem, createSupplier, deleteOrderCategory, deleteOrderItem, deleteSupplier, getOrderCategories, getOrderItems, getSuppliers, updateOrderCategory, updateOrderItem, updateSupplier } from "../../api";
import { AddAndEditComponent } from "../../components/AddAndEditComponent";
import { ButtonComponent } from "../../components/ButtonComponent";
import { DataTable } from "../../components/DataTable";
import { WarningOverlayComponent } from "../../components/WarningOverlayComponent";
import { Field, IOrderCategory, IOrderItem, ISupplier, MultiField, SingleField } from "../../type";
import { useContext } from "react";
import { LanguageContext } from "../../App";

type Props = {
}
const defaultButton = (e:React.MouseEvent<HTMLButtonElement>):void => {e.preventDefault()};

export const OrderManagement: React.FC<Props> = () => {
    const text = useContext(LanguageContext);
    const [showWarning, setShowWarning] = useState<boolean>(false);
    const [warningButton, setWarningButton] = useState<(e:React.MouseEvent<HTMLButtonElement>) => void>(() => defaultButton);
    const [canCancel, setCanCancel] = useState<boolean>(true);
    const [warningMessage, setWarningMessage] = useState<string>("");
    const [showAddEditComponent, setShowAddEditComponent] = useState<boolean>(false);
    const [addEditTitle, setAddEditTitle] = useState<string>("");
    const [addEditFields, setAddEditFields] = useState<Field[]>([]);
    const [saveButton, setSaveButton] = useState<(fields:Field[]) => void>(() => defaultButton);
    const [categoryList, setCategoryList] = useState<IOrderCategory[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [itemList, setItemList] = useState<IOrderItem[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<string>("");
    const [supplierList, setSupplierList] = useState<ISupplier[]>([]);
    const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");

    useEffect(() => {
        getOrderCategories()
            .then(res => {
                setCategoryList(res.orderCategories);
            });
        getSuppliers()
            .then(res => {
                setSupplierList(res.suppliers);
            })
        getOrderItems()
            .then(res => {
                setItemList(res.orderItems);
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
                display:text.list.name,
                fieldType:"Single",
                required: true,
                field:{value:""}
            }, {
                name: "Description",
                display:text.list.description,
                fieldType:"Single",
                required:false,
                field:{value:""}
            }
        ]
        setAddEditTitle(text.list.addCategory);
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
                display:text.list.name,
                fieldType:"Single",
                required: true,
                field:{value:categoryToEdit.name}
            }, {
                name: "Description",
                display:text.list.description,
                fieldType:"Single",
                required:false,
                field:{value:categoryToEdit.description}
            }
        ];
        setAddEditTitle(text.list.edit.replace("{replace}", categoryToEdit.name));
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
        deleteOrderCategory(selectedCategoryId).then(res => {
            setCategoryList(res.orderCategories);
            setSelectedCategoryId("");
        }).catch(err => {
            setWarningMessage(err);
            setCanCancel(false);
            setShowWarning(true);
        });
        setShowWarning(false);
    }

    const onSaveCategoryButton = (fields:Field[]):void => {
        const newCategory:IOrderCategory = {
            _id: selectedCategoryId===""?undefined:selectedCategoryId,
            name: (fields[0]?.field as SingleField)?.value as string,
            description:(fields[1]?.field as SingleField)?.value as string
        }
        if(selectedCategoryId===""){
            createOrderCategory(newCategory)
                .then(res => {
                    setCategoryList(res.orderCategories)
                });
        } else updateOrderCategory(newCategory)
            .then(res => {
                setCategoryList(res.orderCategories)
            });
        setShowAddEditComponent(false);
    }
    
    const onAddItemClick = (e:React.MouseEvent<HTMLButtonElement>):void => {
        const newFields:Field[] = [
            {  
                name:"Name",
                display:text.list.name,
                fieldType:"Single",
                required: true,
                field:{value:""}
            }, {
                name:"Category",
                display:text.list.category,
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
                display:text.list.description,
                fieldType:"Single",
                required:false,
                field:{value:""}
            }, {
                name:"Supplier",
                display:text.list.supplier,
                fieldType:"Multi",
                required: false,
                field: {
                    isMultiSelect:false,
                    name:"Supplier",
                    list: supplierList.map(category => {
                        return {
                            id:category._id,
                            name:category.name,
                            display:category.name
                        }
                    })
                }
            }
        ]
        setAddEditTitle(text.list.addItem);
        setSaveButton(()=> onSaveItemButton);
        setAddEditFields(newFields);
    }

    const onEditItemClick = (e:React.MouseEvent<HTMLButtonElement>):void => {
        const itemToEdit = itemList.find(item => item._id === selectedItemId);
        if(itemToEdit === undefined) return;
        const itemCategory = categoryList.find(category => category._id === itemToEdit.category);
        const selectedCategory = itemCategory === undefined? undefined: {
            id: itemCategory._id,
            name: itemCategory.name,
            display: itemCategory.name
        };
        const itemSupplier = supplierList.find(supplier => supplier._id === itemToEdit.supplier)
        const selectedSupplier = itemSupplier === undefined? undefined: {
            id: itemSupplier._id,
            name: itemSupplier.name,
            display: itemSupplier.name
        };
        const editFields:Field[] = [
            {
                name:"Name",
                display:text.list.name,
                fieldType:"Single",
                required: true,
                field:{value:itemToEdit.name}
            }, {
                name:"Category",
                display:text.list.category,
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
                    selected: selectedCategory
                },

            },{
                name: "Description",
                display:text.list.description,
                fieldType:"Single",
                required:false,
                field:{value:itemToEdit.description}
            }, {
                name:"Supplier",
                display:text.list.supplier,
                fieldType:"Multi",
                required: false,
                field: {
                    isMultiSelect:false,
                    name:"Supplier",
                    list: supplierList.map(category => {
                        return {
                            id:category._id,
                            name:category.name,
                            display:category.name
                        }
                    }),
                    selected: selectedSupplier
                },

            }
        ];
        setAddEditTitle(text.list.edit.replace("{replace}", itemToEdit.name));
        setSaveButton(()=> onSaveItemButton);
        setAddEditFields(editFields);
    }
    
    const onDeleteItemClick = (e:React.MouseEvent<HTMLButtonElement>):void => {
        const itemToDelete = itemList.find(item => item._id === selectedItemId);
        if(itemToDelete === undefined) return;
        setWarningMessage(text.warning.delete.replace("{replace}", itemToDelete.name));
        setWarningButton(()=> onConfirmDeleteItemClick);
        setCanCancel(true);
        setShowWarning(true);
    }

    const onConfirmDeleteItemClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        setWarningButton(() => defaultButton);
        deleteOrderItem(selectedItemId).then(res => {
            setItemList(res.orderItems);
            setSelectedItemId("");
        }).catch(err => {
            setWarningMessage(err);
            setCanCancel(false);
            setShowWarning(true);
        });
        setShowWarning(false);
    }

    const onSaveItemButton = (fields:Field[]):void => {
        const newItem:IOrderItem = {
            _id: selectedItemId===""?undefined:selectedItemId,
            name: (fields[0]?.field as SingleField)?.value as string,
            category:(fields[1].field as MultiField).selected?.id!,
            description:(fields[2]?.field as SingleField)?.value as string,
            supplier: (fields[3].field as MultiField).selected?.id!
        }
        if(selectedItemId===""){
            createOrderItem(newItem)
                .then(res => {
                    setItemList(res.orderItems)
                });
        } else updateOrderItem(newItem)
            .then(res => {
                setItemList(res.orderItems);
            });
        setShowAddEditComponent(false);
    }

    const onSaveSupplierButton = (fields:Field[]):void => {
        const newSupplier:ISupplier = {
            _id: selectedItemId===""?undefined:selectedItemId,
            name: (fields[0]?.field as SingleField)?.value as string,
            description:(fields[1]?.field as SingleField)?.value as string
        }
        if(selectedItemId===""){
            createSupplier(newSupplier)
                .then(res => {
                    setSupplierList(res.suppliers);
                });
        } else updateSupplier(newSupplier)
            .then(res => {
                setSupplierList(res.suppliers);
            });
        setShowAddEditComponent(false);
    }
    
    const onAddSupplierClick = (e:React.MouseEvent<HTMLButtonElement>):void => {
        const newFields:Field[] = [
            {  
                name:"Name",
                display:text.list.name,
                fieldType:"Single",
                required: true,
                field:{value:""}
            },{
                name: "Description",
                display:text.list.description,
                fieldType:"Single",
                required:false,
                field:{value:""}
            }
        ]
        setAddEditTitle(text.list.addSupplier);
        setSaveButton(()=> onSaveSupplierButton);
        setAddEditFields(newFields);
    }

    const onEditSupplierClick = (e:React.MouseEvent<HTMLButtonElement>):void => {
        const supplierToEdit = supplierList.find(supplier => supplier._id === selectedSupplierId);
        if(supplierToEdit === undefined) return;
        const editFields:Field[] = [
            {
                name:"Name",
                display:text.list.name,
                fieldType:"Single",
                required: true,
                field:{value:supplierToEdit.name}
            }, {
                name: "Description",
                display:text.list.description,
                fieldType:"Single",
                required:false,
                field:{value:supplierToEdit.description}
            }
        ];
        setAddEditTitle(text.list.edit.replace("{replace}", supplierToEdit.name));
        setSaveButton(()=> onSaveSupplierButton);
        setAddEditFields(editFields);
    }
    
    const onDeleteSupplierClick = (e:React.MouseEvent<HTMLButtonElement>):void => {
        const supplierToDelete = supplierList.find(supplier => supplier._id === selectedSupplierId);
        if(supplierToDelete === undefined) return;
        if(itemList.find(item => item.category === selectedCategoryId) !== undefined) {
            setWarningMessage(text.warning.canNotDelete.replace("{replace}", supplierToDelete.name));
            setCanCancel(false);
            setShowWarning(true);
            return;
        }
        setWarningMessage(text.warning.delete.replace("{replace}", supplierToDelete.name));
        setWarningButton(()=> onConfirmDeleteSupplierClick);
        setCanCancel(true);
        setShowWarning(true);
    }

    const onConfirmDeleteSupplierClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        setWarningButton(() => defaultButton);
        deleteSupplier(selectedSupplierId).then(res => {
            setSupplierList(res.suppliers);
            setSelectedSupplierId("");
        }).catch(err => {
            setWarningMessage(err);
            setCanCancel(false);
            setShowWarning(true);
        });
        setShowWarning(false);
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
            <h2>{text.admin.orders.categories}</h2>
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
                headers={[text.list.name, text.list.description]}
                rows={categoryList.map(category => {
                    return {
                        id:category._id!,
                        columns: [category.name, category.description||""]
                    }
                })}
                currentId={selectedCategoryId}
                setId={setSelectedCategoryId}
            />
            <h2>{text.admin.orders.items}</h2>
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
                headers={[text.list.name, text.list.category, text.list.description]}
                rows={itemList.map(item => {
                    return {
                        id: item._id!,
                        columns: [item.name, categoryList.find(category => category._id === item.category)?.name!, item.description||""]
                    }
                })}
                currentId={selectedItemId}
                setId={setSelectedItemId}
            />
            <h2>{text.admin.orders.suppliers}</h2>
            <div className={styles["buttonList"]}>
                <ButtonComponent 
                    name={<BsPlusLg />}
                    onClick={onAddSupplierClick}
                />
                {selectedCategoryId !== ""?
                    <>
                        <ButtonComponent
                            onClick={onEditSupplierClick}
                            name={<BsPencil />}
                            width={"100px"}
                        />
                        <ButtonComponent
                            onClick={onDeleteSupplierClick}
                            name={<BsTrash />}
                            width={"100px"}
                            isNegativeColor={true}
                        />
                    </>:
                    ""
                }
            </div>
            <DataTable
                headers={[text.list.name, text.list.description]}
                rows={supplierList.map(supplier => {
                    return {
                        id:supplier._id!,
                        columns: [supplier.name, supplier.description||""]
                    }
                })}
                currentId={selectedSupplierId}
                setId={setSelectedSupplierId}
            />
        </>
    );
}