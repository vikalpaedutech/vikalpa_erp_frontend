import React, { createContext, useState } from "react";

export const DateNDateRangeContext = createContext();

export const DateNDateRangeContextProvider = ({ children }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDateISOformat: null,
    endDateISOformat: null,
    startDateIST: null,
    endDateIST: null,
    startDateDDMMYYYY: null,
    endDateDDMMYYYY: null,
    startDateYYYYMMDD: null,
    endDateYYYYMMDD: null,
    startDateTimestamp: null,
    endDateTimestamp: null,
  });

  return (
    <DateNDateRangeContext.Provider value={{ 
      startDate, 
      setStartDate,
      endDate, 
      setEndDate,
      dateRange,
      setDateRange
    }}>
      {children}
    </DateNDateRangeContext.Provider>
  );
};