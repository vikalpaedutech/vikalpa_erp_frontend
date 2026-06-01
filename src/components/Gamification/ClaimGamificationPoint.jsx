// import React, { useContext, useEffect, useState } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
// import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
// import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
// import { fetchUserGamificationPoints } from "../../service/Gamification/ClaimGamification.services";
// import {
//   selfAttendancePoint,
//   studentAttendance,
//   pdfUpload,
//   callingAbsentee,
//   disciplinary,
//   ClaimGamificationPoint,
// } from "../../service/Gamification/ClaimGamification.services";

// import {
//   Batch_drop_down,
//   School_drop_down,
// } from "../Utils/DependentDropDowns.v2";

// import Region from "../Students/Region.json";

// export const ClaimGamificationPointS = () => {
//   const { userData } = useContext(UserContext);

//   const { schoolContext, batchContext } =
//     useContext(DistrictBlockSschoolContextV2);

//   const { startDate } = useContext(DateNDateRangeContext);

//   const [totalPoints, setTotalPoints] = useState(0);
//   const [breakdown, setBreakdown] = useState([]);

//   const fetchUserTotalPoints = async () => {
//     const reqBody = {
//       unqObjectId: userData?._id,
//     };

//     try {
//       const response = await fetchUserGamificationPoints(reqBody);

//       setTotalPoints(response?.totalPoints || 0);
//       setBreakdown(response?.pointTypeBreakdown || []);
//       console.log(response.currentDayPoint)
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchUserTotalPoints();
//   }, [userData?._id]);

//   const handleClaim = async (pointType) => {
//     try {
//       if (!schoolContext?.schoolId) {
//         alert("Please select a school");
//         return;
//       }

//       if (!batchContext) {
//         alert("Please select a batch");
//         return;
//       }

//       const selectedSchoolRecord = Region.find(
//         (item) =>
//           String(item.schoolId) === String(schoolContext?.schoolId)
//       );

//       const district_block_schoolsObjectId =
//         selectedSchoolRecord?._id?.$oid || selectedSchoolRecord?._id;

//       if (!district_block_schoolsObjectId) {
//         alert("district_block_schoolsObjectId not found");
//         return;
//       }

//       const payload = {
//         pointType,
//         date:
//           startDate || new Date().toISOString().split("T")[0],
//         batch: batchContext?.batch || batchContext,
//         schoolId: schoolContext?.schoolId,
//         district_block_schoolsObjectId,
//         unqObjectId: userData?._id,
//       };

//       const response = await ClaimGamificationPoint(payload);

//       alert(`${pointType} claimed successfully`);

//       // refresh points after claim
//       fetchUserTotalPoints();
//     } catch (error) {
//       console.log(error);
//       alert(`Failed to claim ${pointType}`);
//     }
//   };

//   const claimCards = [
//     {
//       title: "Self Attendance",
//       pointType: "selfAttendance",
//     },
//     {
//       title: "Student Attendance",
//       pointType: "studentAttendance",
//     },
//     {
//       title: "PDF Upload",
//       pointType: "uploadPdf",
//     },
//     {
//       title: "Calling Absentee",
//       pointType: "callingAbsentee",
//     },
//     {
//       title: "Disciplinary",
//       pointType: "disciplinary",
//     },
//   ];

//   return (
//     <div className="container-fluid mt-3">

//       {/* HEADER CARD */}
//       <div className="card shadow-sm border-0 mb-3">
//         <div className="card-body">

//           <h4 className="mb-2">Claim Gamification Points</h4>

//           <h5>
//             Total Points:{" "}
//             <span
//               style={{
//                 color: totalPoints < 0 ? "red" : "green",
//                 fontWeight: "bold",
//               }}
//             >
//               {totalPoints}
//             </span>
//           </h5>

//           <div className="mb-3 mt-3">
//             <School_drop_down />
//           </div>

//           <div className="mb-3">
//             <Batch_drop_down />
//           </div>

//           <SingleDatePicker />

//         </div>
//       </div>

//       {/* BREAKDOWN TABLE */}
//       {/* <div className="card shadow-sm border-0 mb-4">
//         <div className="card-body">
//           <h5 className="mb-3">Point Breakdown</h5>

//           <table className="table table-bordered">
//             <thead>
//               <tr>
//                 <th>Type</th>
//                 <th>Total Points</th>
//                 <th>Records</th>
//               </tr>
//             </thead>
//             <tbody>
//               {breakdown.map((item) => (
//                 <tr key={item._id}>
//                   <td>{item._id}</td>
//                   <td
//                     style={{
//                       color: item.totalPoints < 0 ? "red" : "green",
//                     }}
//                   >
//                     {item.totalPoints}
//                   </td>
//                   <td>{item.totalRecords}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div> */}

//       {/* CLAIM CARDS */}
//       <div className="row mt-4">
//         {claimCards.map((item) => (
//           <div className="col-md-4 mb-4" key={item.pointType}>
//             <div className="card h-100 shadow-sm border-0">
//               <div className="card-body d-flex flex-column justify-content-between">
//                 <div>
//                   <h5>{item.title}</h5>
//                   <p className="text-muted mb-4">
//                     Claim points for {item.title}
//                   </p>
//                 </div>

