import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "./../css/searchBar.module.css";
import { MdSearch, MdOutlineSkipNext, MdOutlineSkipPrevious } from "react-icons/md";


type Props = {
    searchTerm:string,
    setSearchTerm:Dispatch<SetStateAction<{term:string, prevTerm:string}>>,
    searchIndex?:number,
    searchLength?:number,
    onArrowClick?:(direction:"+"|"-")=>void
}

export const SearchBar:React.FC<Props> = ({searchTerm, setSearchTerm, searchIndex, searchLength, onArrowClick}) => {
    const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

    const onSearchChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e?.currentTarget?.value;
        // eslint-disable-next-line eqeqeq
        if(newValue == undefined) return;
        setSearchTerm(prevSearch => {
            return {
                term: newValue,
                prevTerm: prevSearch.term
            }
        });
    }

    return (
        <div className={styles["searchBar"]}>
                {searchTerm==="" && !isSearchFocused?<MdSearch style={
                        {
                            marginLeft:"0.3rem",
                            marginTop: "5px",
                            position: "absolute",
                            color: "#5f7f88"
                        }
                    }
                    />:""}
                <input
                    onChange={onSearchChange}
                    onFocus={ ()=> setIsSearchFocused(true) }
                    onBlur={ ()=> setIsSearchFocused(false) }
                    type="text"
                    value={searchTerm}
                />
                {((searchLength || 0) > 0 && onArrowClick !== undefined)
                ?<div  className={styles["searchIndex"]}>
                    <MdOutlineSkipPrevious
                        className={styles["arrows"]}
                        onClick={() => onArrowClick("-")}
                    />
                    <MdOutlineSkipNext
                        className={styles["arrows"]}
                        onClick={() => onArrowClick("+")}
                    />
                    {searchIndex!==undefined
                        ?<p>
                            {searchIndex + 1} / {searchLength}
                        </p>
                        :""
                    }
                </div>:""}
            </div>
    )
}