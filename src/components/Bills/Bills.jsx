// /Frontend/src/components/Bills/Bills.jsx
import React, { useState, useEffect, useContext } from "react";
import { Container, Button } from "react-bootstrap";
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";
import { createPost } from "../../service/Bills.services";

const purposeOptions = [
  { value: "Office", label: "Office" },
  // { value: "BLC", label: "BLC" },
  { value: "Orientation", label: "Orientation" },
  { value: "MB Center Expenses", label: "MB Center Expenses" },
  { value: "Field Visit", label: "Field Visit" },
];

const expenseOptions = [
  { value: "Travel", label: "Travel" },
  { value: "Food", label: "Food" },
  // { value: "Accomodation", label: "Accomodation" },
  { value: "Stationery", label: "Stationery" },
  { value: "Other", label: "Other" },
];

const initialFormState = {
  expenseId: "",
  userId: "",
  role: "",
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
};

const Bills = () => {
  const { userData } = useContext(UserContext);
  const [formData, setFormData] = useState(initialFormState);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [dataArray, setDataArray] = useState([]);

  useEffect(() => {
    console.log("Current FormData:", formData);
  }, [formData]);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  const isValid = () => {
    return (
      formData.expenseDate &&
      selectedPurpose?.value &&
      selectedExpense?.value &&
      formData.expenseAmount
    );
  };

  const handleBillSubmit = async () => {
    if (!isValid()) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      ...formData,
      unqUserObjectId:userData?._id,
      userId: userData?.userId ?? "Not-known",
      role: userData?.role ?? "Not-known",
      purposeOfExpense: selectedPurpose.value,
      expenseType: selectedExpense.value,
    };

    const updatedFormData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value) updatedFormData.append(key, value);
    });
    if (uploadedFile) updatedFormData.append("file", uploadedFile);

    try {
      const response = await createPost(updatedFormData);
      console.log("Server response:", response);
      setFormData(initialFormState);
      setUploadedFile(null);
      setSelectedPurpose(null);
      setSelectedExpense(null);
      setDataArray((prev) => [...prev, payload]);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const renderExpenseFields = {
    Travel: (
      <>
        <Input label="Travel From" value={formData.travelFrom} onChange={handleInputChange("travelFrom")} />
        <Input label="Travel To" value={formData.travelTo} onChange={handleInputChange("travelTo")} />
        <Input label="Travel Distance (Km)" type="number" value={formData.travelledDistance} onChange={handleInputChange("travelledDistance")} />
        <Input label="Amount (INR)" type="number" value={formData.expenseAmount} onChange={handleInputChange("expenseAmount")} />
        <FileUpload onChange={handleFileChange} />
        <SubmitButton onClick={handleBillSubmit} />
      </>
    ),
    Food: (
      <>
        <Select
          options={[{ value: "Breakfast", label: "Breakfast" }, { value: "Lunch", label: "Lunch" }, { value: "Dinner", label: "Dinner" }]}
          value={formData.foodType ? { value: formData.foodType, label: formData.foodType } : null}
          onChange={(e) => setFormData((prev) => ({ ...prev, foodType: e?.value || "" }))}
        />
        <Input label="Amount (INR)" type="number" value={formData.expenseAmount} onChange={handleInputChange("expenseAmount")} />
        <FileUpload onChange={handleFileChange} />
        <SubmitButton onClick={handleBillSubmit} />
      </>
    ),
    // Accomodation: (
    //   <>
    //     <Input label="Accomodation Date" type="date" value={formData.accomodationDate} onChange={handleInputChange("accomodationDate")} />
    //     <Input label="Stayed For (Days)" type="number" value={formData.stayedForDays} onChange={handleInputChange("stayedForDays")} />
    //     <Input label="Amount (INR)" type="number" value={formData.expenseAmount} onChange={handleInputChange("expenseAmount")} />
    //     <FileUpload onChange={handleFileChange} />
    //     <SubmitButton onClick={handleBillSubmit} />
    //   </>
    // ),
    Other: (
      <>
        <Input label="Item Name" value={formData.otherItemName} onChange={handleInputChange("otherItemName")} />
        <Input label="Purchasing Purpose" value={formData.otherItemPurchasingPurpose} onChange={handleInputChange("otherItemPurchasingPurpose")} />
        <Input label="Amount (INR)" type="number" value={formData.expenseAmount} onChange={handleInputChange("expenseAmount")} />
        <FileUpload onChange={handleFileChange} />
        <SubmitButton onClick={handleBillSubmit} />
      </>
    ),

    Stationery: (
      <>
        <Input label="Name" value={formData.otherItemName} onChange={handleInputChange("otherItemName")} />
        <Input label="Purpose" value={formData.otherItemPurchasingPurpose} onChange={handleInputChange("otherItemPurchasingPurpose")} />
        <Input label="Amount (INR)" type="number" value={formData.expenseAmount} onChange={handleInputChange("expenseAmount")} />
        <FileUpload onChange={handleFileChange} />
        <SubmitButton onClick={handleBillSubmit} />
      </>
    ),
  };

  return (
    <Container fluid>
      <Input label="Bill Date" type="date" value={formData.expenseDate} onChange={handleInputChange("expenseDate")} />
      <label>Purpose Of Expense</label>
      <Select options={purposeOptions} value={selectedPurpose} onChange={setSelectedPurpose} placeholder="Select Purpose" />
      <label>Expense Type</label>
      <Select options={expenseOptions} value={selectedExpense} onChange={setSelectedExpense} placeholder="Select Type" />
      <div>{selectedExpense?.value && renderExpenseFields[selectedExpense.value]}</div>
    </Container>
  );
};

const Input = ({ label, type = "text", value, onChange }) => (
  <div style={{ marginBottom: "10px" }}>
    <label>{label}</label>
    <br />
    <input type={type} value={value} onChange={onChange} />
  </div>
);

const FileUpload = ({ onChange }) => (
  <div>
    <label>Upload Bill</label>
    <br />
    <input type="file" onChange={onChange} />
  </div>
);

const SubmitButton = ({ onClick }) => (
  <div style={{ marginTop: "10px" }}>
    <Button onClick={onClick}>Submit</Button>
  </div>
);

export default Bills;