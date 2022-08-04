import React, {useState, useEffect, Dispatch, RefObject} from "react";
import {SuggestionListType} from "../type"
import styles from "./../css/suggestionsList.module.css";

type Props = {
    suggestionsList:SuggestionListType[],
    input:string,
    style:string,
    setInput:Dispatch<string>,
    setId:Dispatch<string>,
    placeholder?: string,
    inputRef: RefObject<HTMLInputElement>,
    nextElementRef?: RefObject<HTMLInputElement>
}

export const InputWithSuggestionsComponent:React.FC<Props> =({suggestionsList, input, style, setInput, setId, placeholder, inputRef, nextElementRef}) =>{
    const [keyCode, setKeyCode] = useState<string>("");
    const [showSuggestions ,setShowSuggestions] = useState<boolean>(false);

    const onInputChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
        const userInput = e.target.value;
        setInput(userInput);
        if(suggestionsList.findIndex(suggestion => suggestion.name === userInput) !== -1)
            setShowSuggestions(false);
        else
            setShowSuggestions(true);
    }
    
    const onKeyDown = (e: React.KeyboardEvent):void => {
        setKeyCode(e.key);
    }

    const onKeyUp = (e: React.KeyboardEvent):void => {
        setKeyCode("");
    }

    return (
        <>
            <input 
                type="text"
                value={input}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                className={style}
                placeholder={placeholder}
                ref={inputRef}
            />
            {showSuggestions?<SuggestionsListComponent
                keyCode={keyCode}
                suggestionList={suggestionsList}
                input={input}
                setInput={setInput}
                setId={setId}
                nextInputElement={nextElementRef}
            />:""}
        </>
    );
}


type SuggestionsListProps = {
    suggestionList: SuggestionListType[],
    keyCode: string,
    input: string,
    setInput: Dispatch<string>,
    setId: Dispatch<string>,
    nextInputElement?: RefObject<HTMLInputElement>
}

const SuggestionsListComponent: React.FC<SuggestionsListProps> = ({suggestionList, keyCode, input, setInput, setId, nextInputElement}) => {
    const [filteredSuggestions, setFilteredSuggestions] = useState<SuggestionListType[]>([]);
    const [activeStateSuggestionIndex, setActiveStateSuggestionIndex] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [suggestionWasClicked, setSuggestionWasClicked] = useState<boolean>(false);
    const [height, setHeight] = useState<string>("0");

    useEffect(()=> {
        const incrementBy = 1;
        if(keyCode==="ArrowDown"){
            if(activeStateSuggestionIndex < (filteredSuggestions.length - 1)) setActiveStateSuggestionIndex(activeStateSuggestionIndex + incrementBy);
            else setActiveStateSuggestionIndex(0);
        } else if(keyCode === "ArrowUp"){
            if(activeStateSuggestionIndex > 0) setActiveStateSuggestionIndex(activeStateSuggestionIndex - incrementBy);
            else setActiveStateSuggestionIndex(filteredSuggestions.length - 1);
        } else if(keyCode === "Enter") {
            if(activeStateSuggestionIndex > -1){
                const selectedSuggestion = filteredSuggestions[activeStateSuggestionIndex];
                selectSuggestion(selectedSuggestion.name, selectedSuggestion.id);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyCode]);

    
    useEffect(()=> {
        if(input === "" || suggestionWasClicked){
            setShowSuggestions(false);
            setFilteredSuggestions([]);
            setSuggestionWasClicked(false);
            setActiveStateSuggestionIndex(-1);
            return;
        }
        const suggestions = suggestionList.filter(suggestion => suggestion.name.toLowerCase().indexOf(input.toLowerCase()) > -1);
        setFilteredSuggestions(suggestions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input, suggestionList]);

    useEffect(()=> {
        if(filteredSuggestions.length > 0) {
            setShowSuggestions(true);
            setActiveStateSuggestionIndex(0);
        }else setShowSuggestions(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredSuggestions]);

    useEffect(()=>{
        if(showSuggestions) {
            setHeight("150px");
        } else {
            setHeight("0");
        }
    },[showSuggestions]);


    const selectSuggestion = (name:string, id:string) => {
        setSuggestionWasClicked(true);
        setShowSuggestions(false);
        setInput(name);
        setId(id);
        if(nextInputElement !== undefined && nextInputElement.current !== null){
            nextInputElement.current!.focus();
        }
    }

    const onClick = (e:React.MouseEvent<HTMLLIElement>) => {
        const clickedName:string = e.currentTarget.innerText;
        const id:string = e.currentTarget.dataset.id !== null ? e.currentTarget.dataset.id! : "";
        selectSuggestion(clickedName, id);
    }
    const onMouseEnter = (e:React.MouseEvent<HTMLLIElement>) => {
        const hoverElementIndex = e.currentTarget.dataset.index;
        if(hoverElementIndex === undefined) return;
        setActiveStateSuggestionIndex(parseInt(hoverElementIndex));
    }
    return (
        <>
                <ul className={styles["suggestions"]} style={{maxHeight:height}}>
                    {filteredSuggestions.map((suggestion, index) => {
                        let className = index === activeStateSuggestionIndex? `${styles["suggestion"]} ${styles["active"]}`:styles["suggestion"];
                        return (
                            <li className={className} key={suggestion.id} onClick={onClick} data-id={suggestion.id} data-index={index} onMouseEnter={onMouseEnter}>
                                {suggestion.name}
                            </li>
                        )
                    })}
                </ul>
        </>
    );
}