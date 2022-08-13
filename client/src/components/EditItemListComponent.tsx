import React, { Dispatch, RefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import styles from "./../css/itemList.module.css";
import { BiPlusCircle, BiMinusCircle } from "react-icons/bi";
import { CategoryListType, ItemListType, ItemObjectType } from "../type";
import { EmployeeContext } from "../App";
import { SearchBar } from "./SearchBarComponent";
import { BsChevronDown } from "react-icons/bs";

type Props = {
    categories:CategoryListType[],
    currentList:ItemObjectType,
    setCurrentList:Dispatch<SetStateAction<ItemObjectType>>
}



export const EditItemListComponent:React.FC<Props> = ({categories, currentList, setCurrentList}) => {
    const [categoryList, setCategoryList] = useState<CategoryListType[]>([]);
    const itemRefs = useRef<HTMLLIElement[][]>([]);
    const [searchTerm, setSearchTerm] = useState<{term:string, prevTerm:string}>({term:"", prevTerm:""});
    const [searchIndex, setSearchIndex] = useState<{index:number}>({index:-1});
    const searchRefs = useRef<HTMLLIElement[]>([]);
    const [activeItemId, setActiveItemId] = useState<string>("");

    useEffect(()=> {
        setCategoryList(() => {
            const newCategories:CategoryListType[] = categories.map((category, index) => {
                itemRefs.current[index] = new Array(category.items.length);
                return {
                    ...category
                }
            });
            
            for(let categoryId in categories){
                newCategories[categoryId] = {...categories[categoryId]};
            }
            return newCategories;
        })
        setSearchTerm(prevSearch => {
            return {
                term:"",
                prevTerm:prevSearch.term 
            };
        });
    }, [categories])

    const filterAndSetSearchRefs = (refArray:HTMLLIElement[][]) => {
        const newSearchRefs = refArray.reduce((newRefs, array) => {
            const foundRefs = array.filter(ref => ref && ref.dataset.name!.toLowerCase().indexOf(searchTerm.term.toLowerCase()) > -1);
            return newRefs.concat(foundRefs);
        }, []);
        searchRefs.current = newSearchRefs;
        if(newSearchRefs.length !== 0) {
            setSearchIndex({index:0});
        } else setSearchIndex({index:-1});
    }
    
    useEffect(()=> {
        if(searchTerm.term === "") {
            searchRefs.current = [];
            setSearchIndex({index:-1});
        } else if(searchTerm.prevTerm === "" || searchTerm.term.length < searchTerm.prevTerm.length){
            filterAndSetSearchRefs(itemRefs.current);
        } else {
            filterAndSetSearchRefs([searchRefs.current]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    useEffect(()=> {
        if(searchIndex.index === -1 || !searchRefs.current || !searchRefs.current[searchIndex.index]) return;
        setActiveItemId(searchRefs.current[searchIndex.index].dataset.id || "");
        searchRefs.current[searchIndex.index].scrollIntoView({ behavior: "smooth", block:"nearest" });
    }, [searchIndex])

    const onArrowClick = (direction:"+"|"-") => {
        const length = searchRefs.current.length;
        if(length <= 1) return;
        if(direction==="+") {
            setSearchIndex(prevIndex => {
                const newIndex = prevIndex.index + 1;
                if(newIndex < length) return {index:newIndex};
                return {index:0};
            });
        } else {
            setSearchIndex(prevIndex => {
                const newIndex = prevIndex.index - 1;
                if(newIndex >= 0) return {index:newIndex};
                return {index:length - 1};
            });
        }
    };

    return (
        <>
            <SearchBar 
                searchTerm={searchTerm.term}
                setSearchTerm={setSearchTerm}
                searchIndex={searchIndex.index}
                searchLength={searchRefs.current.length}
                onArrowClick={onArrowClick}
            />
            <div className={styles["itemContainer"]}>
                {categoryList.map((category, index) => {
                    return (
                        <AccordionComponent 
                            key={category.id+index}
                            title={category.name}
                            categoryIndex={index}
                            list={category.items}
                            currentItems={currentList}
                            setCurrentItems={setCurrentList}
                            searchIndex={searchIndex}
                            refArray={itemRefs}
                            activeItemId={activeItemId}
                            setActiveItemId={setActiveItemId}
                        />
                    );
                })}
            </div>
        </>
    );
}

type AccordionProps = {
    title: string,
    categoryIndex: number,
    list: ItemListType[],
    currentItems: ItemObjectType,
    setCurrentItems: Dispatch<SetStateAction<ItemObjectType>>,
    searchIndex: {index:number},
    refArray: RefObject<Array<HTMLLIElement[]>>,
    activeItemId: string,
    setActiveItemId: Dispatch<SetStateAction<string>>
}

const AccordionComponent:React.FC<AccordionProps> = ({title, categoryIndex, list, currentItems, setCurrentItems, searchIndex, refArray, activeItemId, setActiveItemId}) => {
    const INITIAL_MAX_HEIGHT = 100000;
    const [isShown, setIsShown] = useState<boolean>(true);
    const maxHeightRef = useRef(INITIAL_MAX_HEIGHT);
    const accordionRef = useRef<HTMLDivElement>(null);

    useEffect(()=> {
        setIsShown(false);
    }, []);

    useEffect(() => {
        if(!isShown){
            if(list.find(item => item.id === activeItemId)!== undefined)
                setIsShown(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeItemId, searchIndex]);

    useEffect(()=> {
        if(accordionRef.current && maxHeightRef.current === INITIAL_MAX_HEIGHT)
            maxHeightRef.current = accordionRef.current.offsetHeight;
    }, [isShown])

    const onTitleClick = (e:React.MouseEvent<HTMLDivElement>) => {
        setIsShown(prevVal => !prevVal);
    }

    return (
        <div className={styles["accordion"]}>
            <div className={styles["accordion-item"]}>
                <div
                    className={styles["accordion-title"]}
                    onClick={onTitleClick}
                >
                    <BsChevronDown
                        className={`${styles["showIcon"]} ${isShown?"":styles["rotated"]}`} 
                    />
                    {title}
                </div>
                <div
                    className={styles["accordion-content"]}
                    style={
                        isShown
                            ?{
                                maxHeight:maxHeightRef.current
                            }
                            :{
                                maxHeight:0
                            }
                    }
                    ref={accordionRef}
                >
                    <ul>
                        {list.map((item, index) => {
                            return (
                                <ItemComponent
                                    key={item.id+index}
                                    activeItemId={activeItemId}
                                    item={item}
                                    refArray={refArray}
                                    categoryIndex={categoryIndex}
                                    index={index}
                                    quantity={currentItems[item.id]?.quantity}
                                    setCurrentItems={setCurrentItems}
                                    setActiveItemId={setActiveItemId}
                                />
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}


type ItemProps = {
    activeItemId:string,
    setActiveItemId:Dispatch<SetStateAction<string>>,
    item:ItemListType,
    refArray: RefObject<Array<HTMLLIElement[]>>,
    categoryIndex:number,
    index:number,
    quantity: string | number | undefined,
    setCurrentItems: Dispatch<SetStateAction<ItemObjectType>>
}

const ItemComponent:React.FC<ItemProps> = ({activeItemId, setActiveItemId, item, refArray, categoryIndex, index, quantity, setCurrentItems}) => {
    const loggedInEmployee = useContext(EmployeeContext);


    const onClick = (e:React.MouseEvent<HTMLLIElement>) => {
        const id = e.currentTarget.dataset.id!;
        if(id===activeItemId && e.currentTarget === e.target)
            setActiveItemId("")
        else setActiveItemId(id)
    }
    

    const onQuantityChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.currentTarget.value.replace(/[^0-9]/g, "");
        setCurrentItems(oldItems => {
            const newItems = {...oldItems};
            newItems[item.id] = {
                quantity: newValue === ""?undefined:parseInt(newValue),
                employee: loggedInEmployee._id!
            }
            return newItems;
        })
    }

    const onArrowClick = (direction:"+"|"-") => {
        const valueToAdd:number = direction === "+"? 1 : -1
        setCurrentItems(oldItems => {
            const newItems = {...oldItems};
            const newQuantity = (oldItems[item.id]?.quantity || 0) + valueToAdd;
            newItems[item.id] = {
                quantity: newQuantity >= 0 ? newQuantity : undefined,
                employee: loggedInEmployee._id!
            };
            return newItems;
        })
    }
    
    return (
        <li
            className={`${styles["listItem"]} ${activeItemId===item.id?styles["active"]:styles["inActive"]}`}
            data-id={item.id}
            data-name={item.name}
            ref={el => {
                if(refArray.current == null) return;
                refArray.current[categoryIndex][index] = el as HTMLLIElement}
            }
            onClick={onClick}
        >
            <div className={styles["inputPart"]}>
                <BiMinusCircle
                    className={styles["icon"]} 
                    style={
                        {
                            opacity: activeItemId===item.id?1:0
                        }
                    }
                    onClick={() => activeItemId===item.id?onArrowClick("-"):()=>{}}
                />
                <input
                    type="tel"
                    min="0"
                    value={quantity===undefined?"":quantity}
                    onChange={onQuantityChange}
                />
                <BiPlusCircle
                    className={styles["icon"]} 
                    style={
                        {
                            opacity: activeItemId===item.id?1:0
                        }
                    }
                    onClick={() => activeItemId===item.id?onArrowClick("+"):()=>{}}
                />
            </div>
            {item.display}
        </li>
    )
}