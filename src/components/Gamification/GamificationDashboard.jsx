
// import React, {useState, useEffect} from "react";
// import { getAllUsersWithAccesswithoutPagination } from "../../service/User.service";



// export const GamificationDashboard = ()=>{


// const [uerData, setUserData] = useState([]);


// const fetchUserData = async () =>{


//     try {
//         const response = await getAllUsersWithAccesswithoutPagination()
//         console.log(response.data)
//         setUserData(response.data)
//     } catch (error) {
//         console.log("Error fetching data:::>", error)
//     }
// }

// useEffect(()=>{
// fetchUserData()
// }, [])



// return(
//     <div>
//         <h1>Gamification dashboard!</h1>
//     </div>
// )

// }















// import React, { useEffect, useState } from "react";
// import { getAllUsersWithAccesswithoutPagination } from "../../service/User.service";
// import Container from "react-bootstrap/Container";
// import Table from "react-bootstrap/Table";
// import Badge from "react-bootstrap/Badge";
// import ProgressBar from "react-bootstrap/ProgressBar";
// import Spinner from "react-bootstrap/Spinner";
// import DistrictBlockSchool from "../CentersOrSchools/DistrictBlockSchool.json"

// // Gamification Dashboard (Tabular) using react-bootstrap
// // Shows a responsive table with columns: Rank, Name, Contact, Avg Score
// // Sorted by rank ascending (1 at top)
// // Make sure to `npm install react-bootstrap bootstrap` and import bootstrap CSS in your app root:
// // import 'bootstrap/dist/css/bootstrap.min.css'

// export const GamificationDashboard = () => {

//     console.log(DistrictBlockSchool)

//   const [rawData, setRawData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchUserData = async () => {
//     try {
//       setLoading(true);
//       const response = await getAllUsersWithAccesswithoutPagination();

//       let users = [];
//       if (!response) throw new Error("No response from server");
//       if (Array.isArray(response.data)) users = response.data;
//       else if (response.data && Array.isArray(response.data.data)) users = response.data.data;
//       else if (response.data && Array.isArray(response.data.users)) users = response.data.users;
//       else if (response.data && typeof response.data === "object" && response.data.data === undefined) {
//         users = Array.isArray(response.data) ? response.data : [];
//       }

//       setRawData(users);
//       console.log(response.data)
//     } catch (err) {
//       console.error("Error fetching data:::>", err);
//       setError(err.message || "Failed to fetch");
//       setRawData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const users = (rawData || [])
//     .map((u) => ({
//       _id: u._id || u.id,
//       name: u.name || "-",
//       contact1: u.contact1 || u.contact || "-",
//       avgScore: typeof u.avgScore === "number" ? u.avgScore : parseFloat(u.avgScore) || 0,
//       rank: typeof u.rank === "number" ? u.rank : parseInt(u.rank) || 999999,
//       access: u.access || {},
//       createdAt: u.createdAt,
//     }))
//     .sort((a, b) => a.rank - b.rank);

//   const scoreToPct = (s) => {
//     if (Number.isNaN(s)) return 0;
//     let pct = 0;
//     if (s <= 1) pct = s * 100;
//     else pct = (s / 10) * 100;
//     if (pct < 0) pct = 0;
//     if (pct > 100) pct = 100;
//     return Math.round(pct);
//   };

//   return (
//     <Container className="py-4">
//       <div className="d-flex align-items-center justify-content-between mb-3">
//         <h2 className="m-0">Gamification Dashboard</h2>
//         <div className="text-muted">Total: {users.length}</div>
//       </div>

