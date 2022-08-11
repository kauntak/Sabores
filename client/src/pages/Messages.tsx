import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import styles from "./../css/messages.module.css";
import { getEmployees, lockMessage, readMessage, unlockMessage } from "../api";
import { LanguageContext } from "../App";
import { IMessage, SuggestionListType } from "../type";
import { CreateMessageComponent } from "../components/CreateMessageComponent";
import { BsFillLockFill, BsFillReplyFill, BsFillUnlockFill } from "react-icons/bs";

type Props = {
    messages: IMessage[],
    setMessages: Dispatch<SetStateAction<IMessage[]>>
}

export const Messages:React.FC<Props> = ({messages, setMessages}) => {
    const [activeMessageId, setActiveMessageId] = useState<string>("");
    const [employeeList, setEmployeeList] = useState<SuggestionListType[]>([]);
    const [replyTo, setReplyTo] = useState<IMessage|null>(null);
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


    const onReplyClick = (e:React.MouseEvent<SVGElement>, message:IMessage) => {
        e.stopPropagation();
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
            <h6>{text.message.messageExplanation}</h6>
            <div className={styles["messageList"]}>
                {
                    messages.length > 0
                    ?messages.map((message, index) => {
                        const from = employeeList.find(employee=> employee.id === message.employee);
                        return (
                            <MessageAccordion
                                key={message._id}
                                messages={messages}
                                setMessages={setMessages}
                                from={from!==undefined?from.name:"---"}
                                index={index}
                                activeId={activeMessageId}
                                setActiveMessageId={setActiveMessageId}
                                onReplyClick={onReplyClick}
                            />
                        )
                    })
                    :<h4>{text.message.noMessages}</h4>
                }
            </div>

        </div>
    );
}

type AccordionProps = {
    messages: IMessage[],
    from: string,
    index: number,
    activeId:string,
    setActiveMessageId:Dispatch<SetStateAction<string>>,
    setMessages: Dispatch<SetStateAction<IMessage[]>>,
    onReplyClick:(e:React.MouseEvent<SVGElement>, message:IMessage) => void
}
const MessageAccordion:React.FC<AccordionProps> = ({messages, from, index, activeId, setActiveMessageId, setMessages, onReplyClick}) => {
    const [isLocking, setIsLocking] = useState<boolean>(false);
    const [message, setMessage] = useState<IMessage>(messages[index]);
    const accordionRef = useRef<HTMLDivElement>(null);
    const INITIAL_MAX_HEIGHT = 1000;
    const maxHeightRef = useRef<number>(INITIAL_MAX_HEIGHT);

    useEffect(()=> {
        setMessage(messages[index]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages[index], index])

    useEffect(()=> {
        if(activeId !== message._id) return;
        if(accordionRef.current && maxHeightRef.current === INITIAL_MAX_HEIGHT)
            maxHeightRef.current = accordionRef.current.offsetHeight;
    }, [activeId])

    const onHeaderClick = (id:string, index:number) => {
        if(id === undefined) return;
        if(id === activeId) {
            setActiveMessageId("")
            return;
        }
        setActiveMessageId(id);

        if( !(message.isRead) ){
            setMessages(oldMessages => {
                const newMessages = [...oldMessages];
                newMessages[index].isRead = true;
                readMessage(id);
                return newMessages;
            });
        }
    }

    const onLockClick = (e:React.MouseEvent<SVGElement>, id:string, index:number) => {
        e.stopPropagation();
        if(id === undefined || isLocking) return;
        setIsLocking(true);
        const isLocked = !message.isLocked;
        if(isLocked){
            lockMessage(id)
            .then(res => {
                setIsLocking(false);
                setMessages(res.messages);
            }).catch(()=> {
                setIsLocking(false);
            });
        } else {
            unlockMessage(id)
            .then(res => {
                setIsLocking(false);
                setMessages(res.messages);
            }).catch(()=> {
                setIsLocking(false);
            })
        }
    }
    return (
        <div className={styles["accordion"]}>
            <div 
                className={
                    `${styles["accordionHeader"]} 
                    ${
                        activeId!==message._id
                        ?message.isRead
                            ?styles["read"]
                            :styles["unread"]
                        :styles["active"]}`
                }
                onClick={(e)=> onHeaderClick(message._id!, index)}
                data-id={"header"}
            >
                <div className={styles["messageInfo"]}>
                    <h5>{from}</h5>
                    <h6>{message.date.toLocaleString(["en-Us"], {year:"numeric", month:"numeric", day:"numeric",hour12: true, hour:"numeric", minute:"2-digit"})}</h6>
                </div>
                <h5 className={styles["subject"]}>{message.subject}</h5>
                {
                    activeId===message._id
                    ?<div className={styles["icons"]}>
                        <BsFillReplyFill
                            onClick={(e)=> onReplyClick(e, message)}
                            className={styles["icon"]}
                        />
                        {
                            message.isLocked
                            ?<BsFillLockFill
                                key={message.isLocked + ""}
                                onClick={(e)=>onLockClick(e, message._id!, index)}
                                className={isLocking?styles["locking"]:styles["icon"]}
                                data-id={"icon"}
                            />
                            :<BsFillUnlockFill
                                key={message.isLocked + ""}
                                onClick={(e)=>onLockClick(e, message._id!, index)}
                                className={isLocking?styles["locking"]:styles["icon"]}
                                data-id={"icon"}
                            />
                        }
                    </div>
                    :<div className={styles["icons"]}>
                        {
                            message.isLocked
                            ?<BsFillLockFill
                                className={styles["icon"]}
                                data-id={"icon"}
                            />
                            :""
                        }
                    </div>
                }
            </div>
            <div
                className={styles["accordionContent"]}
                style={
                    activeId===message._id
                    ?{
                        maxHeight: "500px"
                    }
                    :{
                        maxHeight: "0px"
                    }
                }
                ref={accordionRef}
            >
                <h6>{message.message}</h6>
            </div>
        </div>
    );
}