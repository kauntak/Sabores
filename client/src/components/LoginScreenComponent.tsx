import React, {useState, useRef, Dispatch, useEffect, useContext} from "react";
import styles from "./../css/loginScreen.module.css";
import { SuggestionListType, IEmployee } from "../type";

import { InputWithSuggestionsComponent } from "./InputWithSuggestionsComponent";
import {ButtonComponent} from "./ButtonComponent"
import { InputErrorComponent } from "./InputErrorComponent";
import { authenticateEmployee } from "../api";
import { LanguageContext } from "../App";


type Props = {
    employeeList:IEmployee[],
    id: string,
    setId: Dispatch<string>,
    setIsLoggedIn: Dispatch<boolean>,
    setToken: Dispatch<string>,
    setEmployee: Dispatch<IEmployee>
};


export const LoginScreenComponent: React.FC<Props> = ({employeeList, id, setId, setIsLoggedIn, setToken, setEmployee}) =>{
    const [suggestionsList, setSuggestionsList] = useState<SuggestionListType[]>([]);
    const [name, setNameInput] = useState<string>("");
    const userNameInputRef = useRef<HTMLInputElement>(null);
    const [password, setPasswordInput] = useState<string>("");
    const userPasswordInputRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [nameError, setNameError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const text = useContext(LanguageContext);

    useEffect(() => {
        const suggestions = employeeList.map(employee => {
            return {
                name:`${employee.firstName} ${employee.middleName? employee.middleName + " " : ""}${employee.lastName}`,
                id: employee._id!
            };
        });
        setSuggestionsList(suggestions);
    }, [employeeList]);

    useEffect(() => {
        setNameError("");
        if(name === "") setId("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name]);

    const onPasswordInputChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
        const passwordInput = e.target.value;
        setPasswordInput(passwordInput);
        setPasswordError("");
    }

    const loginButtonClicked = (e?:React.MouseEvent<HTMLButtonElement>):void=> {
        e?.preventDefault();
        if(name === ""){
            setNameError(text.loginScreen.nameRequiredError);
            userNameInputRef.current?.focus()
        }
        if(password === ""){
            setPasswordError(text.loginScreen.passwordRequiredError)
            if(name !== "") userPasswordInputRef.current?.focus();
        }
        if(! (name !== "" && password !== "")) return;
        console.log(id);
        if(id===""){
            const foundSuggestion = suggestionsList.find(suggestion => 
                suggestion.name.toLowerCase() === name.toLowerCase()
            )
            if(foundSuggestion === undefined) {
                setNameError(text.loginScreen.nameNotFound);
                return;
            }
            setId(foundSuggestion.id);
            authenticateEmployee(foundSuggestion.id, password)
                .then(token => {
                    setToken(token.token);
                    setIsLoggedIn(true);                
                    setNameInput("");
                    setPasswordInput("");
                    setEmployee(token.employee);
                }).catch(err => {
                    console.log(err);
                    setNameError(err.error||err.message||text.loginScreen.unknownError);
                });
            return;
        }
        authenticateEmployee(id, password)
            .then(token => {
                setToken(token.token);
                setIsLoggedIn(true);                
                setNameInput("");
                setPasswordInput("");
                setEmployee(token.employee);
            }).catch(err => {
                console.log(err);
                setNameError(err.error||err.message||text.loginScreen.unknownError);
            });
    }

    const onKeyDown = (e: React.KeyboardEvent):void => {
        if(e.key === "Enter") loginButtonClicked();
    }

    const togglePassword = (e:React.MouseEvent<HTMLInputElement>):void => {
        const checkBoxState = e.currentTarget.checked;
        console.log(checkBoxState);
        setShowPassword(checkBoxState);
    }
    
    return (
        <div className={styles["login-screen"]}>
            <img src={`${process.env.PUBLIC_URL}/assets/images/sabores_logo.png`}
                alt="Sabores Logo"
                id="sabores-main-logo"
                className={styles["sabores-logo"]}>
            </img>
            <div className={styles["input-list"]}>
                <InputWithSuggestionsComponent
                    suggestionsList={suggestionsList}
                    style={styles["login-input"]}
                    input={name}
                    setInput={setNameInput}
                    setId={setId}
                    placeholder={text.loginScreen.employeeNamePlaceHolder}
                    inputRef={userNameInputRef}
                    nextElementRef={userPasswordInputRef}/>
                <InputErrorComponent 
                    isDisplayed={nameError!==""}
                    message={nameError}/>
                <input type={showPassword?"text":"password"}
                    value={password}
                    ref={userPasswordInputRef}
                    onChange={onPasswordInputChange}
                    id="login-screen-password"
                    className={styles["login-input"]}
                    onKeyDown={onKeyDown}
                    placeholder={text.loginScreen.passwordPlaceHolder}
                />
                <InputErrorComponent 
                    isDisplayed={passwordError!==""}
                    message={passwordError}/>
                <div className={styles["show-password-div"]}>
                    <input type="checkbox"
                        onClick={togglePassword}
                        id="toggle-password"
                        />
                    <label htmlFor="toggle-password">{text.loginScreen.showPassword}</label>
                </div>
            </div>
            <ButtonComponent
                onClick={loginButtonClicked}
                name={text.loginScreen.loginButton}
            />
        </div>
    );
}