//This is District.component.jsx
//It will be used for where i will be needing to filter data on the basis of district only

import React, { useEffect, useState, useContext } from "react";
import { Table, Row, Col, Container } from "react-bootstrap";

import {
  getDistrict,
  getBlock,
  getSchool,
  getBlocksByDistrictId,
  getSchoolsByBlockId,
  getDistrictById,
} from "../../service/DistrictBlockSchool.service";

// Import react-select
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";

//importing contextAPi districtblockschool
import {
  DistrictBlockSchoolContext,
  BlockContext,
  SchoolContext,
  ClassContext,
} from "../contextAPIs/DependentDropdowns.contextAPI";

//Belwo is the district drop down api
export function District() {
  //Context api using

  const { districtContext, setDistrictContext } = useContext(
    DistrictBlockSchoolContext
  ); // Use context
  const { blockContext, setBlockContext } = useContext(BlockContext); // Use context
  const { schoolContext, setSchoolContext } = useContext(SchoolContext); // Use context

  //_______________________________________

  //Hooks to store district data.
  const [districtData, setDistrictData] = useState([]);

  // State to store district data
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const fetchDistrict = async () => {
    try {
      const response = await getDistrict();
      setDistrictData(response.data);
    } catch (error) {
      console.error("Error fetching district data", error.message);
    }
  };

  useEffect(() => {
    fetchDistrict();
  }, []);

  // Convert the district data to the format required by react-select
  const districtOptions = districtData.map((district) => ({
    value: district.districtId,
    label: district.districtName,
  }));

  useEffect(() => {
    // console.log('i am inside useEffect')
    // console.log(selectedDistrict)
    // console.log('i am context')
    // console.log(districtContext)
    // console.log('i am context')
  }, [selectedDistrict]);

  return (
    <div>
      <label>District Drop Down</label>
      {/* Use react-select here */}
      <Select
        isMulti
        id="send-data"
        options={districtOptions}
        value={selectedDistrict} // Set the selected value
        onChange={(selectedOption) => {
          setSelectedDistrict(selectedOption); // Set the selected value
          setDistrictContext(selectedOption);
          console.log("Selected district:", selectedOption);
        }}
        placeholder="Select a district"
      />
    </div>
  );
}

//_________________________________________________________________________________________________________

//Belwo is the block drop down api
export function Block() {
  //Context api using

  const { districtContext, setDistrictContext } = useContext(
    DistrictBlockSchoolContext
  ); // Use context
  // const {blockContext, setBlockContext} = useContext(DistrictBlockSchoolContext); // Use context
  // const {schoolContext, setSchoolContext} = useContext(DistrictBlockSchoolContext); // Use context

  const { blockContext, setBlockContext } = useContext(BlockContext); // Use context
  const { schoolContext, setSchoolContext } = useContext(SchoolContext); // Use context

  //_______________________________________

  //Hooks to store district data.
  const [blockData, setBlockData] = useState([]);

  // State to store district data
  const [selectedBlock, setSelectedBlock] = useState("");

  const fetchBlock = async () => {
    try {
      const response = await getBlock();
      setBlockData(response.data);
    } catch (error) {
      console.error("Error fetching district data", error.message);
    }
  };

  useEffect(() => {
    fetchBlock();
  }, []);

  // Convert the district data to the format required by react-select
  const blockOptions = blockData.map((block) => ({
    value: block.blockId,
    label: block.blockName,
    districtId: block.districtId,
  }));

  useEffect(() => {
    // console.log('i am inside useEffect')
    // console.log(selectedBlock)
    // console.log('i am block context')
    // console.log(blockContext)
    // console.log('i am block context')
  }, [selectedBlock]);

  return (
    <div>
      <label>Block Drop Down</label>
      {/* Use react-select here */}
      <Select
        options={blockOptions}
        value={selectedBlock} // Set the selected value
        onChange={(selectedOption) => {
          setSelectedBlock(selectedOption); // Set the selected value
          //Updating context api
          setBlockContext([selectedOption]);
          console.log("Selected block:", selectedOption);
        }}
        placeholder="Select a district"
      />
    </div>
  );
}

//_______________________________________________________________________

