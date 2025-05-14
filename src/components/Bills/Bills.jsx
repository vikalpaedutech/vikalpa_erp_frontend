//This is /Frontend/src/components/Bills/Bills.jsx

import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { createPost } from "../../service/Bills.services";
import { Container, Row, Table, Col } from "react-bootstrap";
import Select from "react-select";

const Bills = () => {
  const { userData, setUserData } = useContext(UserContext);

  const [formData, setFormData] = useState({
    expenseId: "",
    userId: "",
    role:"",
    purposeOfExpense: "",
    descriptionExpense: "",
    expenseDate: "",
    expenseType: "",
    travelFrom: "",
    travelTo: "",
    travelledDistance: "",
    foodType: "",
    accomodationDate: "",
    stayedForDays: "",
    otherItemName: "",
    otherItemPurchasingPurpose: "",
    otherItemDescription: "",
    expenseAmount: "",
  });

  const [uploadedFile, setUploadedFile] = useState(null);

  console.log("i am user data", userData);

  //Creating down options for react-select
  const purposeOfExpenseOptions = [
    { value: "Office", label: "Office" },
    { value: "BLC", label: "BLC" },
    { value: "Orientation", label: "Orientation" },
    { value: "MB Center Expenses", label: "MB Center Expenses" },
    { value: "Field Visit", label: "Field Visit" },
  ];

  const expenseTypeOptions = [
    { value: "Travel", label: "Travel" },
    { value: "Food", label: "Food" },
    { value: "Accomodation", label: "Accomodation" },
    { value: "Other", label: "Other" },
  ];

  //Hooks for managing Select drop downs
  const [selectedPurposeOfExpense, setSelectedPurposeOfExpense] = useState({});
  const [selectedExpenseType, setSelectedExpenseType] = useState({});
  //__________________________________
// const [dataArray, setDataArray] = useState([])

const [dataArray, setDataArray] = useState([]);
  const handleBillSubmit = async () => {
    const payLoad = {
      expenseId: "111",
      userId: userData?.[0]?.userId ?? "Not-known",
      role:userData?.[0]?.role ?? "Not-known",
      purposeOfExpense: selectedPurposeOfExpense.value || "",
      descriptionExpense: "",
      expenseDate: formData.expenseDate || "",
      expenseType: selectedExpenseType.value,
      travelFrom: formData.travelFrom || "",
      travelTo: formData.travelTo || "",
      travelledDistance: formData.travelledDistance || "",
      foodType: formData.foodType || "",
      accomodationDate: formData.accomodationDate || "",
      stayedForDays: formData.stayedForDays || "",
      otherItemName: formData.otherItemName || "",
      otherItemPurchasingPurpose: formData.otherItemPurchasingPurpose || "",
      otherItemDescription: "",
      expenseAmount: formData.expenseAmount || 0,
    };
    setDataArray(prev => [...prev, payLoad]);
    console.log("i am inside handleClick", [...dataArray, payLoad]);
  
console.log("i am inside handleclick", dataArray)
    const formDataUpdated = new FormData();

    for (const key in payLoad) {
      if (payLoad[key] !== undefined && payLoad[key] !== null) {
        formDataUpdated.append(key, payLoad[key]);
      }
    }

    if (uploadedFile) {
      formDataUpdated.append("file", uploadedFile);
    }


    //Sending data to backend api
    try {
      const response = await createPost(formDataUpdated);
      console.log("Response from server:", response);


      //After submission clearing all the fields

      // setFormData.expenseDate("")
      // setFormData.purposeOfExpense("")
      // setFormData.expenseType("")
      // setFormData.travelFrom("")
      // setFormData.travelTo("")
      // setFormData.travelledDistance("")
      // setFormData.foodType("")
      // setFormData.otherItemDescription("")
      // setFormData.otherItemName("")
      // setFormData.otherItemPurchasingPurpose("")
      // setFormData.accomodationDate("");
      // setFormData.Accomodation("");
      // setFormData.expenseAmount(""); 
      setFormData({})

    } catch (error) {
      console.log("Error occurred while posting bill data", error);
    }

    
  };





//Dynamic html renderiing
  const showHTMLOnSelectedExpenseType = {
    Travel: (
      <>
        <div>
          <br/>
          <label>Travel From</label>
          <br/>
          <input
            type="text"
            name="travelFrom"
            id="travelFrom"
            onChange={(e) =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                travelFrom: e.target.value,
              }))
            }
            placeholder="Enter Travel From"
          />
        </div>
        <div>
        <br/>
          <label>Travel to</label>
          <br/>
          <input
            type="text"
            name="travelTo"
            id="travelTo"
            onChange={(e) =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                travelTo: e.target.value,
              }))
            }
            placeholder="Enter Travel To"
          />
        </div>
        <div>
        <br/>
          <label>Travel Distance in Kms</label>
          <br/>
          <input
            type="number"
            name="travelDistanceInKm"
            id="travelDistanceInKm"
            onChange={(e) =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                travelledDistance: e.target.value,
              }))
            }
            placeholder="Distance In Km."
          />
        </div>
        <div>
        <br/>
          <label>Travel Amount in Inr</label>
          <br/>
          <input
            type="number"
            name="expenseAmount"
            id="expenseAmount"
            onChange={(e) =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                expenseAmount: e.target.value,
              }))
            }
            placeholder="Amount (Inr)"
          />
        </div>
        <div>
        <br/>
          <label>Upload Bill</label>
          <br/>
          <input
            type="file"
            name="file"
            id="file"
            onChange={(e) => {
              setUploadedFile(e.target.files[0]);
            }}
          />
        </div>
        <br/>
        <div>
          <button onClick={handleBillSubmit}>Submit</button>
        </div>
      </>
    ),
  //_______________________________________________________________________________________





    
