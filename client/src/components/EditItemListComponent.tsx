import React, { Dispatch, RefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import styles from "./../css/itemList.module.css";
import { BsCaretDown, BsCaretUp, BsChevronDown } from "react-icons/bs";
import { MdSearch } from "react-icons/md";
import { CategoryListType, ItemListType, ItemObjectType } from "../type";
import { EmployeeContext } from "../App";

type Props = {
    categories:CategoryListType[],
    currentList:ItemObjectType,
    setCurrentList:Dispatch<SetStateAction<ItemObjectType>>
}



export const EditItemListComponent:React.FC<Props> = ({categories, currentList, setCurrentList}) => {
    const [categoryList, setCategoryList] = useState<CategoryListType[]>([]);
    const itemRefs = useRef<HTMLLIElement[][]>([]);
    const [searchTerm, setSearchTerm] = useState<{term:string}>({term:""});
    const [searchIndex, setSearchIndex] = useState<number>(-1);
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
        setSearchTerm({term:""});
    }, [categories])

    const setSearchRefs = (refArray:HTMLLIElement[][]) => {
        const newSearchRefs = refArray.reduce((newRefs, array, index) => {
            const foundRefs = array.filter(ref => ref.dataset.name?.toLowerCase()===searchTerm.term.toLowerCase());
            return newRefs.concat(foundRefs);
        }, []);
        searchRefs.current = newSearchRefs;
        if(newSearchRefs.length !== 0) {
            setSearchIndex(0);
        } else setSearchIndex(-1);
    }
    
    useEffect(()=> {
        if(searchTerm.term === "") {
            searchRefs.current = [];
            setSearchIndex(-1);
        } else if(searchRefs.current.length===0){
            setSearchRefs(itemRefs.current);
        } else {
            setSearchRefs([[...searchRefs.current]]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm.term]);

    useEffect(()=> {
        if(searchIndex === -1) return;
        searchRefs.current[searchIndex].scrollIntoView({ behavior: "smooth" });
        setActiveItemId(searchRefs.current[searchIndex].dataset.id || "");
    }, [searchIndex])

    const onSearchChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm({term:e.currentTarget.value});
    }

    const onArrowClick = (e:React.MouseEvent<SVGElement>, direction:"+"|"-") => {
        const length = searchRefs.current.length;
        if(direction==="+") {
            setSearchIndex(prevIndex => {
                const newIndex = prevIndex + 1;
                if(newIndex < length) return newIndex;
                return 0;
            });
        } else {
            setSearchIndex(prevIndex => {
                const newIndex = prevIndex - 1;
                if(newIndex >= 0) return newIndex;
                return length - 1;
            });
        }
    };

    return (
        <>
            <div className={styles["searchBar"]}>
                {searchTerm.term===""?<MdSearch style={
                        {
                            marginLeft:"0.5rem",
                            marginTop: "3.5px",
                            position: "absolute",
                            color: "#5f7f88"
                        }
                    }
                    />:""}
                <input
                    onChange={onSearchChange}
                    type="text"
                    value={searchTerm.term}
                />
                {searchRefs.current.length > 0?<>
                    <BsCaretUp onClick={(e) => onArrowClick(e, "+")}/>
                    <BsCaretDown onClick={(e) => onArrowClick(e, "-")}/>
                </>:""}
            </div>
            <div className={styles["itemContainer"]}>
                {categoryList.map((category, index) => {
                    return (
                        <AccordionComponent 
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
    searchIndex: number,
    refArray: RefObject<Array<HTMLLIElement[]>>,
    activeItemId: string,
    setActiveItemId: Dispatch<SetStateAction<string>>
}

const AccordionComponent:React.FC<AccordionProps> = ({title, categoryIndex, list, currentItems, setCurrentItems, refArray, activeItemId, setActiveItemId}) => {
    const [isShown, setIsShown] = useState<boolean>(false);
    const loggedInEmployee = useContext(EmployeeContext);

    useEffect(() => {
        if(!isShown){
            if(list.find(item => item.id === activeItemId)!== undefined)
                setIsShown(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeItemId])

    const onQuantityChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.currentTarget.value);
        const id = e.currentTarget.parentElement?.dataset.id;
        if(isNaN(newValue) || id === undefined) return;
        setCurrentItems(oldItems => {
            if(oldItems[id]=== undefined){
                oldItems[id] = {
                    quantity: newValue,
                    employee: loggedInEmployee._id!
                }
            } else oldItems[id].quantity = newValue;
            return oldItems;
        })
    }

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
                <div className={`${styles["accordion-content"]} ${isShown?styles["shown"]:styles["hidden"]}`}>
                    <ul>
                        {list.map((item, index) => {
                            return (
                                <ItemComponent 
                                    activeItemId={activeItemId}
                                    item={item}
                                    refArray={refArray}
                                    categoryIndex={categoryIndex}
                                    index={index}
                                    quantity={currentItems[item.id]?.quantity}
                                    onQuantityChange={onQuantityChange}
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
    quantity: string | number,
    onQuantityChange: (e:React.ChangeEvent<HTMLInputElement>) => void
}

const ItemComponent:React.FC<ItemProps> = ({activeItemId, setActiveItemId, item, refArray, categoryIndex, index, quantity, onQuantityChange}) => {
    const [isHovering, setIsHovering] = useState<boolean>(false);

    const onMouseEnter = (e:React.MouseEvent<HTMLLIElement>) => {
        setIsHovering(true);
    }

    const onMouseLeave = (e:React.MouseEvent<HTMLLIElement>) => {
        setIsHovering(false);
    }
    const onClick = (e:React.MouseEvent<HTMLLIElement>) => {
        const id = e.currentTarget.dataset.id!;
        if(id===activeItemId && e.currentTarget === e.target)
            setActiveItemId("")
        else setActiveItemId(id)
    }
    
    return (
        <li
            className={`${styles["listItem"]} ${activeItemId===item.id?styles["active"]: isHovering ? styles["hovering"]:""}`}
            key={item.id}
            data-id={item.id}
            ref={el => {
                if(refArray.current == null) return;
                refArray.current[categoryIndex][index] = el as HTMLLIElement}
            }
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
        >
            <input
                key={quantity}
                type="number"
                min="0"
                value={quantity}
                onChange={onQuantityChange}
            />
            {item.display}
        </li>
    )
}