//Belwo is the school drop down api
export function School() {
  //Context api using

  const { districtContext, setDistrictContext } = useContext(
    DistrictBlockSchoolContext
  ); // Use context
  // const {blockContext, setBlockContext} = useContext(DistrictBlockSchoolContext); // Use context
  // const {schoolContext, setSchoolContext} = useContext(DistrictBlockSchoolContext); // Use context

  const { blockContext, setBlockContext } = useContext(BlockContext); // Use context
  const { schoolContext, setSchoolContext } = useContext(SchoolContext); // Use context

  //_______________________________________

  //Hooks to store district data.
  const [schoolData, setSchoolData] = useState([]);

  // State to store district data
  const [selectedSchool, setSelectedSchool] = useState("");

  const fetchBlock = async () => {
    try {
      const response = await getSchool();
      setSchoolData(response.data);
      console.log("school data", response.data)
    } catch (error) {
      console.error("Error fetching district data", error.message);
    }
  };

  useEffect(() => {
    fetchBlock();
  }, []);

  // Convert the district data to the format required by react-select
  const schoolOptions = schoolData.map((school) => ({
    value: school.schoolId,
    label: school.schoolName,
    blockId: school.blockId,
    districtId: school.districtId,
  }));

  useEffect(() => {
    // console.log('i am inside useEffect')
    // console.log(selectedSchool)
    // console.log(`I am context varibale`, schoolContext)
  }, [selectedSchool]);

  return (
    <div>
      <label>School Drop Down</label>
      {/* Use react-select here */}
      <Select
        options={schoolOptions}
        value={selectedSchool} // Set the selected value
        onChange={(selectedOption) => {
          setSelectedSchool(selectedOption); // Set the selected value
          //updating context api;
          setSchoolContext([selectedOption]);
          console.log("Selected block:", selectedOption);
        }}
        placeholder="Select a district"
      />
    </div>
  );
}

//_______________________________________________________________________

//Below api is the District, block, School dependent drop down.

