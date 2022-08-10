import React, { Dispatch, RefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import styles from "./../css/messages.module.css";
import { createMessage, getEmployees, lockMessage, readMessage, unlockMessage, updateMessage } from "../api";
import { EmployeeContext, LanguageContext } from "../App";
import { ButtonComponent } from "../components/ButtonComponent";
import { InputWithSuggestionsComponent } from "../components/InputWithSuggestionsComponent";
import { LoadingSpinner } from "../components/LoadinSpinnerComponent";
import { IEmployee, IMessage, SuggestionListType } from "../type";
import { CreateMessageComponent } from "../components/CreateMessageComponent";
import { BsFillLockFill, BsFillReplyFill, BsFillUnlockFill } from "react-icons/bs";
import { text } from "@fortawesome/fontawesome-svg-core";

type Props = {
    messages: IMessage[],
    setMessages: Dispatch<SetStateAction<IMessage[]>>
}

export const Messages:React.FC<Props> = ({messages, setMessages}) => {
    const [activeMessageId, setActiveMessageId] = useState<string>("");
    const [employeeList, setEmployeeList] = useState<SuggestionListType[]>([]);
    const [replyTo, setReplyTo] = useState<IMessage|null>(null);
    const refArray = useRef<HTMLLIElement[]>([]);
    const text = useContext(LanguageContext);

    useEffect(()=> {
        getEmployees()
        .then(res => {
            setEmployeeList(res.employees.map(employee => {
                return {
                    name: `${employee.firstName} ${employee.middleName?employee.middleName + " ":""}${employee.lastName}`,
                    id: employee._id!
                };
            }));
        });
    }, []);


    const onHeaderClick = (id:string, index:number) => {
        if(id === undefined) return;
        if(id === activeMessageId) {
            setActiveMessageId("")
            return;
        }
        setActiveMessageId(id);

        if( !(messages[index].isRead) ){
            setMessages(oldMessages => {
                const newMessages = [...oldMessages];
                newMessages[index].isRead = true;
                readMessage(id);
                return newMessages;
            });
        }
    }

    const onLockClick = (id:string, index:number) => {
        if(id === undefined) return;
        setMessages(oldMessages => {
            const newMessages = [...oldMessages];
            const isLocked = !oldMessages[index].isLocked;
            newMessages[index].isLocked = isLocked;
            if(isLocked){
                lockMessage(id);
            } else {
                unlockMessage(id);
            }
            return newMessages;
        });
    }

    const onReplyClick = (message:IMessage) => {
        setReplyTo(message);
    }

    return (
        <div className={styles["messages"]}>
            <CreateMessageComponent
                employeeList={employeeList}
                replyTo={replyTo}
                setReplyTo={setReplyTo}
            />
            <h2>{text.message.messages}</h2>
            <div>
                {messages.map((message, index) => {
                    const from = employeeList.find(employee=> employee.id === message.employee);
                    return (
                        <MessageAccordion
                            message={message}
                            accordionRef={refArray.current[index]}
                            from={from!==undefined?from.name:"---"}
                            index={index}
                            activeId={activeMessageId}
                            onHeaderClick={onHeaderClick}
                            onLockClick={onLockClick}
                            onReplyClick={onReplyClick}
                        />
                    )
                })}
            </div>

        </div>
    );
}

type AccordionProps = {
    message: IMessage,
    accordionRef: HTMLLIElement,
    from: string,
    index: number,
    activeId:string,
    onHeaderClick:(id:string, index:number) => void,
    onLockClick:(id:string, index:number) => void,
    onReplyClick:(message:IMessage) => void
}
const MessageAccordion:React.FC<AccordionProps> = ({message, from, index, activeId, onHeaderClick, onLockClick, onReplyClick}) => {

    return (
        <div className={styles["accordion"]}>
            <div 
                className={
                    `${styles["accordionHeader"]} 
                    ${
                        activeId!==message._id
                        ?message.isRead
                            ?styles["unread"]
                            :""
                        :styles["active"]}`
                }
                onClick={()=> onHeaderClick(message._id!, index)}
            >
                <h5>{from}</h5>
                <h5>{message.subject}</h5>
                <div className={styles["icons"]}>
                    <BsFillReplyFill
                        onClick={()=> onReplyClick(message)}
                    />
                    {
                        message.isLocked
                        ?<BsFillLockFill
                            onClick={()=>onLockClick(message._id!, index)}
                        />
                        :<BsFillUnlockFill
                            onClick={(e)=>onLockClick(message._id!, index)}
                        />
                    }
                </div>
            </div>
            <div className={styles["accordionContent"]}>
                <h6>{message.message}</h6>
            </div>
        </div>
    );
}