// UserContext.js
import React, { createContext, useState, useEffect } from "react";

// Create the context
export const UserContext = createContext();

// Create the provider component
export const UserProvider = ({ children }) => {
    const storedUser = sessionStorage.getItem("userData");
    const [userData, setUserData] = useState(storedUser ? JSON.parse(storedUser) : []);

    useEffect(() => {
        if (userData && Object.keys(userData).length > 0) {
            sessionStorage.setItem("userData", JSON.stringify(userData));
        } else {
            sessionStorage.removeItem("userData"); // ✅ Properly clear storage
        }
    }, [userData]);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};