//                 <button
//                   className="btn btn-primary w-100"
//                   onClick={() => handleClaim(item.pointType)}
//                 >
//                   Claim Value
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// };







import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";
import { SingleDatePicker } from "../Utils/DateNDateRangePicker";
import { fetchUserGamificationPoints } from "../../service/Gamification/ClaimGamification.services";
import {
  ClaimGamificationPoint,
} from "../../service/Gamification/ClaimGamification.services";

import {
  Batch_drop_down,
  School_drop_down,
} from "../Utils/DependentDropDowns.v2";

import Region from "../Students/Region.json";

export const ClaimGamificationPointS = () => {
  const { userData } = useContext(UserContext);

  const { schoolContext, batchContext } =
    useContext(DistrictBlockSschoolContextV2);

  const { startDate } = useContext(DateNDateRangeContext);

  const [totalPoints, setTotalPoints] = useState(0);
  const [breakdown, setBreakdown] = useState([]);
  const [currentDayPoint, setCurrentDayPoint] = useState({});

  const fetchUserTotalPoints = async () => {
    const reqBody = {
      unqObjectId: userData?._id,
    };

    try {
      const response = await fetchUserGamificationPoints(reqBody);

      setTotalPoints(response?.totalPoints || 0);
      setBreakdown(response?.pointTypeBreakdown || []);
      setCurrentDayPoint(response?.currentDayPoint || {});

      console.log("currentDayPoint =>", response?.currentDayPoint);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserTotalPoints();
  }, [userData?._id]);

  const handleClaim = async (pointType) => {
    try {
      if (!schoolContext?.schoolId) {
        alert("Please select a school");
        return;
      }

      if (!batchContext) {
        alert("Please select a batch");
        return;
      }

      const selectedSchoolRecord = Region.find(
        (item) =>
          String(item.schoolId) === String(schoolContext?.schoolId)
      );

      const district_block_schoolsObjectId =
        selectedSchoolRecord?._id?.$oid || selectedSchoolRecord?._id;

      if (!district_block_schoolsObjectId) {
        alert("district_block_schoolsObjectId not found");
        return;
      }

      const payload = {
        pointType,
        date:
          startDate || new Date().toISOString().split("T")[0],
        batch: batchContext?.batch || batchContext,
        schoolId: schoolContext?.schoolId,
        district_block_schoolsObjectId,
        unqObjectId: userData?._id,
      };

      await ClaimGamificationPoint(payload);

      alert(`${pointType} claimed successfully`);

      fetchUserTotalPoints();
    } catch (error) {
      console.log(error);
      alert(`Failed to claim ${pointType}`);
    }
  };

  const claimCards = [
    { title: "Self Attendance", pointType: "selfAttendance" },
    { title: "Student Attendance", pointType: "studentAttendance" },
    { title: "PDF Upload", pointType: "uploadPdf" },
    { title: "Calling Absentee", pointType: "callingAbsentee" },
    { title: "Disciplinary", pointType: "disciplinary" },
  ];

  return (
    <div className="container-fluid mt-3">

      {/* HEADER */}
      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body">

          <h4 className="mb-2">Claim Gamification Points: (This is in Testing Phase)</h4>

<hr></hr>
<small>
    Notice (English):
All the points and data displayed on this page are currently for testing purposes only. They are not final and may change without prior notice.
<br></br>
सूचना (हिंदी):
इस पेज पर प्रदर्शित सभी पॉइंट्स और डेटा फिलहाल केवल परीक्षण (testing) उद्देश्य के लिए हैं। ये अंतिम नहीं हैं और बिना किसी पूर्व सूचना के बदले जा सकते हैं।
</small>
<hr></hr>
          <h5>
            Total Points:{" "}
            <span
              style={{
                color: totalPoints < 0 ? "red" : "green",
                fontWeight: "bold",
              }}
            >
              {totalPoints}
            </span>
          </h5>

          <div className="mb-3 mt-3">
            <School_drop_down />
          </div>

          <div className="mb-3">
            <Batch_drop_down />
          </div>

          <SingleDatePicker />

        </div>
      </div>

      {/* CLAIM CARDS */}
      <div className="row mt-4">
        {claimCards.map((item) => {
          const isClaimed = !!currentDayPoint?.[item.pointType];

          return (
            <div className="col-md-4 mb-4" key={item.pointType}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column justify-content-between">

                  <div>
                    <h5>{item.title}</h5>
                    <p className="text-muted mb-4">
                      Claim points for {item.title}
                    </p>
                  </div>

                  <button
                    className={`btn w-100 ${
                      isClaimed ? "btn-success" : "btn-primary"
                    }`}
                    disabled={isClaimed}
                    onClick={() => handleClaim(item.pointType)}
                  >
                    {isClaimed ? "Claimed" : "Claim Value"}
                  </button>

                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};