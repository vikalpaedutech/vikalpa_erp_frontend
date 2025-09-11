//This is DependentDropdowns.contextAPI.js
//It stores the drop down selected values in context apis. 
//Then those values can be used across the apps for filtering, in forms like areas.

import React, {createContext, useEffect, useState} from "react";

export const DistrictBlockSchoolContext = createContext();

export const DistrictBlockSchoolProvider = ({children}) => {
    const [districtContext, setDistrictContext] = useState ([]);
    // const [blockContext, setBlockContext] = useState ([]);
    // const [schoolContext, setSchoolContext] = useState ([]);

 

    return (
        <DistrictBlockSchoolContext.Provider value={{ districtContext, setDistrictContext}}>

            {children}

        </DistrictBlockSchoolContext.Provider>
    )


};



export const DistrictContext = createContext();

export const DistrictProvider = ({children}) => {
    const [districtContext, setDistrictContext] = useState ([]);
    // const [blockContext, setBlockContext] = useState ([]);
    // const [schoolContext, setSchoolContext] = useState ([]);

 

    return (
        <DistrictContext.Provider value={{ districtContext, setDistrictContext}}>

            {children}

        </DistrictContext.Provider>
    )


};















export const BlockContext = createContext();

export const BlockProvider = ({children}) => {

    const [blockContext, setBlockContext] = useState ([]);

    return (
        <BlockContext.Provider value={{  blockContext, setBlockContext}}>

            {children}

        </BlockContext.Provider>
    )

}



export const SchoolContext = createContext();

export const SchoolProvider = ({children}) => {

    const [schoolContext, setSchoolContext] = useState ([]);

    return (
        <SchoolContext.Provider value={{   schoolContext, setSchoolContext }}>

            {children}

        </SchoolContext.Provider>
    )

}





export const ClassContext = createContext();

export const ClassOfStudentProvider = ({children}) => {

    const [classContext, setClassContext] = useState ([]);

    return (
        <ClassContext.Provider value={{   classContext, setClassContext }}>

            {children}

        </ClassContext.Provider>
    )

}

