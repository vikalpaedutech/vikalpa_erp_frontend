//This is   SliderHook.context.js
//It stores the drop down selected values in context apis. 
//Then those values can be used across the apps for filtering, in forms like areas.

import React, {createContext, useEffect, useState} from "react";

export const SliderContext = createContext();

export const SliderProvidedr = ({children}) => {
    const [sliderContext, setSliderContext] = useState ([]);
    // const [blockContext, setBlockContext] = useState ([]);
    // const [schoolContext, setSchoolContext] = useState ([]);

 

    return (
        <SliderContext.Provider value={{ sliderContext, setSliderContext}}>

            {children}

        </SliderContext.Provider>
    )


};