//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner animation="border" role="status" />
//         </div>
//       ) : error ? (
//         <div className="text-center text-danger py-4">{error}</div>
//       ) : users.length === 0 ? (
//         <div className="text-center text-muted py-4">No users to show.</div>
//       ) : (
//         <div className="table-responsive shadow-sm rounded">
//           <Table hover bordered responsive="sm" className="mb-0">
//             <thead className="table-light">
//               <tr>
//                 <th style={{ width: "80px" }}>Rank</th>
//                 <th>Name</th>
//                 <th style={{ width: "180px" }}>Contact</th>
//                 <th style={{ width: "160px" }}>Avg Score</th>
//                 <th style={{ width: "220px" }}>Visual</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr key={user._id}>
//                   <td className="align-middle">
//                     <Badge bg={user.rank === 1 ? "success" : "secondary"}>#{user.rank === 999999 ? "-" : user.rank}</Badge>
//                   </td>
//                   <td className="align-middle">
//                     <div className="fw-semibold">{user.name}</div>
//                     <div className="text-muted small">Classes: {Array.isArray(user.access.classId) ? user.access.classId.join(", ") : "-"}</div>
//                   </td>
//                   <td className="align-middle">{user.contact1}</td>
//                   <td className="align-middle">{Number(user.avgScore).toFixed(2)}</td>
//                   <td className="align-middle">
//                     <div className="d-flex align-items-center">
//                       <div style={{ flex: 1, marginRight: 12 }}>
//                         <ProgressBar now={scoreToPct(user.avgScore)} label={`${scoreToPct(user.avgScore)}%`} />
//                       </div>
//                       <div style={{ minWidth: 48, textAlign: "right" }} className="text-muted small">
//                         {scoreToPct(user.avgScore)}%
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       )}
//     </Container>
//   );
// }










// import React, { useEffect, useState } from "react";
// import { getAllUsersWithAccesswithoutPagination } from "../../service/User.service";
// import Container from "react-bootstrap/Container";
// import Table from "react-bootstrap/Table";
// import Badge from "react-bootstrap/Badge";
// import ProgressBar from "react-bootstrap/ProgressBar";
// import Spinner from "react-bootstrap/Spinner";
// import DistrictBlockSchool from "../CentersOrSchools/DistrictBlockSchool.json"

// // Gamification Dashboard (Tabular) using react-bootstrap
// // Shows a responsive table with columns: Rank, Name, Contact, Avg Score
// // Sorted by rank ascending (1 at top)
// // Make sure to `npm install react-bootstrap bootstrap` and import bootstrap CSS in your app root:
// // import 'bootstrap/dist/css/bootstrap.min.css'

// export const GamificationDashboard = () => {

//     console.log(DistrictBlockSchool)

//   const [rawData, setRawData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchUserData = async () => {
//     try {
//       setLoading(true);
//       const response = await getAllUsersWithAccesswithoutPagination();

//       let users = [];
//       if (!response) throw new Error("No response from server");
//       if (Array.isArray(response.data)) users = response.data;
//       else if (response.data && Array.isArray(response.data.data)) users = response.data.data;
//       else if (response.data && Array.isArray(response.data.users)) users = response.data.users;
//       else if (response.data && typeof response.data === "object" && response.data.data === undefined) {
//         users = Array.isArray(response.data) ? response.data : [];
//       }

//       setRawData(users);
//       console.log(response.data)
//     } catch (err) {
//       console.error("Error fetching data:::>", err);
//       setError(err.message || "Failed to fetch");
//       setRawData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   // Helper: given a schoolId (string), find matching school object from DistrictBlockSchool
//   const findSchoolInfo = (schoolId) => {
//     if (!schoolId) return null;
//     // DistrictBlockSchool array items look like:
//     // { schoolId, schoolName, schoolCode, blockId, blockName, districtId, districtName }
//     // search by schoolCode OR schoolId to be safe
//     return DistrictBlockSchool.find(
//       (s) => String(s.schoolCode) === String(schoolId) || String(s.schoolId) === String(schoolId)
//     ) || null;
//   };

//   const users = (rawData || [])
//     .map((u) => {
//       // extract the first schoolId from user's access.region structure (if present)
//       let extractedSchoolId = null;
//       try {
//         if (u && u.access && Array.isArray(u.access.region) && u.access.region.length > 0) {
//           const firstRegion = u.access.region[0];
//           if (firstRegion && Array.isArray(firstRegion.blockIds) && firstRegion.blockIds.length > 0) {
//             const firstBlock = firstRegion.blockIds[0];
//             if (firstBlock && Array.isArray(firstBlock.schoolIds) && firstBlock.schoolIds.length > 0) {
//               extractedSchoolId = firstBlock.schoolIds[0].schoolId;
//             }
//           }
//         }
//       } catch (e) {
//         // ignore and leave extractedSchoolId null
//       }

//       const schoolInfo = findSchoolInfo(extractedSchoolId);

//       return {
//         _id: u._id || u.id,
//         name: u.name || "-",
//         contact1: u.contact1 || u.contact || "-",
//         avgScore: typeof u.avgScore === "number" ? u.avgScore : parseFloat(u.avgScore) || 0,
//         rank: typeof u.rank === "number" ? u.rank : parseInt(u.rank) || 999999,
//         access: u.access || {},
//         createdAt: u.createdAt,
//         // added fields:
//         schoolId: extractedSchoolId || null,
//         schoolName: schoolInfo ? schoolInfo.schoolName : "-",
//         districtName: schoolInfo ? schoolInfo.districtName : "-",
//       };
//     })
//     .sort((a, b) => a.rank - b.rank);

