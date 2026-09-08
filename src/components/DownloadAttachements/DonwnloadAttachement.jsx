
import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../contextAPIs/User.context.js";
import { getAttachementById } from "../../service/DownloadAttachements/DownloadAttachement.js";

import {
  Card,
  ListGroup,
  Spinner,
  Badge,
} from "react-bootstrap";

import {
  FiDownload,
  FiFileText,
  FiExternalLink,
  FiClock,
} from "react-icons/fi";


export const DownloadAttachement = () => {

  const { userData } = useContext(UserContext);

  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);


  // ------------------------------------
  // Fetch attachments
  // ------------------------------------

  const fetchAttachements = async () => {

    if (!userData?._id) return;

    setLoading(true);

    try {

      const reqBody = {
        unqObjectId: userData._id,
      };

      const response = await getAttachementById(reqBody);

      const data = Array.isArray(response?.data)
        ? response.data
        : [];


      // --------------------------------
      // Latest → Oldest
      // --------------------------------

      const sortedAttachments = [...data].sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );


      setAttachments(sortedAttachments);

    } catch (error) {

      console.error(
        "Error fetching attachments:",
        error
      );

      setAttachments([]);

    } finally {

      setLoading(false);

    }

  };


  // ------------------------------------
  // Fetch when user changes
  // ------------------------------------

  useEffect(() => {

    fetchAttachements();

  }, [userData?._id]);


  // ------------------------------------
  // If no attachments → render nothing
  // ------------------------------------

  if (
    !loading &&
    attachments.length === 0
  ) {
    return null;
  }


  return (

    <div className="mt-3 mb-4">

      <Card
        className="shadow-sm border-0"
        style={{
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >


        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <Card.Header
          className="bg-white border-bottom"
          style={{
            padding: "14px 18px",
          }}
        >

          <div
            className="d-flex align-items-center gap-2"
          >

            <FiFileText size={20} />

            <span
              style={{
                fontWeight: "600",
                fontSize: "1rem",
              }}
            >
              Attachments
            </span>


            {!loading && (

              <Badge
                bg="secondary"
                pill
              >
                {attachments.length}
              </Badge>

            )}

          </div>

        </Card.Header>


        {/* ================================= */}
        {/* LOADING */}
        {/* ================================= */}

        {loading && (

          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              padding: "25px",
            }}
          >

            <Spinner
              animation="border"
              size="sm"
              className="me-2"
            />

            <span className="text-muted">
              Loading attachments...
            </span>

          </div>

        )}


        {/* ================================= */}
        {/* ATTACHMENTS */}
        {/* ================================= */}

        {!loading &&
          attachments.length > 0 && (

            <ListGroup variant="flush">

              {attachments.map(
                (attachment) => (

                  <ListGroup.Item
                    key={attachment._id}
                    className="px-3 py-3"
                  >

                    <div
                      className="d-flex align-items-start"
                    >


                      {/* ========================= */}
                      {/* BULLET */}
                      {/* ========================= */}

                      <div
                        className="me-3 mt-2"
                        style={{
                          width: "7px",
                          height: "7px",
                          minWidth: "7px",
                          borderRadius: "50%",
                          backgroundColor:
                            "#6c757d",
                        }}
                      />


                      {/* ========================= */}
                      {/* CONTENT */}
                      {/* ========================= */}

                      <div
                        className="flex-grow-1"
                        style={{
                          minWidth: 0,
                        }}
                      >


                        {/* ========================= */}
                        {/* DESCRIPTION */}
                        {/* ========================= */}

                        {attachment.description && (

                          <div
                            style={{
                              fontSize:
                                "0.95rem",
                              fontWeight: "500",
                              marginBottom:
                                "5px",
                            }}
                          >
                            {
                              attachment.description
                            }
                          </div>

                        )}


                        {/* ========================= */}
                        {/* CREATED DATE */}
                        {/* ========================= */}

                        {attachment.createdAt && (

                          <div
                            className="text-muted"
                            style={{
                              fontSize:
                                "0.78rem",
                              marginBottom:
                                "8px",
                            }}
                          >

                            Added on{" "}

                            {new Date(
                              attachment.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}

                          </div>

                        )}


                        {/* ========================= */}
                        {/* DOWNLOAD */}
                        {/* ========================= */}

                        {attachment.isDownloadAvailable &&
                          attachment.fileUrl && (

                            <a
                              href={
                                attachment.fileUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-2"
                              style={{
                                borderRadius:
                                  "6px",
                              }}
                            >

                              <FiDownload
                                size={15}
                              />

                              Download / Open

                            </a>

                          )}


                        {/* ================================= */}
                        {/* UPDATE / SUBMISSION LINK */}
                        {/* ================================= */}

                        {attachment.anotherUrl && (

                          <div
                            className="mt-3 p-2"
                            style={{
                              background:
                                "#f8f9fa",
                              borderRadius:
                                "8px",
                              border:
                                "1px solid #e9ecef",
                            }}
                          >

                            {/* Secondary description */}

                            {attachment.anotherUrlDescription && (

                              <div
                                className="mb-2"
                                style={{
                                  fontSize:
                                    "0.85rem",
                                  fontWeight:
                                    "500",
                                }}
                              >

                                {
                                  attachment.anotherUrlDescription
                                }

                              </div>

                            )}


                            {/* Update link */}

                            <a
                              href={
                                attachment.anotherUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-2"
                              style={{
                                borderRadius:
                                  "6px",
                              }}
                            >

                              <FiExternalLink
                                size={15}
                              />

                              Update / Submit

                            </a>

                          </div>

                        )}


                        {/* ========================= */}
                        {/* LAST DATE */}
                        {/* ========================= */}

                        {attachment.lastDate && (

                          <div
                            className="mt-2 d-flex align-items-center gap-1"
                            style={{
                              fontSize:
                                "0.78rem",
                              color:
                                "#dc3545",
                            }}
                          >

                            <FiClock
                              size={13}
                            />

                            <span>

                              Last date:{" "}

                              {new Date(
                                attachment.lastDate
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}

                            </span>

                          </div>

                        )}

                      </div>

                    </div>

                  </ListGroup.Item>

                )
              )}

            </ListGroup>

          )}

      </Card>

    </div>

  );

};