//___________________________________________________________________________________________
    Food: (
      <>
        <div>
          <label>Food Type</label>
          <br/>
          <Select
  options={[
    { value: "Breakfast", label: "Breakfast" },
    { value: "Lunch", label: "Lunch" },
    { value: "Dinner", label: "Dinner" },
  ]}
  value={
    formData.foodType
      ? { value: formData.foodType, label: formData.foodType }
      : null
  }
  onChange={(selectedOption) =>
    setFormData((prevFormData) => ({
      ...prevFormData,
      foodType: selectedOption?.value || "",
    }))
  }
/>
        </div>

        
        <div>
          <label>Food Amount in Inr</label>
          <br/>
          <input
            type="number"
            name="expenseAmount"
            id="expenseAmount"
            onChange={(e) =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                expenseAmount: e.target.value,
              }))
            }
            placeholder="Amount (Inr)"
          />
        </div>
        <div>
          <label>Upload Bill</label>
          <br/>
          <input
            type="file"
            name="file"
            id="file"
            onChange={(e) => {
              setUploadedFile(e.target.files[0]);
            }}
          />
        </div>
        <br/>
        <div>
          <button onClick={handleBillSubmit}>Submit</button>
        </div>
      </>
    ),
//___________________________________________________________________________






//_________________________________________________________________________________


Accomodation: (
  <>
    <div>
      <label>Accomodation Date</label>
      <br/>
      <input
        type="date"
        name="accomodationDate"
        id="accomodationDate"
        onChange={(e) =>
          setFormData((prevFormData) => ({
            ...prevFormData,
            accomodationDate: e.target.value,
          }))
        }
      />
    </div>
    <div>
      <label>Stayed For (In days)</label>
      <br/>
      <input
        type="number"
        name="stayedFor"
        id="stayedFor"
        onChange={(e) =>
          setFormData((prevFormData) => ({
            ...prevFormData,
            stayedForDays: e.target.value,
          }))
        }
        placeholder="Enter Number Of Days"
      />
    </div>
    
    <div>
      <label>Accomodation Amount in Inr</label>
      <br/>
      <input
        type="number"
        name="expenseAmount"
        id="expenseAmount"
        onChange={(e) =>
          setFormData((prevFormData) => ({
            ...prevFormData,
            expenseAmount: e.target.value,
          }))
        }
        placeholder="Amount (Inr)s"
      />
    </div>
    <div>
      <label>Upload Bill</label>
      <br/>
      <input
        type="file"
        name="file"
        id="file"
        onChange={(e) => {
          setUploadedFile(e.target.files[0]);
        }}
      />
    </div>
    <br/>
    <div>
      <button onClick={handleBillSubmit}>Submit</button>
    </div>
  </>
),
//_______________________________________________________________________________________












Other: (
  <>
    <div>
      <label>Other Item Name</label>
      <br/>
      <input
        type="text"
        name="otherItem"
        id="otherItem"
        onChange={(e) =>
          setFormData((prevFormData) => ({
            ...prevFormData,
            otherItemName: e.target.value,
          }))
        }
        placeholder="Enter Name"
      />
    </div>
    <div>
      <label>Purpose of purchasing this item</label>
      <br/>
      <input
        type="text"
        name="purchasingPurpose"
        id="purchasingPurpose"
        onChange={(e) =>
          setFormData((prevFormData) => ({
            ...prevFormData,
            otherItemPurchasingPurpose: e.target.value,
          }))
        }
        placeholder="Enter Purpose"
      />
    </div>
    
    <div>
      <label>Amount of Item</label>
      <br/>
      <input
        type="number"
        name="expenseAmount"
        id="expenseAmount"
        onChange={(e) =>
          setFormData((prevFormData) => ({
            ...prevFormData,
            expenseAmount: e.target.value,
          }))
        }
        placeholder="Amount (Inr)"
      />
    </div>
    <div>
      <label>Upload Bill</label>
      <br/>
      <input
        type="file"
        name="file"
        id="file"
        onChange={(e) => {
          setUploadedFile(e.target.files[0]);
        }}
      />
    </div>
    <br/>
    <div>
      
      <button onClick={handleBillSubmit}>Submit</button>
    </div>
  </>
),
//_______________________________________________________________________________________











    // Add similar blocks for Food, Accomodation, Other when needed
  };
  //__________________________________________________________________________________

  useEffect(() => {
    console.log("i am formdata travel from", formData.travelFrom);
    console.log("i am formdata travel to", formData.travelTo);
    console.log("i am formdata travelledDistance", formData.travelledDistance);
    console.log("i am formdata expenseAmount", formData.expenseAmount);
    console.log("i am formdata expenseDate", formData.expenseDate);
  });

  return (
    <Container fluid>
      <label>Bill Date</label>
      <br/>
      <input
        type="date"
        onChange={(e) =>
          setFormData((prevFormData) => ({
            ...prevFormData,
            expenseDate: e.target.value,
          }))
        }
      />
      <br />
      <label>Purpose Of Expense</label>
      <Select
        options={purposeOfExpenseOptions}
        value={selectedPurposeOfExpense}
        onChange={(options) => {
          setSelectedPurposeOfExpense(options);
          console.log("selected option is", options);
        }}
        placeholder="Select Purpose of Expense"
      />
      <label>Expense Type</label>
      <Select
        options={expenseTypeOptions}
        value={selectedExpenseType}
        onChange={(options) => {
          setSelectedExpenseType(options);
          console.log("selected expense type is:", options);
        }}
      />
      <div>
  {selectedExpenseType.value && showHTMLOnSelectedExpenseType[selectedExpenseType.value]}
</div>
    </Container>
  );
};

export default Bills;