//   const scoreToPct = (s) => {
//     if (Number.isNaN(s)) return 0;
//     let pct = 0;
//     if (s <= 1) pct = s * 100;
//     else pct = (s / 10) * 100;
//     if (pct < 0) pct = 0;
//     if (pct > 100) pct = 100;
//     return Math.round(pct);
//   };

//   return (
//     <Container className="py-4">
//       <div className="d-flex align-items-center justify-content-between mb-3">
//         <h2 className="m-0">Gamification Dashboard</h2>
//         <div className="text-muted">Total: {users.length}</div>
//       </div>

//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner animation="border" role="status" />
//         </div>
//       ) : error ? (
//         <div className="text-center text-danger py-4">{error}</div>
//       ) : users.length === 0 ? (
//         <div className="text-center text-muted py-4">No users to show.</div>
//       ) : (
//         <div className="table-responsive shadow-sm rounded">
//           <Table hover bordered responsive="sm" className="mb-0">
//             <thead className="table-light">
//               <tr>
//                 <th style={{ width: "80px" }}>Rank</th>
//                 <th>Name</th>
//                 <th style={{ width: "240px" }}>School (District)</th>
//                 <th style={{ width: "180px" }}>Contact</th>
//                 <th style={{ width: "160px" }}>Avg Score</th>
//                 {/* <th style={{ width: "220px" }}>Visual</th> */}
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr key={user._id}>
//                   <td className="align-middle">
//                     <Badge bg={user.rank === 1 ? "success" : "secondary"}>#{user.rank === 999999 ? "-" : user.rank}</Badge>
//                   </td>
//                   <td className="align-middle">
//                     <div className="fw-semibold">{user.name}</div>
//                     <div className="text-muted small">Classes: {Array.isArray(user.access.classId) ? user.access.classId.join(", ") : "-"}</div>
//                   </td>
//                   <td className="align-middle">
//                     <div className="fw-semibold">{user.schoolName}</div>
//                     <div className="text-muted small">{user.districtName}{user.schoolId ? ` • (${user.schoolId})` : ""}</div>
//                   </td>
//                   <td className="align-middle">{user.contact1}</td>
//                   <td className="align-middle">{Number(user.avgScore).toFixed(2)}</td>
//                   {/* <td className="align-middle">
//                     <div className="d-flex align-items-center">
//                       <div style={{ flex: 1, marginRight: 12 }}>
//                         <ProgressBar now={scoreToPct(user.avgScore)} label={`${scoreToPct(user.avgScore)}%`} />
//                       </div>
//                       <div style={{ minWidth: 48, textAlign: "right" }} className="text-muted small">
//                         {scoreToPct(user.avgScore)}%
//                       </div>
//                     </div>
//                   </td> */}
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       )}
//     </Container>
//   );
// }





import React, { useEffect, useState } from "react";
import { getAllUsersWithAccesswithoutPagination } from "../../service/User.service";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import ProgressBar from "react-bootstrap/ProgressBar";
import Spinner from "react-bootstrap/Spinner";
import DistrictBlockSchool from "../CentersOrSchools/DistrictBlockSchool.json"

// Gamification Dashboard (Tabular) using react-bootstrap
// Shows a responsive table with columns: Rank, Name, Contact, Avg Score
// Sorted by rank ascending (1 at top)
// Make sure to `npm install react-bootstrap bootstrap` and import bootstrap CSS in your app root:
// import 'bootstrap/dist/css/bootstrap.min.css'