export function DistrictBlockSchool() {
  //Context api using

  const { districtContext, setDistrictContext } = useContext(
    DistrictBlockSchoolContext
  ); // Use context
  // const {blockContext, setBlockContext} = useContext(DistrictBlockSchoolContext); // Use context
  // const {schoolContext, setSchoolContext} = useContext(DistrictBlockSchoolContext); // Use context

  const { blockContext, setBlockContext } = useContext(BlockContext); // Use context
  const { schoolContext, setSchoolContext } = useContext(SchoolContext); // Use context

  //_______________________________________

  //Hooks to store district data.
  const [districtData, setDistrictData] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const fetchDistrict = async () => {
    try {
      const response = await getDistrict();
      setDistrictData(response.data);
    } catch (error) {
      console.error("Error fetching district data", error.message);
    }
  };

  useEffect(() => {
    fetchDistrict();
  }, []);

  // Convert the district data to the format required by react-select
  const districtOptions = districtData.map((district) => ({
    value: district.districtId,
    label: district.districtName,
  }));

  useEffect(() => {
    // console.log('i am inside useEffect')
    // console.log(selectedDistrict)
    // console.log("i am context district", districtContext)
  }, [selectedDistrict]);

  //________________________________________________________________________________________

  //Below code block for dependent block.

  //Hooks to store district data.
  const [blockData, setBlockData] = useState([]);

  // State to store district data
  const [selectedBlock, setSelectedBlock] = useState("");

  const fetchBlock = async (districtData) => {
    console.log(selectedDistrict);

    try {
      const districtIds = selectedDistrict.map((each) => each.value);

      const response = await getBlocksByDistrictId(districtIds);
      setBlockData(response.data);
    } catch (error) {
      console.error("Error fetching district data", error.message);
    }
  };

  useEffect(() => {
    fetchBlock();
  }, [selectedDistrict]);

  // Convert the district data to the format required by react-select
  const blockOptions = blockData.map((block) => ({
    value: block.blockId,
    label: block.blockName,
    districtId: block.districtId,
  }));

  useEffect(() => {
    // console.log(selectedBlock)
    // console.log("i am context block", blockContext)
  }, [selectedBlock]);

  //_____________________________________________________________________________________________________

  // Below blocks handles the school dependently on selected block.

  //Hooks to store district data.
  const [schoolData, setSchoolData] = useState([]);

  // State to store district data
  const [selectedSchool, setSelectedSchool] = useState("");

  const fetchSchool = async () => {
    console.log(selectedBlock.value);
    try {
      const blockId = selectedBlock.map((each) => each.value);

      const response = await getSchoolsByBlockId(blockId);
      setSchoolData(response.data);
    } catch (error) {
      console.error("Error fetching district data", error.message);
    }
  };

  useEffect(() => {
    fetchSchool();
  }, [selectedBlock]);

  // Convert the district data to the format required by react-select
  const schoolOptions = schoolData.map((school) => ({
    value: school.schoolId,
    label: school.schoolName,
    blockId: school.blockId,
    districtId: school.districtId,
  }));

  useEffect(() => {
    //  console.log('i am inside useEffect')
    //  console.log(selectedSchool)
    //  console.log("i am context school", schoolContext)
  }, [selectedSchool]);

  return (
    <div>
      <label>District Drop Down</label>
      {/* Use react-select here */}
      <Select
        isMulti
        options={districtOptions}
        value={selectedDistrict} // Set the selected value
        onChange={(selectedOption) => {
          setSelectedDistrict(selectedOption); // Set the selected value
          setDistrictContext(selectedOption); //Updating context api
          console.log("Selected district:", selectedOption);
        }}
        placeholder="Select a district"
      />

      <label>Block Drop Down</label>
      {/* Use react-select here */}
      <Select
        isMulti
        options={blockOptions}
        value={selectedBlock} // Set the selected value
        onChange={(selectedOption) => {
          setSelectedBlock(selectedOption); // Set the selected value
          setBlockContext(selectedOption); //updating context api
          console.log("Selected block:", selectedOption);
        }}
        placeholder="Select a district"
      />

      <label>School Drop Down</label>
      {/* Use react-select here */}
      <Select
        isMulti
        options={schoolOptions}
        value={selectedSchool} // Set the selected value
        onChange={(selectedOption) => {
          setSelectedSchool(selectedOption); // Set the selected value
          setSchoolContext(selectedOption); //updating context api.
          console.log("Selected block:", selectedOption);
        }}
        placeholder="Select a district"
      />
    </div>
  );
}

//Below api is the District, block, School dependent drop down.

