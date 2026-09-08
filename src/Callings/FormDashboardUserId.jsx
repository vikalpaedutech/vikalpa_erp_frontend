// importing packages.
import React, { useState, useEffect, useContext } from "react";
import {
    Container,
    Row,
    Col,
    Form,
    Table,
    Alert,
    Card,
    Spinner,
    Button
} from "react-bootstrap";

import { callingDashboardByUserId } from "../service/CallingServices/Calling.services.js";
import { useNavigate } from "react-router-dom";

// importing context api
import {
    DistrictBlockSchoolContext,
    BlockContext,
    SchoolContext,
    ClassContext
} from "../components/contextAPIs/DependentDropdowns.contextAPI.js";

import Select from "react-select";
import { UserContext } from "../components/contextAPIs/User.context.js";

export const FormDashboardByUserId = () => {

    const navigate = useNavigate();

    // =========================
    // CONTEXT
    // =========================

    const {
        districtContext,
        setDistrictContext
    } = useContext(DistrictBlockSchoolContext);

    const {
        blockContext,
        setBlockContext
    } = useContext(BlockContext);

    const {
        schoolContext,
        setSchoolContext
    } = useContext(SchoolContext);

    const {
        classContext,
        setClassContext
    } = useContext(ClassContext);

    const {
        userData,
        setUserData
    } = useContext(UserContext);


    // =========================
    // STATE
    // =========================

    const [dashboardData, setDashboardData] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    const [selectedObjective, setSelectedObjective] =
        useState(null);

    const [objectiveOptions, setObjectiveOptions] =
        useState([]);


    // =========================
    // FETCH DASHBOARD ON LOAD
    // =========================

    useEffect(() => {

        if (userData?._id) {
            fetchDashboardData();
        }

    }, [userData]);


    // =========================
    // FETCH DASHBOARD DATA
    // =========================

    const fetchDashboardData = async () => {

        if (!userData?._id) {

            setError("User data not available");

            return;
        }

        setLoading(true);
        setError(null);

        try {

            const reqBody = {
                assignedTo: userData._id
            };

            const response =
                await callingDashboardByUserId(reqBody);

            console.log(
                "Dashboard response:",
                response.data
            );


            if (response.data.success) {

                /*
                 * Filter out objectives where
                 * isObjectOfCallingDone is true
                 */

                const filteredObjectives =
                    response.data.data.objectives.filter(
                        objective =>
                            !objective.config
                                ?.isObjectOfCallingDone
                    );


                /*
                 * Update dashboard data
                 */

                const updatedDashboardData = {

                    ...response.data.data,

                    objectives: filteredObjectives
                };


                setDashboardData(
                    updatedDashboardData
                );


                /*
                 * Create options for form filter
                 */

                const options =
                    filteredObjectives.map(
                        obj => ({

                            value: obj.objectiveId,

                            label:
                                obj.objectiveOfCalling,

                            description:
                                obj.descriptionOfCalling
                        })
                    );


                setObjectiveOptions(options);

            } else {

                setError(
                    response.data.message ||
                    "Failed to fetch dashboard data"
                );
            }

        } catch (error) {

            console.error(
                "Error fetching dashboard:",
                error
            );

            setError(
                error.message ||
                "Failed to fetch dashboard data"
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // HANDLE FORM FILTER
    // =========================

    const handleObjectiveFilter = (selected) => {

        setSelectedObjective(selected);
    };


    // =========================
    // GET FILTERED FORMS
    // =========================

    const getFilteredObjectives = () => {

        if (!dashboardData?.objectives) {
            return [];
        }


        if (selectedObjective) {

            return dashboardData.objectives.filter(
                obj =>
                    obj.objectiveId ===
                    selectedObjective.value
            );
        }


        return dashboardData.objectives;
    };


    // =========================
    // NAVIGATE TO FORM
    // =========================

    const handleStartForm = (
        objectiveId,
        objectiveName
    ) => {

        navigate(
            `/form-main`,
            {
                state: {

                    objectiveId:
                        objectiveId,

                    objectiveName:
                        objectiveName
                }
            }
        );
    };


    // =========================
    // RENDER FORMS TABLE
    // =========================

    const renderFormsTable = () => {

        const filteredObjectives =
            getFilteredObjectives();


        if (filteredObjectives.length === 0) {

            return (

                <Alert
                    variant="info"
                    className="text-center"
                >
                    No active forms found
                    {selectedObjective
                        ? " for the selected filter"
                        : ""
                    }
                </Alert>
            );
        }


        return (

            <div className="table-responsive">

                <Table
                    striped
                    bordered
                    hover
                    className="shadow-sm"
                >

                    <thead className="bg-light">

                        <tr>

                            <th
                                style={{
                                    width: "5%"
                                }}
                            >
                                #
                            </th>


                            <th
                                style={{
                                    width: "25%"
                                }}
                            >
                                Form Name
                            </th>


                            <th
                                style={{
                                    width: "55%"
                                }}
                            >
                                Description
                            </th>


                            <th
                                style={{
                                    width: "15%"
                                }}
                                className="text-center"
                            >
                                Action
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {filteredObjectives.map(
                            (objective, index) => (

                                <tr
                                    key={
                                        objective.objectiveId
                                    }
                                >

                                    {/* Number */}

                                    <td>
                                        {index + 1}
                                    </td>


                                    {/* Form Name */}

                                    <td>

                                        <strong>
                                            {
                                                objective.objectiveOfCalling
                                            }
                                        </strong>

                                    </td>


                                    {/* Description */}

                                    <td>

                                        <small className="text-muted">

                                            {
                                                objective.descriptionOfCalling ||
                                                "No description available"
                                            }

                                        </small>

                                    </td>


                                    {/* Action */}

                                    <td className="text-center">

                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() =>
                                                handleStartForm(
                                                    objective.objectiveId,
                                                    objective.objectiveOfCalling
                                                )
                                            }
                                        >
                                            Go
                                        </Button>

                                    </td>

                                </tr>
                            )
                        )}

                    </tbody>

                </Table>

            </div>
        );
    };


    // =========================
    // LOADING STATE
    // =========================

    if (
        loading &&
        !dashboardData
    ) {

        return (

            <Container
                fluid
                className="mt-5 text-center"
            >

                <Spinner
                    animation="border"
                    variant="primary"
                />

                <p className="mt-3">
                    Loading forms...
                </p>

            </Container>
        );
    }


    // =========================
    // ERROR STATE
    // =========================

    if (error) {

        return (

            <Container
                fluid
                className="mt-4"
            >

                <Alert
                    variant="danger"
                    onClose={() =>
                        setError(null)
                    }
                    dismissible
                >

                    <Alert.Heading>
                        Error Loading Forms
                    </Alert.Heading>

                    <p>
                        {error}
                    </p>

                </Alert>


                <Button
                    variant="primary"
                    onClick={
                        fetchDashboardData
                    }
                >
                    Retry
                </Button>

            </Container>
        );
    }


    // =========================
    // MAIN UI
    // =========================

    return (

        <Container
            fluid
            className="mt-4"
        >

            {/* =========================
                PAGE HEADER
            ========================= */}

            <Row>

                <Col>

                    <h4 className="mb-2">
                        TA Confirmation Forms
                    </h4>

                    <p className="text-muted mb-3">
                        Select a form below to complete
                        the required student confirmation.
                    </p>

                    <hr />

                </Col>

            </Row>


            {/* =========================
                FILTER
            ========================= */}

            {dashboardData &&
                dashboardData.objectives.length > 0 && (

                    <Row className="mb-4">

                        <Col md={4}>

                            <Form.Group>

                                <Form.Label>
                                    Filter by Form
                                </Form.Label>

                                <Select
                                    options={
                                        objectiveOptions
                                    }

                                    value={
                                        selectedObjective
                                    }

                                    onChange={
                                        handleObjectiveFilter
                                    }

                                    placeholder="All Forms"

                                    isClearable
                                />

                            </Form.Group>

                        </Col>


                        <Col md={8}>

                            <div className="mt-4">

                                <Button
                                    variant="outline-primary"
                                    onClick={
                                        fetchDashboardData
                                    }
                                    disabled={loading}
                                >

                                    {loading ? (

                                        <Spinner
                                            as="span"
                                            size="sm"
                                            animation="border"
                                        />

                                    ) : (

                                        "Refresh"
                                    )}

                                </Button>


                                <span className="text-muted ms-3">

                                    Last updated:{" "}

                                    {dashboardData &&
                                        dashboardData.summary &&
                                        new Date(
                                            dashboardData
                                                .summary
                                                .fetchedAt
                                        ).toLocaleString()
                                    }

                                </span>

                            </div>

                        </Col>

                    </Row>
                )}


            {/* =========================
                FORMS TABLE
            ========================= */}

            <Row className="mt-3">

                <Col>

                    <h5 className="mb-3">
                        Available TA Confirmation Forms
                    </h5>

                    {renderFormsTable()}

                </Col>

            </Row>

        </Container>
    );
};