// //src/components/DependentDropDowns/DistrictBlockSchoolVersion2.component.jsx


// import React, {useEffect, useState, useContext} from "react";
// import Select from "react-select";
// import { GetDistrictBlockSchoolByParams } from "../../service/DistrictBlockSchool.service";

// import { UserContext } from "../contextAPIs/User.context";

// export const DistrcitBlockSchoolDropDowns = ()=>{


//     const { userData, setUserData } = useContext(UserContext);


// const fetch_district_block_school_data = async ()=> {

//     console.log(userData.userAccess.region)
//     console.log("hello world")
    

// try {

//     const response = await GetDistrictBlockSchoolByParams()
//     console.log(response.data)
// } catch (error) {
//     alert('Error occured')
// }

// }


// useEffect(()=>{
// fetch_district_block_school_data();
// }, [])




//     const options = [
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' }
// ]




// return(
// <Select options={options} />
// )

// }








// // src/components/DependentDropDowns/DistrictBlockSchoolVersion2.component.jsx

// import React, { useEffect, useState, useContext } from "react";
// import Select from "react-select";
// import { GetDistrictBlockSchoolByParams } from "../../service/DistrictBlockSchool.service";
// import { UserContext } from "../contextAPIs/User.context";

// export const DistrcitBlockSchoolDropDowns = () => {
//   const { userData } = useContext(UserContext);

//   const [data, setData] = useState([]); // full district-block-school data
//   const [districtOptions, setDistrictOptions] = useState([]);
//   const [schoolOptions, setSchoolOptions] = useState([]);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedSchool, setSelectedSchool] = useState(null);

//   // Fetch master data
//   const fetchDistrictBlockSchoolData = async () => {
//     try {
//       const response = await GetDistrictBlockSchoolByParams();
//       const allData = response.data;

//       // filter based on logged-in user's region
//       const allowedDistricts = userData?.userAccess?.region || [];

//       // get only allowed district/block/center from allData
//       const filteredData = allData.filter((item) => {
//         return allowedDistricts.some(
//           (d) =>
//             d.districtId === item.districtId &&
//             d.blockIds.some(
//               (b) =>
//                 b.blockId === item.blockId &&
//                 b.schoolIds.some((s) => s.schoolId === item.centerId)
//             )
//         );
//       });

//       setData(filteredData);

//       // prepare district options
//       const districts = [
//         ...new Map(
//           filteredData.map((d) => [d.districtId, { value: d.districtId, label: d.districtName }])
//         ).values(),
//       ];

//       setDistrictOptions(districts);

//       // prepare school options
//       const schools = filteredData.map((s) => ({
//         value: s.centerId,
//         label: s.centerName,
//         districtId: s.districtId,
//       }));
//       setSchoolOptions(schools);
//     } catch (error) {
//       alert("Error occurred while fetching data");
//     }
//   };

//   useEffect(() => {
//     fetchDistrictBlockSchoolData();
//   }, []);

//   // Filter schools when district changes
//   const getSchoolsByDistrict = (districtId) => {
//     return schoolOptions.filter((s) => s.districtId === districtId);
//   };

//   // 🔹 1. District Dropdown (standalone)
//   const DistrictDropdown = () => (
//     <Select
//       options={districtOptions}
//       placeholder="Select District"
//       onChange={(val) => setSelectedDistrict(val)}
//       value={selectedDistrict}
//     />
//   );

//   // 🔹 2. School Dropdown (standalone, not dependent on district)
//   const SchoolDropdown = () => (
//     <Select
//       options={schoolOptions}
//       placeholder="Select School/Center"
//       onChange={(val) => setSelectedSchool(val)}
//       value={selectedSchool}
//     />
//   );

//   // 🔹 3. Dependent Dropdown (District → Schools)
//   const DistrictSchoolDropdown = () => (
//     <div style={{ display: "flex", gap: "1rem" }}>
//       <div style={{ flex: 1 }}>
//         <Select
//           options={districtOptions}
//           placeholder="Select District"
//           onChange={(val) => {
//             setSelectedDistrict(val);
//             setSelectedSchool(null); // reset school on district change
//           }}
//           value={selectedDistrict}
//         />
//       </div>
//       <div style={{ flex: 1 }}>
//         <Select
//           options={selectedDistrict ? getSchoolsByDistrict(selectedDistrict.value) : []}
//           placeholder="Select School/Center"
//           onChange={(val) => setSelectedSchool(val)}
//           value={selectedSchool}
//           isDisabled={!selectedDistrict}
//         />
//       </div>
//     </div>
//   );

//   // DEMO USAGE
//   return (
//     <section className="p-3">
//       <h3>1. District Dropdown</h3>
//       <DistrictDropdown />

//       <h3 className="mt-4">2. School Dropdown</h3>
//       <SchoolDropdown />

