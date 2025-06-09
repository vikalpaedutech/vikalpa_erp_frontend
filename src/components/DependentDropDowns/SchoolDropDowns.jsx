import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";
import {
  SchoolContext,
} from "../contextAPIs/DependentDropdowns.contextAPI";
import { getSchoolsBySchoolId } from "../../service/DistrictBlockSchool.service";

const SchoolDropDowns = () => {
  const { userData } = useContext(UserContext);
  const { schoolContext, setSchoolContext } = useContext(SchoolContext);

  const [schoolData, setSchoolData] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const queryParams = { schoolId: userData?.[0]?.assignedSchools || [] };
        console.log(queryParams);
        const response = await getSchoolsBySchoolId(queryParams);
        console.log(response.data);
        setSchoolData(response.data);
      } catch (err) {
        console.error("Error fetching schools:", err.message);
      }
    };
    fetchSchools();
  }, [userData]);

  // Convert school data to react-select options
  const schoolOptions = schoolData.map((school) => ({
    value: school.schoolId,
    label: school.schoolName,
    blockId: school.blockId ?? "NA",
    districtId: school.districtId ?? "NA",
  }));

  const handleSchoolChange = (selectedOption) => {
    setSelectedSchool(selectedOption);
    setSchoolContext([selectedOption]);
    console.log(schoolContext)
  };

  return (
    <div className="d-flex gap-3 flex-wrap my-3">
      <div style={{ minWidth: "250px" }}>
        <label>School</label>
        <Select
          options={schoolOptions}
          value={selectedSchool}
          onChange={handleSchoolChange}
          placeholder="Select School"
        />
      </div>
    </div>
  );
};

export default SchoolDropDowns;
