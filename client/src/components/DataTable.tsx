import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./../css/dataTable.module.css";
import {MdArrowDropUp, MdArrowDropDown, MdSearch} from "react-icons/md";
import { useContext } from "react";
import { LanguageContext } from "../App";
import { LoadingSpinner } from "./LoadinSpinnerComponent";

type Props = {
    headers: string[],
    rows: Row[],
    currentId: string,
    setId: Dispatch<SetStateAction<string>>
}

type Row = {
    id:string,
    columns:string[],
    isHovering?:boolean
};

export const DataTable:React.FC<Props> = ({headers, rows, currentId, setId}) => {
    const text = useContext(LanguageContext);
    const [currentRows, setCurrentRows] = useState<Row[]>([]);
    const [sortIndex, setSortIndex] = useState<{index:number, prevIndex:number|null}>({index:0, prevIndex:null});
    const [searchTerm, setSearchTerm] = useState<{term:string}>({term:""});
    const [searchColumnIndex, setSearchColumnIndex] = useState<number>(-1);
    const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

    useEffect(()=> {
        setCurrentRows(rows);
        setSearchTerm(oldTerm => {
            return {term:oldTerm.term};
        })
        setSortIndex(prevSortIndex => {
            return {index: prevSortIndex.index, prevIndex:null};
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows]);

    useEffect(()=>{
        setCurrentRows(prevRows => {
            const newRows = [...prevRows];
            const isDescending = sortIndex.prevIndex!==sortIndex.index;
            newRows.sort((a, b) => {
                const result =  columnSorter(a, b, sortIndex);
                return result * (isDescending?1:-1);
            })
            return newRows;
        });
    }, [sortIndex]);

    useEffect(()=> {
        if(searchTerm.term === "") {
            setCurrentRows(rows);
            setSortIndex(prevSortIndex => {
                return {...prevSortIndex};
            })
            return;
        };
        let idIncluded = false;
        if(searchTerm.term.indexOf(",") === -1) {
            setCurrentRows(_ => {
                const newRows = rows.filter(row => {
                    const foundColumn = row.columns.find((column, index) => {
                            return (searchColumnIndex === -1 && column.toLowerCase().indexOf(searchTerm.term.toLowerCase()) > -1) ||
                                (searchColumnIndex !== -1 && searchColumnIndex === index && column.toLowerCase().indexOf(searchTerm.term.toLowerCase()) > -1)
                    });
                    if(foundColumn !== undefined && row.id === currentId) idIncluded = true;
                    return foundColumn !== undefined
                });
                return newRows;
            });
        } else {
            setCurrentRows(_ => {
                const splitSearchTerms:string[] = searchTerm.term.split(",");
                const newRows:Row[] = splitSearchTerms.reduce((prevRows, currentSearchTerm) => {
                    if(currentSearchTerm==="") return prevRows;
                    const filteredRows = prevRows.filter(row => { 
                        const foundColumn = row.columns.find(column => {
                            return column.toLowerCase().indexOf(currentSearchTerm.toLowerCase().replace(/\s/g, "")) > -1
                        });
                        if(foundColumn !== undefined && row.id === currentId) idIncluded = true;
                        return foundColumn !== undefined;
                    });
                    
                    return filteredRows;
                }, rows)
                return newRows;
            });
        }  
        if(!idIncluded) setId("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, searchColumnIndex]);
    
    const onRowClick = (e:React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        let id = e.currentTarget.dataset.id;
        if(id === undefined) return;
        else if(id===currentId) id = "";
        setId(id);
    }
    const onRowEnter = (e:React.MouseEvent<HTMLTableRowElement>) => {
        const index = e.currentTarget.dataset.index;
        if(index === undefined) return;
        setCurrentRows(prevRows => {
            const newRows = [...prevRows];
            try {newRows[parseInt(index)].isHovering = true;}
            catch {}
            return newRows;
        });
    }

    const onRowLeave = (e:React.MouseEvent<HTMLDivElement>) => {
        const index = e.currentTarget.dataset.index;
        if(index === undefined) return;
        setCurrentRows(prevRows => {
            const newRows = [...prevRows];
            try{newRows[parseInt(index)].isHovering = false;}
            catch{}
            return newRows;
        });
    }

    const onHeaderClick = (e:React.MouseEvent<HTMLTableCellElement>) => {
        const newSortIndex = e.currentTarget.dataset.index;
        if(newSortIndex === undefined) return;
        setSortIndex(prevSortIndex => {
            return {
                index:parseInt(newSortIndex),
                prevIndex: prevSortIndex.index===prevSortIndex.prevIndex?null:prevSortIndex.index
            };
        });
    }

    const onSearchChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.currentTarget.value;
        if(newValue.indexOf(",") > -1) setSearchColumnIndex(-1);
        setSearchTerm({term:newValue});
    }
    const onSelectChange = (e:ChangeEvent<HTMLSelectElement>) => {
        setSearchColumnIndex(e.target.selectedIndex - 1);
    }
    return (
        <div className={styles["dataTable"]}>
            <div className={styles["search"]}>
                {searchTerm.term==="" && !isSearchFocused?<MdSearch style={
                    {
                        marginLeft:"0.5rem",
                        marginTop: "3.5px",
                        position: "absolute",
                        color: "#5f7f88"
                    }
                }
                />:""}
                <input
                    type="text"
                    title={text.dataTable.searchToolTip}
                    value={searchTerm.term}
                    onChange={onSearchChange}
                    onFocus={ ()=> setIsSearchFocused(true) }
                    onBlur={ ()=> setIsSearchFocused(false) }
                />
                <select
                    value={searchColumnIndex===-1?"All":headers[searchColumnIndex]}
                    onChange={onSelectChange}
                >
                    <option value={"All"}>All</option>
                    {headers.map((header, headerIndex) => {
                        return (
                            <option 
                                value={header}
                                key={header+headerIndex}
                            >
                                {header}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className={styles["tableDiv"]}>
                <table className={styles["table"]} cellSpacing="0">
                    <thead>
                        <tr className={styles["header"]}>
                            {headers.map((header, headerIndex) => (
                                <th 
                                    key={header+headerIndex}
                                    className={styles["cell"]}
                                    onClick={onHeaderClick}
                                    data-index={headerIndex}
                                >
                                    {sortIndex.index!==headerIndex?"":sortIndex.index===sortIndex.prevIndex?<MdArrowDropUp />:<MdArrowDropDown />}
                                    {header}
                                </th>)
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.length!==0
                        ?currentRows.map((row, rowIndex) => (
                            <tr
                                className={`${styles["row"]} ${currentId===row.id?styles["active"]:currentRows[rowIndex].isHovering?styles["hover"]:""}`}
                                key={row.id + rowIndex}
                                data-id={row.id}
                                data-index={rowIndex}
                                onClick={onRowClick}
                                onMouseEnter={onRowEnter}
                                onMouseLeave={onRowLeave}
                            >
                                    {row.columns.map((column, columnIndex) => <td className={styles["cell"]} key={columnIndex}>{column!==undefined?column:""}</td>)}
                            </tr>)
                        ):""}
                    </tbody>
                </table>
                {currentRows.length===0
                    ?<LoadingSpinner />
                    :""
                }
            </div>
        </div>
    );
}

function columnSorter(a:Row, b:Row, sortIndex:{index:number, prevIndex:number|null}){
    if(a.columns[sortIndex.index] < b.columns[sortIndex.index]) return 1;
    else if (a.columns[sortIndex.index] > b.columns[sortIndex.index]) return -1;
    if(sortIndex.prevIndex===null) return 0;
    if(a.columns[sortIndex.prevIndex] < b.columns[sortIndex.prevIndex]) return 1;
    else if (a.columns[sortIndex.prevIndex] > b.columns[sortIndex.prevIndex]) return -1;   
    return 0;
}