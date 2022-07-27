import React, {useState, Dispatch, useEffect, useContext} from "react";
import { LanguageContext } from "../App";
import styles from "./../css/setLanguage.module.css";

type Props = {
    setLanguage: Dispatch<string>,
    languages: string[]
};

type languageListType = {
    title:string,
    language:string
}

export const SetLanguageComponent: React.FC<Props> = ({setLanguage, languages}) =>{
    const [languageList, setLanguageList] = useState<languageListType[]>([])
    const text = useContext(LanguageContext);


    const onClick = (e:React.MouseEvent<HTMLAnchorElement>) => {
        const language = e.currentTarget.dataset.language!;
        setLanguage(language);
    }

    useEffect(()=>{
        const fetchLanguageFiles = (fileName:string):Promise<languageListType> => {
            return new Promise(resolve => {
                fetch(`assets/translations/${fileName}.json`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept':'application/json'
                    }
                }).then(res=> {
                    return (res.json());
                }).then(res =>{
                    resolve({
                        title:res.setLanguage.title,
                        language:res.setLanguage.language
                    });
                });
            })
        }
        const fileReadResults = Promise.all(languages.map(fetchLanguageFiles));
        fileReadResults.then(res => {
            setLanguageList([{title:"en", language:"English"}].concat(res));
        });
    }, [languages]);
    


    return (
        <>
            <div className={styles["language-menu"]}>
                <div className={styles[`${text.setLanguage.title}-list`]} id={styles["selected-language"]}>
                    {text.setLanguage.language}
                </div>
                <ul>
                    {languageList.map((language, index) => {
                        return (
                            <li  key={language.title+index}>
                                <a
                                    href="/#"
                                    onClick={onClick}
                                    data-language={language.title}>
                                    {language.language}
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </>
    );
}