export const DistrictBlockSchoolById = ({
  assignedDistricts,
  blockId,
  schoolId,
}) => {
  const { userData, setUserData } = useContext(UserContext);

  //Props:
  const districtId = assignedDistricts;

  //Context api using

  const { districtContext, setDistrictContext } = useContext(
    DistrictBlockSchoolContext
  ); // Use context
  // const {blockContext, setBlockContext} = useContext(DistrictBlockSchoolContext); // Use context
  // const {schoolContext, setSchoolContext} = useContext(DistrictBlockSchoolContext); // Use context

  const { blockContext, setBlockContext } = useContext(BlockContext); // Use context
  const { schoolContext, setSchoolContext } = useContext(SchoolContext); // Use context

 

  //_______________________________________

  //Hooks to store district data.
  const [districtData, setDistrictData] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const fetchDistrict = async (districtId) => {
    console.log(" i am userrrrrrrrrrr from userrr", userData);

    try {
      const response = await getDistrictById(assignedDistricts);
      setDistrictData(response.data);
    } catch (error) {
      console.error("Error fetching district data", error.message);
    }
  };
  // fetchDistrict(districtId)

  useEffect(() => {
    fetchDistrict();
  }, [assignedDistricts, selectedDistrict]);

  // Convert the district data to the format required by react-select
  const districtOptions = districtData.map((district) => ({
    value: district.districtId,
    label: district.districtName,
  }));

  //________________________________________________________________________________________

  //Below code block for dependent block.

  //Hooks to store district data.
  const [blockData, setBlockData] = useState([]);

  // State to store district data
  const [selectedBlock, setSelectedBlock] = useState("");

  const fetchBlock = async (districtData) => {
    try {
      // const districtIdss = selectedDistrict.map((each)=>each.value)

      // console.log("i am selecteeeeeeeed distriiiiiiiiict",districtIdss)
      const response = await getBlocksByDistrictId([
        Object.values(selectedDistrict)[0],
      ]);
      setBlockData(response.data);
    } catch (error) {
      console.error("Error fetching district data", error.message);
    }
  };

  useEffect(() => {
    fetchBlock();
  }, [selectedDistrict]);

  //Below const filters the only those blocks from blockData array which are assigned to a user under his selected ditrict on frontend.
  //... and populates it in the drop dwon
  const assignedBlocksToUser = blockData.filter((eachBlock) =>
    userData[0].assignedBlocks.includes(eachBlock.blockId)
  );

  // Convert the district data to the format required by react-select
  const blockOptions = assignedBlocksToUser.map((block) => ({
    value: block.blockId,
    label: block.blockName,
    districtId: block.districtId,
  }));

  useEffect(() => {
    // console.log(selectedBlock)
    // console.log("i am context block", blockContext)
  }, [selectedBlock]);

  //_____________________________________________________________________________________________________

  // Below blocks handles the school dependently on selected block.

  //Hooks to store district data.
  const [schoolData, setSchoolData] = useState([]);

  // State to store district data
  const [selectedSchool, setSelectedSchool] = useState("");

  const fetchSchool = async () => {
    console.log(selectedBlock.value);
    try {
      // const blockId = selectedBlock.map((each)=> each.value)
      // console.log(blockId)

      const response = await getSchoolsByBlockId([selectedBlock.value]);
      setSchoolData(response.data);
    } catch (error) {
      console.error("Error fetching district data", error.message);
    }
  };

  useEffect(() => {
    fetchSchool();
  }, [selectedBlock]);

  // Convert the district data to the format required by react-select
  const schoolOptions = schoolData.map((school) => ({
    value: school.schoolId,
    label: school.schoolName,
    blockId: school.blockId,
    districtId: school.districtId,
  }));

  useEffect(() => {
    //  console.log('i am inside useEffect')
    //  console.log(selectedSchool)
    //  console.log("i am context school", schoolContext)
  }, [selectedSchool]);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div>
        <label>District Drop Down</label>

        <Select
          options={districtOptions}
          value={selectedDistrict} // Set the selected value
          onChange={(selectedOption) => {
            setSelectedDistrict(selectedOption); // Set the selected value
            setDistrictContext([selectedOption]); //Updating context api
            console.log("Selected district:", selectedOption);
          }}
          placeholder="Select a district"
        />
      </div>

      <div>
        <label>Block Drop Down</label>

        <Select
          options={blockOptions}
          value={blockContext} // Set the selected value
          onChange={(selectedOption) => {
            setSelectedBlock(selectedOption); // Set the selected value
            setBlockContext([selectedOption]); //updating context api
            console.log("Selected block:", selectedOption);
          }}
          placeholder="Select a district"
        />
      </div>

      <div>
        <label>School Drop Down</label>

        <Select
          options={schoolOptions}
          value={schoolContext} // Set the selected value
          onChange={(selectedOption) => {
            setSelectedSchool(selectedOption); // Set the selected value
            setSchoolContext([selectedOption]); //updating context api.
            console.log("Selected block:", selectedOption);
          }}
          placeholder="Select a district"
        />
      </div>
    </div>
  );
};

//Class Drop Down
export function ClassOfStudent() {
  //Context api using

  const { classContext, setClassContext } = useContext(
    ClassContext
  ); // Use context

  //_______________________________________

  const classData = [
    { value: "9", label: "9" },
    { value: "10", label: "10" },
  ];

  const classOptions = classData.map((cls) => ({
    value: cls.value,
    label: cls.label,
  }));

  return (
    <div style={{ display: "flex" }}>
      <div>
        <label>Select Class</label>

        <Select
          
          id="send-data"
          options={classOptions}
          value={classContext} // Set the selected value
          onChange={(selectedOption) => {
            setClassContext(selectedOption); // Set the selected value direct into context api

            console.log("Selected district:", selectedOption);
          }}
          placeholder="Select Class"
        />
      </div>
    </div>
  );
}

//_________________________________________________________________________________________________________