//       <h3 className="mt-4">3. District → School Dependent Dropdown</h3>
//       <DistrictSchoolDropdown />
//     </section>
//   );
// };













// src/components/DependentDropDowns/DistrictBlockSchoolVersion2.component.jsx

import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import { GetDistrictBlockSchoolByParams } from "../../service/DistrictBlockSchool.service";
import { UserContext } from "../contextAPIs/User.context";

import {
  DistrictBlockSchoolContext,
  DistrictContext,
  BlockContext,
  SchoolContext,
  ClassContext,
} from "../contextAPIs/DependentDropdowns.contextAPI";


/**
 * Custom hook to fetch and filter District/School data
 * based on logged-in user's allowed region
 */
const useDistrictBlockSchoolData = () => {
  const { userData } = useContext(UserContext);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetDistrictBlockSchoolByParams();
        const allData = response.data;

        const allowedDistricts = userData?.userAccess?.region || [];

        // Filter allowed districts, blocks & schools
        const filteredData = allData.filter((item) =>
          allowedDistricts.some(
            (d) =>
              d.districtId === item.districtId &&
              d.blockIds.some(
                (b) =>
                  b.blockId === item.blockId &&
                  b.schoolIds.some((s) => s.schoolId === item.centerId)
              )
          )
        );

        // Unique districts
        const districts = [
          ...new Map(
            filteredData.map((d) => [
              d.districtId,
              { value: d.districtId, label: d.districtName },
            ])
          ).values(),
        ];
        setDistrictOptions(districts);

        // Schools/centers
        const schools = filteredData.map((s) => ({
          value: s.centerId,
          label: s.centerName,
          districtId: s.districtId,
        }));
        setSchoolOptions(schools);
      } catch (err) {
        console.error("Error fetching district/block/school data:", err);
      }
    };

    fetchData();
  }, [userData]);

  return { districtOptions, schoolOptions };
};

//
// 🔹 1. District Dropdown
//
export const DistrictDropdown = ({ isClearable = true }) => {
  const { districtOptions } = useDistrictBlockSchoolData();

  // Context API
  const { districtContext, setDistrictContext } = useContext(DistrictContext);

  // Handle change
  const handleChange = (selectedOption) => {
    setDistrictContext(selectedOption); // update context
    console.log("Selected District:", selectedOption); // log in console
  };

  return (
    <>
      <label>District</label>
      <Select
        options={districtOptions}
        placeholder="Select District"
        value={districtContext}
        onChange={handleChange}
        isClearable={isClearable}
      />
    </>
  );
};
//
// 🔹 2. School Dropdown (independent, not dependent on district)
//
export const SchoolDropdown = ({ value, onChange, isClearable = true }) => {
  const { schoolOptions } = useDistrictBlockSchoolData();

  // Context API usage
  const { schoolContext, setSchoolContext } = useContext(SchoolContext);

  // Handle change
  const handleChange = (selectedOption) => {
    setSchoolContext(selectedOption); // Update context
    console.log("Selected School:", selectedOption); // Log to console

    if (onChange) {
      onChange(selectedOption); // Trigger parent handler if provided
    }
  };

  return (
    <>
      <label>School</label>
      <Select
        options={schoolOptions}
        placeholder="Select School/Center"
        value={value || schoolContext}
        onChange={handleChange}
        isClearable={isClearable}
      />
    </>
  );
};


// 🔹 3. Dependent Dropdown (District → Schools)
//
export const DistrictSchoolDropdown = () => {
  const { districtOptions, schoolOptions } = useDistrictBlockSchoolData();
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);

  // ⬇️ Contexts
  const { districtContext, setDistrictContext } = useContext(
    DistrictBlockSchoolContext
  );

  const { schoolContext, setSchoolContext } = useContext(SchoolContext);

  const getSchoolsByDistrict = (districtId) =>
    schoolOptions.filter((s) => s.districtId === districtId);

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <div style={{ flex: 1 }}>
        <label>District</label>
        <Select
          options={districtOptions}
          placeholder="Select District"
          value={selectedDistrict}
          onChange={(val) => {
            setSelectedDistrict(val);
            setSelectedSchool(null); // reset school when district changes

            // ⬇️ Update context + log
            setDistrictContext(val ? [val] : []); 
            console.log("Selected District:", val);
          }}
          isClearable
        />
      </div>

      <div style={{ flex: 1 }}>
        <label>School</label>
        <Select
          options={
            selectedDistrict ? getSchoolsByDistrict(selectedDistrict.value) : []
          }
          placeholder="Select School/Center"
          value={selectedSchool}
          onChange={(val) => {
            setSelectedSchool(val);

            // ⬇️ Update context + log
            setSchoolContext(val ? [val] : []); 
            console.log("Selected School:", val);
          }}
          isDisabled={!selectedDistrict}
          isClearable
        />
      </div>
    </div>
  );
};
