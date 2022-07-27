import React, { Dispatch, useEffect, useRef, useState } from "react";
import styles from "./../css/idleTimer.module.css";
import { ButtonComponent } from "./ButtonComponent";
import { ExitComponent } from "./ExitComponent";

type Props = {
    isLoggedIn: boolean,
    setIsLoggedIn: Dispatch<boolean>,
    text:any
};

const warningTimeoutSeconds:number = 120;
const logoutTimeoutSeconds:number = 30;


export const IdleTimerComponent:React.FC<Props> = ({isLoggedIn, setIsLoggedIn, text}) => {
    const [isTimeout, setIsTimeout] = useState<boolean>(false);
    const [currentTimer, setCurrentTimer] = useState<ReturnType<typeof setInterval>>();
    const exitSpan = useRef<HTMLSpanElement>(null);
    
    const warningTimer:IdleTimer = new IdleTimer({
        timerName:"warningTimer",
        timeoutSeconds:warningTimeoutSeconds,
        onTimeout: ()=> {
            setIsTimeout(true);
        },
        requireTracker: true
    });

    const logoutTimer:IdleTimer = new IdleTimer({
        timerName:"logoutTimer",
        timeoutSeconds:logoutTimeoutSeconds,
        onTimeout: () => setIsLoggedIn(false),
    });;

    useEffect(()=>{
        if(isTimeout) setCurrentTimer(logoutTimer.startInterval());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTimeout])

    useEffect(()=> {
        if(isLoggedIn) {
            setCurrentTimer(warningTimer.startInterval());
            setIsTimeout(false);
        } else {
            warningTimer.stopTimer(currentTimer!);
            logoutTimer?.stopTimer(currentTimer!);
            setIsTimeout(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn])

    const continueClick = (e:React.MouseEvent):void => {
        logoutTimer.stopTimer(currentTimer!);
        setIsTimeout(false);
        setCurrentTimer(warningTimer.startInterval());
    }
    
    return (
        <>
            {isTimeout?
                <div className={styles["force-logout-shader"]}>
                    <div className={styles["force-logout-window"]}>
                        <ExitComponent onClick={continueClick} ref={exitSpan}/>
                        <h1>{text?.stillThere?text.stillThere:"Are you still there?"}</h1>
                        <div style={{display:"flex"}}>
                            <ButtonComponent
                                name={text?.logout?text.logout:"Logout"}
                                onClick={()=>{setIsLoggedIn(false)}}
                                title="Logout"
                                isNegativeColor={true}
                                />
                            <ButtonComponent
                                name={text?.continue?text.continue:"Continue"}
                                onClick={continueClick}
                                title="Continue"/>
                            
                        </div>
                    </div>
                </div>:
                ""
            }
        </>
    );
}

type IdleTimerConstructorType = {
    timerName:string,
    timeoutSeconds:number,
    onTimeout:()=>void,
    requireTracker?:boolean
}

class IdleTimer {
    constructor( {timerName, timeoutSeconds, onTimeout, requireTracker}:IdleTimerConstructorType) {
        this.timeoutSeconds = timeoutSeconds;
        this.timeLeft = 0;
        this.onTimeout = onTimeout;
        this.timerName = timerName;
        this.eventHandler = this.updateExpiredTime.bind(this);
        this.tracker = requireTracker?new IdleTracker(this.eventHandler):undefined;
        this.startInterval = this.startInterval.bind(this);
        var self = this;
        this.stopTimer = (id)=>{
            clearInterval(id);
            if(self.tracker) self.tracker.disableTracker();
        };
    }
    timerName:string;
    eventHandler;
    timeoutSeconds:number;
    onTimeout:()=>void;
    tracker:IdleTracker | undefined;
    interval!: ReturnType<typeof setInterval>;
    timeLeft: number;
    stopTimer:(id:ReturnType<typeof setInterval>)=>void;
    
    startInterval() {
        clearInterval(this.interval);
        if(this.tracker) this.tracker.enableTracker();
        this.updateExpiredTime();
        this.interval = setInterval(()=> {
            const expiredTime = parseInt(localStorage.getItem(this.timerName) || "0");
            this.timeLeft = expiredTime - Date.now();
            if(this.timeLeft < 0) {
                if(this.onTimeout) this.onTimeout();
                this.stopTimer(this.interval);
            }
        }, 1000);
        return this.interval;
    };
    

    updateExpiredTime() {
        localStorage.setItem(this.timerName, String(Date.now() + (this.timeoutSeconds || 0) * 1000));
    }
}

class IdleTracker {
    constructor(eventHandler:any){
        this.eventHandler = eventHandler;
        this.enableTracker();
        this.disableTracker();
    }
    eventHandler:()=>void;
    enableTracker() {
        window.addEventListener("mousemove", this.eventHandler);
        window.addEventListener("scroll", this.eventHandler);
        window.addEventListener("keydown", this.eventHandler);
    }
    disableTracker() {
        window.removeEventListener("mousemove", this.eventHandler);
        window.removeEventListener("scroll", this.eventHandler);
        window.removeEventListener("keydown", this.eventHandler);
    }

}