import React, { useState, useEffect, useContext } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    Alert,
    Badge,
    Spinner
} from "react-bootstrap";

import {
    getCallingsByAssignedTo,
    updateCalling,
    getObjectiveOfCall
} from "../service/CallingServices/Calling.services.js";

// Context
import { UserContext } from "../components/contextAPIs/User.context.js";

import { useLocation } from "react-router-dom";

export const FormMain = () => {

    const location = useLocation();

    // Objective ID is still coming from route state
    const callObjectiveId = location.state?.objectiveId;

    // User Context
    const { userData } = useContext(UserContext);

    // =========================
    // STATE
    // =========================

    const [callingData, setCallingData] = useState([]);
    const [objectiveDetails, setObjectiveDetails] = useState(null);

    const [loading, setLoading] = useState(false);
    const [savingId, setSavingId] = useState(null);

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    /*
     * Each student's TA status is maintained separately.
     *
     * Example:
     * {
     *   "callingId1": "Given",
     *   "callingId2": "Not given"
     * }
     */
    const [taStatus, setTaStatus] = useState({});

    /*
     * Manual comments
     *
     * Example:
     * {
     *   "callingId1": "Student confirmed",
     *   "callingId2": "Parent unavailable"
     * }
     */
    const [manualComments, setManualComments] = useState({});

    /*
     * Description / Notes
     */
    const [descriptions, setDescriptions] = useState({});


    // =========================
    // FETCH OBJECTIVE
    // =========================

    const fetchObjective = async () => {
        try {

            const response = await getObjectiveOfCall();

            if (
                response.data?.success &&
                response.data?.data
            ) {

                const objective = response.data.data.find(
                    (obj) => obj._id === callObjectiveId
                );

                if (objective) {
                    setObjectiveDetails(objective);
                }
            }

        } catch (error) {

            console.error(
                "Error fetching objective:",
                error
            );

            setError(
                "Failed to fetch TA confirmation details."
            );
        }
    };


    // =========================
    // FETCH CALLINGS
    // =========================

    const fetchCallings = async () => {

        if (!userData?._id || !callObjectiveId) {
            return;
        }

        setLoading(true);
        setError(null);

        try {

            const reqBody = {
                assignedTo: userData._id,
                objectiveOfCallId: callObjectiveId
            };

            const response =
                await getCallingsByAssignedTo(reqBody);

            console.log(
                "TA confirmation data:",
                response.data
            );

            if (response.data?.success) {

                const records = response.data.data || [];

                setCallingData(records);

                /*
                 * Initialize frontend values from existing
                 * database values.
                 *
                 * This makes the component work even if
                 * some records were already updated.
                 */
                const statusMap = {};
                const commentMap = {};
                const descriptionMap = {};

                records.forEach((call) => {

                    if (call._id) {

                        statusMap[call._id] =
                            call.callingStatus || "";

                        commentMap[call._id] =
                            call.manualRemark || "";

                        descriptionMap[call._id] =
                            call.callingDescription || "";
                    }
                });

                setTaStatus(statusMap);
                setManualComments(commentMap);
                setDescriptions(descriptionMap);

            } else {

                setError(
                    response.data?.message ||
                    "Failed to fetch records."
                );
            }

        } catch (error) {

            console.error(
                "Error fetching callings:",
                error
            );

            setError(
                "Failed to fetch TA confirmation records."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        fetchObjective();

    }, [callObjectiveId]);


    useEffect(() => {

        if (userData?._id && callObjectiveId) {
            fetchCallings();
        }

    }, [userData?._id, callObjectiveId]);


    // =========================
    // STATUS CHANGE
    // =========================

    const handleStatusChange = (callingId, value) => {

        setTaStatus((prev) => ({
            ...prev,
            [callingId]: value
        }));
    };


    // =========================
    // MANUAL COMMENT CHANGE
    // =========================

    const handleManualCommentChange = (
        callingId,
        value
    ) => {

        setManualComments((prev) => ({
            ...prev,
            [callingId]: value
        }));
    };


    // =========================
    // DESCRIPTION CHANGE
    // =========================

    const handleDescriptionChange = (
        callingId,
        value
    ) => {

        setDescriptions((prev) => ({
            ...prev,
            [callingId]: value
        }));
    };


    // =========================
    // SAVE TA CONFIRMATION
    // =========================

    const handleSave = async (call) => {

        if (!call?._id) {
            return;
        }

        const selectedStatus =
            taStatus[call._id];

        /*
         * TA Status is mandatory
         */
        if (!selectedStatus) {

            setError(
                `Please select TA Status for ${
                    call.studentDetails?.firstName ||
                    call.name ||
                    "this student"
                }.`
            );

            return;
        }

        setSavingId(call._id);
        setError(null);
        setSuccessMessage(null);

        try {

            /*
             * Today's date
             *
             * This is intentionally NOT shown to user.
             */
            const today =
                new Date().toISOString();

            /*
             * IMPORTANT:
             *
             * Existing backend field names are preserved.
             *
             * Only their purpose/value has changed for
             * this TA Confirmation form.
             */
            const updateData = {

                _id: call._id,

                // Existing field name
                // New TA values
                callingStatus: selectedStatus,

                // User should not see remark
                remark: null,

                // User should not see dependent remark
                dependentRemark: null,

                // Existing manual comment field
                manualRemark:
                    manualComments[call._id] || "",

                // Existing field retained
                newUpdatedValue: "",

                // Existing backend field name
                callingDescription:
                    descriptions[call._id] || "",

                // Existing backend field
                // Automatically today's date
                followUpDate: today
            };

            console.log(
                "TA Confirmation Request:",
                updateData
            );

            const response =
                await updateCalling(updateData);

            console.log(
                "TA Confirmation Response:",
                response.data
            );

            if (response.data?.success) {

                setSuccessMessage(
                    "TA confirmation updated successfully."
                );

                /*
                 * Refresh data so the card reflects
                 * the latest backend state.
                 */
                await fetchCallings();

            } else {

                setError(
                    response.data?.message ||
                    "Failed to update TA confirmation."
                );
            }

        } catch (error) {

            console.error(
                "Error updating TA confirmation:",
                error
            );

            setError(
                "Failed to update TA confirmation."
            );

        } finally {

            setSavingId(null);
        }
    };


    // =========================
    // PHONE CALL
    // =========================

    const handlePhoneClick = (phoneNumber) => {

        if (
            phoneNumber &&
            phoneNumber !== "N/A"
        ) {

            window.location.href =
                `tel:${phoneNumber}`;
        }
    };


    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (dateString) => {

        if (!dateString) {
            return null;
        }

        const date = new Date(dateString);

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );
    };


    // =========================
    // STUDENT DETAILS
    // =========================

    const getStudentDetails = (call) => {

        /*
         * MB calling records have studentDetails.
         *
         * Random calling records have their
         * details directly on call object.
         */

        if (call.studentDetails) {

            return {
                name:
                    call.studentDetails.firstName ||
                    call.name ||
                    "No Name",

                fatherName:
                    call.studentDetails.fatherName,

                srn:
                    call.studentDetails.studentSrn,

                className:
                    call.studentDetails.classofStudent,

                district:
                    call.studentDetails.district ||
                    call.district,

                block:
                    call.studentDetails.block ||
                    call.block,

                school:
                    call.studentDetails.school ||
                    call.school,

                personalContact:
                    call.studentDetails.personalContact,

                parentContact:
                    call.studentDetails.ParentContact,

                otherContact:
                    call.studentDetails.otherContact,

                followUpDate:
                    call.studentDetails.followUpDate
            };

        }

        return {

            name:
                call.name ||
                "No Name",

            fatherName:
                call.fatherName,

            srn:
                call.studentSrn,

            className:
                call.classofStudent,

            district:
                call.district,

            block:
                call.block,

            school:
                call.school,

            personalContact:
                call.contact1,

            parentContact:
                call.contact2,

            otherContact:
                call.contact3,

            followUpDate:
                call.followUpDate
        };
    };


    // =========================
    // RENDER CONTACTS
    // =========================

    const renderContacts = (student) => {

        const contacts = [];

        if (student.personalContact) {

            contacts.push({
                number: student.personalContact,
                label: ""
            });
        }

        if (
            student.parentContact &&
            student.parentContact !==
            student.personalContact
        ) {

            contacts.push({
                number: student.parentContact,
                label: ""
            });
        }

        if (
            student.otherContact &&
            student.otherContact !==
            student.personalContact &&
            student.otherContact !==
            student.parentContact
        ) {

            contacts.push({
                number: student.otherContact,
                label: "Other"
            });
        }

        if (contacts.length === 0) {

            return (
                <span className="text-muted">
                    No contact available
                </span>
            );
        }

        return (
            <div className="mt-1">

                {contacts.map(
                    (contact, index) => (

                        <div
                            key={index}
                            className="mb-1"
                        >

                            <Button
                                variant="link"
                                className="p-0 text-primary"
                                onClick={() =>
                                    handlePhoneClick(
                                        contact.number
                                    )
                                }
                                style={{
                                    cursor: "pointer",
                                    textDecoration:
                                        "underline"
                                }}
                            >

                                📞 {contact.number}

                                {contact.label &&
                                    ` (${contact.label})`
                                }

                            </Button>

                        </div>
                    )
                )}

            </div>
        );
    };


    // =========================
    // RENDER STUDENT CARD
    // =========================

    const renderStudentCard = (call) => {

        const student =
            getStudentDetails(call);

        const currentStatus =
            taStatus[call._id] || "";

        const isSaving =
            savingId === call._id;

        return (

            <Card
                className="h-100 shadow-sm"
            >

                {/* ================= HEADER ================= */}

                <Card.Header
                    className="d-flex justify-content-between align-items-center"
                >

                    <Badge bg="dark">
                        TA Confirmation
                    </Badge>

                    <Badge
                        bg={
                            currentStatus === "Given"
                                ? "success"
                                : currentStatus ===
                                  "Not given"
                                ? "danger"
                                : "secondary"
                        }
                    >
                        {currentStatus ||
                            "Pending"}
                    </Badge>

                </Card.Header>


                {/* ================= BODY ================= */}

                <Card.Body>

                    {/* Student Name */}

                    <Card.Title className="mb-3">

                        {student.name}

                    </Card.Title>


                    {/* Father */}

                    {student.fatherName && (

                        <div className="mb-2">

                            <strong>
                                Father's Name:
                            </strong>{" "}

                            {student.fatherName}

                        </div>
                    )}


                    {/* SRN */}

                    {student.srn && (

                        <div className="mb-2">

                            <strong>
                                Student SRN:
                            </strong>{" "}

                            {student.srn}

                        </div>
                    )}


                    {/* Class */}

                    {student.className && (

                        <div className="mb-2">

                            <strong>
                                Class:
                            </strong>{" "}

                            {student.className}

                        </div>
                    )}


                    {/* District */}

                    {student.district && (

                        <div className="mb-2">

                            <strong>
                                District:
                            </strong>{" "}

                            {student.district}

                        </div>
                    )}


                    {/* Block */}

                    {student.block && (

                        <div className="mb-2">

                            <strong>
                                Block:
                            </strong>{" "}

                            {student.block}

                        </div>
                    )}


                    {/* School */}

                    {student.school && (

                        <div className="mb-2">

                            <strong>
                                School:
                            </strong>{" "}

                            {student.school}

                        </div>
                    )}


                    {/* Contacts */}

                    <div className="mb-3">

                        <strong>
                            Contact Numbers:
                        </strong>

                        {renderContacts(student)}

                    </div>


                    {/* Student Follow Up Date */}

                    {student.followUpDate && (

                        <div className="mb-3 text-danger">

                            <strong>
                                ⚠️ Student Follow Up Date:
                            </strong>{" "}

                            {formatDate(
                                student.followUpDate
                            )}

                        </div>
                    )}


                    {/* ================= OBJECTIVE DESCRIPTION ================= */}

                    {objectiveDetails?.descriptionOfCalling && (

                        <div className="mb-3">

                            <div
                                className="
                                    border-start
                                    border-primary
                                    border-3
                                    ps-3
                                    bg-light
                                    p-2
                                    rounded
                                "
                            >

                                <strong className="text-primary">

                                    📋 Description:

                                </strong>

                                <p className="mb-0 mt-1 small text-muted">

                                    {
                                        objectiveDetails.descriptionOfCalling
                                    }

                                </p>

                            </div>

                        </div>
                    )}


                    <hr />


                    {/* ================= TA STATUS ================= */}

                    <Form.Group className="mb-3">

                        <Form.Label>
                            <strong>
                                TA Status
                            </strong>
                        </Form.Label>

                        <Form.Select
                            value={currentStatus}
                            onChange={(e) =>
                                handleStatusChange(
                                    call._id,
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                Select TA Status
                            </option>

                            <option value="Given">
                                Given
                            </option>

                            <option value="Not given">
                                Not given
                            </option>

                        </Form.Select>

                    </Form.Group>


                    {/* ================= MANUAL COMMENT ================= */}

                    <Form.Group className="mb-3">

                        <Form.Label>
                            Manual Comment
                        </Form.Label>

                        <Form.Control
                            as="textarea"
                            rows={2}
                            value={
                                manualComments[
                                    call._id
                                ] || ""
                            }
                            onChange={(e) =>
                                handleManualCommentChange(
                                    call._id,
                                    e.target.value
                                )
                            }
                            placeholder="Enter manual comment..."
                        />

                    </Form.Group>


                    {/* ================= DESCRIPTION / NOTES ================= */}

                    <Form.Group className="mb-3">

                        <Form.Label>
                            Description / Notes
                        </Form.Label>

                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={
                                descriptions[
                                    call._id
                                ] || ""
                            }
                            onChange={(e) =>
                                handleDescriptionChange(
                                    call._id,
                                    e.target.value
                                )
                            }
                            placeholder="Enter any additional details..."
                        />

                    </Form.Group>

                </Card.Body>


                {/* ================= FOOTER ================= */}

                <Card.Footer>

                    <Button
                        variant="primary"
                        className="w-100"
                        onClick={() =>
                            handleSave(call)
                        }
                        disabled={
                            isSaving ||
                            !currentStatus
                        }
                    >

                        {isSaving ? (

                            <>
                                <Spinner
                                    size="sm"
                                    animation="border"
                                    className="me-2"
                                />

                                Saving...

                            </>

                        ) : (

                            "Save TA Confirmation"

                        )}

                    </Button>

                </Card.Footer>

            </Card>
        );
    };


    // =========================
    // MAIN UI
    // =========================

    return (

        <Container
            fluid
            className="mt-4"
        >

            {/* ================= TITLE ================= */}

            <Row>

                <Col>

                    <h2 className="mb-3">
                        TA Confirmation Form
                    </h2>

                    <hr />

                </Col>

            </Row>


            {/* ================= SUCCESS ================= */}

            {successMessage && (

                <Alert
                    variant="success"
                    dismissible
                    onClose={() =>
                        setSuccessMessage(null)
                    }
                >
                    {successMessage}
                </Alert>

            )}


            {/* ================= ERROR ================= */}

            {error && (

                <Alert
                    variant="danger"
                    dismissible
                    onClose={() =>
                        setError(null)
                    }
                >
                    {error}
                </Alert>

            )}


            {/* ================= OBJECTIVE DESCRIPTION ================= */}

            {objectiveDetails?.descriptionOfCalling && (

                <Alert
                    variant="info"
                    className="mb-4"
                >

                    <strong>
                        📋 Instructions:
                    </strong>

                    <div className="mt-1">

                        {
                            objectiveDetails.descriptionOfCalling
                        }

                    </div>

                </Alert>

            )}


            {/* ================= LOADING ================= */}

            {loading && (

                <Row>

                    <Col className="text-center py-4">

                        <Spinner
                            animation="border"
                        />

                        <div className="mt-2">
                            Loading students...
                        </div>

                    </Col>

                </Row>

            )}


            {/* ================= STUDENT CARDS ================= */}

            {!loading && (

                <Row>

                    {callingData.length > 0 ? (

                        callingData.map(
                            (call) => (

                                <Col
                                    md={6}
                                    lg={4}
                                    key={call._id}
                                    className="mb-4"
                                >

                                    {renderStudentCard(
                                        call
                                    )}

                                </Col>

                            )
                        )

                    ) : (

                        <Col>

                            <Alert variant="info">

                                No students found for
                                TA confirmation.

                            </Alert>

                        </Col>

                    )}

                </Row>

            )}

        </Container>
    );
};