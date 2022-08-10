import React, { useRef, useState, useContext, useEffect, Dispatch, SetStateAction } from "react";
import styles from "./../css/createMessage.module.css";
import { createMessage } from "../api";
import { EmployeeContext, LanguageContext } from "../App";
import { IMessage, SuggestionListType } from "../type";
import { ButtonComponent } from "./ButtonComponent";
import { InputWithSuggestionsComponent } from "./InputWithSuggestionsComponent";
import { LoadingSpinner } from "./LoadinSpinnerComponent";

type Props = {
    employeeList:SuggestionListType[],
    replyTo: IMessage|null,
    setReplyTo: Dispatch<SetStateAction<IMessage|null>>
}

export const CreateMessageComponent:React.FC<Props> = ({employeeList, replyTo, setReplyTo}) => {
    const [sendState, setSendState] = useState<""|"creating"|"sending">("");
    const [isSent, setIsSent] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [sendTo, setSendTo] = useState<string>("");
    const [sendToId, setSendToId] = useState<string>("");
    const sendToRef = useRef<HTMLInputElement>(null);
    const [sendToErrorMessage, setSendToErrorMessage] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const subjectRef = useRef<HTMLInputElement>(null);
    const [subjectError, setSubjectError] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const messageRef = useRef<HTMLTextAreaElement>(null);
    const [messageError, setMessageError] = useState<boolean>(false);
    const employee = useContext(EmployeeContext);
    const text = useContext(LanguageContext);

    useEffect(()=>{
        if(replyTo===null) return;
        setSendToId(replyTo.employee);
        const employee = employeeList.find(employee => employee.id === replyTo.employee)!;
        setSendTo(employee.name);
        setSubject("Re:" + replyTo.subject);
        setMessage("\r\n=========================================\r\n" + replyTo.message);
        setSendState("creating");
        setIsSent(false);
        if(messageRef.current === null){
            const timer = setInterval(()=> {
                if(messageRef.current!==null){
                    clearInterval(timer);
                    messageRef.current.focus();
                    messageRef.current.setSelectionRange(0,0);
                }
            }, 5);
        } else {
            messageRef.current.focus();
            messageRef.current.setSelectionRange(0,0);
        }
        setReplyTo(null);
    }, [replyTo])
    

    useEffect(()=> {
        if(sendTo !== "") setSendToErrorMessage("");
    }, [sendTo])

    const onSubjectChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.currentTarget.value;
        if(newValue !== "") {
            setSubjectError(false);
        }
        setSubject(newValue);
    }

    const onSubjectKeyPress = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter") {
            if(messageRef.current !== null) messageRef.current.focus();
        }
    }

    const onMessageChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.currentTarget.value;
        if(newValue!==""){
            setMessageError(false);
        }
        setMessage(newValue);
    }

    const onNewMessageClick =(e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsSent(false);
        setSendState("creating");
        setErrorMessage("");
    }

    const onSendClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        let errorExists = false;
        if(sendTo === ""){
            setSendToErrorMessage(text.createMessage.required.replace("{replace}", text.createMessage.to));
            errorExists = true;
        }
        if(sendToId==="") {
            const foundEmployee = employeeList.find(employee => employee.name === sendTo);
            if(foundEmployee === undefined){
                setSendToErrorMessage(text.createMessage.notFound.replace("{replace}", sendTo));
                errorExists = true;
            } else {
                setSendToId(foundEmployee.id);
            }
        }
        if(subject=== ""){
            setSubjectError(true);
            errorExists = true;
        }
        if(message===""){
            setMessageError(true);
            errorExists = true;
        }
        if(errorExists) return;
        setSendState("sending");
        const newMessage:IMessage = {
            to:sendToId,
            subject,
            message,
            employee:employee._id!,
            date: new Date()
        }
        createMessage(newMessage)
        .then(() => {
            messageSent()
        }).catch(err => {
            console.log(err);
            setErrorMessage(text.createMessage.sendError);
            setSendState("");
        })
    }

    const messageSent = () => {
        setIsSent(true);
        setSendState("");
    }

    return (
        <>  
            <>
                {
                    {
                        "creating":<div className={styles["form"]}>
                            <div className={styles["formInput"]}>
                                <label 
                                    className={styles["label"]}
                                >
                                    {text.createMessage.to}
                                </label>
                                <div className={styles["input-and-error"]}>
                                    
                                        <InputWithSuggestionsComponent 
                                            suggestionsList={employeeList}
                                            style={sendToErrorMessage?styles["error"]:""}
                                            input={sendTo}
                                            setInput={setSendTo}
                                            setId={setSendToId}
                                            inputRef={sendToRef}
                                            nextElementRef={subjectRef}
                                        />
                                    
                                    {sendToErrorMessage!==""?<p>{sendToErrorMessage}</p>:""}
                                </div>
                            </div>
                            <div className={styles["formInput"]}>
                                <label 
                                    className={styles["label"]}
                                    htmlFor="subject"
                                >
                                    {text.createMessage.subject}
                                </label>
                                <div className={styles["input-and-error"]}>
                                    <input 
                                        id="subject"
                                        className={subjectError?styles["error"]:""}
                                        value={subject}
                                        onChange={onSubjectChange}
                                        onKeyDown={onSubjectKeyPress}
                                        ref={subjectRef}
                                    />
                                    {subjectError?<p>{text.createMessage.required.replace("{replace}", text.createMessage.subject)}</p>:""}
                                </div>
                            </div>
                            <div className={styles["formInput"]}>
                                <label
                                    className={styles["label"]}
                                    htmlFor="message"
                                >
                                    {text.createMessage.message}
                                </label>
                                <div className={styles["input-and-error"]}>
                                    <textarea 
                                        id="message"
                                        className={messageError?styles["error"]:""}
                                        value={message}
                                        onChange={onMessageChange}
                                        ref={messageRef}
                                    />
                                    {messageError?<p>{text.createMessage.required.replace("{replace}", text.createMessage.message)}</p>:""}
                                </div>
                            </div>
                        </div>,
                        "sending":<LoadingSpinner />,
                        "":isSent
                            ?<h2>{text.createMessage.sent}</h2>
                            :<h2>{errorMessage}</h2>
                    }[sendState]
                }
            </>
            {
                {
                    "":<ButtonComponent 
                        onClick={onNewMessageClick}
                        name={text.createMessage.newMessage}
                    />,
                    "creating":<ButtonComponent 
                        onClick={onSendClick}
                        name={text.createMessage.send}
                    />,
                    "sending":<ButtonComponent
                        onClick={()=>{}}
                        name={text.createMessage.sending}
                     />
                }[sendState]
            }
        </>
    )
}