export const GamificationDashboard = () => {

    console.log(DistrictBlockSchool)

  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await getAllUsersWithAccesswithoutPagination();

      let users = [];
      if (!response) throw new Error("No response from server");
      if (Array.isArray(response.data)) users = response.data;
      else if (response.data && Array.isArray(response.data.data)) users = response.data.data;
      else if (response.data && Array.isArray(response.data.users)) users = response.data.users;
      else if (response.data && typeof response.data === "object" && response.data.data === undefined) {
        users = Array.isArray(response.data) ? response.data : [];
      }

      setRawData(users);
      console.log(response.data)
    } catch (err) {
      console.error("Error fetching data:::>", err);
      setError(err.message || "Failed to fetch");
      setRawData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Helper: given a schoolId (string), find matching school object from DistrictBlockSchool
  const findSchoolInfo = (schoolId) => {
    if (!schoolId) return null;
    // DistrictBlockSchool array items look like:
    // { schoolId, schoolName, schoolCode, blockId, blockName, districtId, districtName }
    // search by schoolCode OR schoolId to be safe
    return DistrictBlockSchool.find(
      (s) => String(s.schoolCode) === String(schoolId) || String(s.schoolId) === String(schoolId)
    ) || null;
  };

  const users = (rawData || [])
    .map((u) => {
      // extract the first schoolId from user's access.region structure (if present)
      let extractedSchoolId = null;
      try {
        if (u && u.access && Array.isArray(u.access.region) && u.access.region.length > 0) {
          const firstRegion = u.access.region[0];
          if (firstRegion && Array.isArray(firstRegion.blockIds) && firstRegion.blockIds.length > 0) {
            const firstBlock = firstRegion.blockIds[0];
            if (firstBlock && Array.isArray(firstBlock.schoolIds) && firstBlock.schoolIds.length > 0) {
              extractedSchoolId = firstBlock.schoolIds[0].schoolId;
            }
          }
        }
      } catch (e) {
        // ignore and leave extractedSchoolId null
      }

      const schoolInfo = findSchoolInfo(extractedSchoolId);

      return {
        _id: u._id || u.id,
        name: u.name || "-",
        contact1: u.contact1 || u.contact || "-",
        avgScore: typeof u.avgScore === "number" ? u.avgScore : parseFloat(u.avgScore) || 0,
        rank: typeof u.rank === "number" ? u.rank : parseInt(u.rank) || 999999,
        access: u.access || {},
        createdAt: u.createdAt,
        // added fields:
        schoolId: extractedSchoolId || null,
        schoolName: schoolInfo ? schoolInfo.schoolName : "-",
        districtName: schoolInfo ? schoolInfo.districtName : "-",
      };
    })
    .sort((a, b) => {
      // Keep original ascending rank order, BUT treat rank === 0 as "last"
      const ra = (a.rank === 0) ? Number.MAX_SAFE_INTEGER : a.rank;
      const rb = (b.rank === 0) ? Number.MAX_SAFE_INTEGER : b.rank;
      return ra - rb;
    });

  const scoreToPct = (s) => {
    if (Number.isNaN(s)) return 0;
    let pct = 0;
    if (s <= 1) pct = s * 100;
    else pct = (s / 10) * 100;
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;
    return Math.round(pct);
  };

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="m-0">Gamification Dashboard</h2>
        <div className="text-muted">Total: {users.length}</div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : error ? (
        <div className="text-center text-danger py-4">{error}</div>
      ) : users.length === 0 ? (
        <div className="text-center text-muted py-4">No users to show.</div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <Table hover bordered responsive="sm" className="mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "80px" }}>Rank</th>
                <th>Name</th>
                <th style={{ width: "240px" }}>School (District)</th>
                <th style={{ width: "180px" }}>Contact</th>
                <th style={{ width: "160px" }}>Avg Score</th>
                {/* <th style={{ width: "220px" }}>Visual</th> */}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="align-middle">
                    <Badge bg={user.rank === 1 ? "success" : "secondary"}>#{user.rank === 999999 ? "-" : user.rank}</Badge>
                  </td>
                  <td className="align-middle">
                    <div className="fw-semibold">{user.name}</div>
                    <div className="text-muted small">Classes: {Array.isArray(user.access.classId) ? user.access.classId.join(", ") : "-"}</div>
                  </td>
                  <td className="align-middle">
                    <div className="fw-semibold">{user.schoolName}</div>
                    <div className="text-muted small">{user.districtName}{user.schoolId ? ` • (${user.schoolId})` : ""}</div>
                  </td>
                  <td className="align-middle">{user.contact1}</td>
                  <td className="align-middle">{Number(user.avgScore).toFixed(2)}</td>
                  {/* <td className="align-middle">
                    <div className="d-flex align-items-center">
                      <div style={{ flex: 1, marginRight: 12 }}>
                        <ProgressBar now={scoreToPct(user.avgScore)} label={`${scoreToPct(user.avgScore)}%`} />
                      </div>
                      <div style={{ minWidth: 48, textAlign: "right" }} className="text-muted small">
                        {scoreToPct(user.avgScore)}%
                      </div>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
}
