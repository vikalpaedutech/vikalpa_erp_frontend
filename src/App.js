import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import MainLayout from "./pages/UserScreens/MainLayout.jsx";
import { useLocation } from "react-router-dom";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  RouterProvider,
} from "react-router-dom";
//Context api
import {
  DistrictBlockSchoolProvider,
  BlockProvider,
  SchoolProvider,
  ClassOfStudentProvider,
} from "./components/contextAPIs/DependentDropdowns.contextAPI.js";

//UI Components

//Imports of Admin
import AdminPage from "./pages/Admin.page.jsx";
import UpdateStudent from "./components/AcademicsComponents/UpdateStudent.component.jsx";
import { TemplateLanding } from "./pages/ModularPage/AdminPage.jsx";

//Imports of Users.

import { UserSignIn } from "./components/user/UserSignIn.component.jsx";
import { UserProvider } from "./components/contextAPIs/User.context.js";
import UserLoggedIn from "./components/user/UserLoggedIn.component.jsx";
import { CenterCoordinator } from "../src/pages/UserScreens/CC.jsx";
import { UserAttendance } from "./components/user/UserAttendance.jsx";
import { UserAttendanceLogout } from "./components/user/userAttendanceLogout.jsx";

// Imports of Academics
import AttendanceMB from "./components/AcademicsComponents/AttendanceMB.component.jsx";
import { UploadMarks } from "../src/components/AcademicsComponents/UploadMarks.component.jsx";
import { StudentDisciplinaryOrInteraction } from "./components/AcademicsComponents/StudentDisciplinaryOrInteraction.component.jsx";

//Import of bills
import Bills from "./components/Bills/Bills.jsx";
import BillsPending from "./components/Bills/BillsPending.jsx";
import BillsVerification from "./components/Bills/BillsVerification.jsx";
import BillsApproval from "./components/Bills/BillsApproval.jsx";
import UserSignup from "./components/user/UserSignup.component.jsx";

//Importing ACI
import { ACI } from "./pages/UserScreens/ACI.jsx";

//Imports of Centers
import MbCentersDisciplinary from "./components/CentersOrSchools/MbCentersDisciplinary.jsx";
import TestCss from "./components/user/testCss.jsx";

//Attendance pdf
import { AttendancePdf } from "./components/AcademicsComponents/AttendancePdf.component.jsx";
import { DownloadAttendancePdfFormat } from "./components/AcademicsComponents/DownloadAttendancePdfFormat.component.jsx";
import { CenterDisciplinaryData } from "./components/CentersOrSchools/CenterDisciplinaryData.jsx";

import { SliderProvidedr } from "./components/contextAPIs/SliderHook.context.js";

//Academics imports
import { AcademicCoordinator } from "./pages/UserScreens/AcademicCoordinator.jsx";

//Template
import { Template } from "./pages/UserScreens/Template.jsx";
import { TestController } from "./components/AcademicsComponents/ExamOrTestController.jsx";
import { CreateTest_Admin } from "./components/AcademicsComponents/CreateTest_Admin.jsx";
import { CreateEmpAttendanceData } from "./Admin/CreateEmpAttendanceData.jsx";
import { CreateStudentAttendanceData } from "./Admin/CreateStudentAttendanceData.jsx";

import { StudentRelatedCallings } from "./Callings/StudentRelatedCallings.jsx";
import { AbsenteeCalling } from "./Callings/AbsenteeCallings.jsx";
import { CreateUploadAttendancePdf } from "./Admin/CreateUploadAttendancePdf.jsx";
// //Practice
// import { Practice } from './practice/pactice.jsx';
import MainLayoutAdmin from "./pages/UserScreens/MainLayoutPhoneAndPc.jsx";
import MainSubScreen from "./pages/UserScreens/MainSubScreen.jsx";
import { CopyChecking } from "./components/AcademicsComponents/CopyChecking.jsx";
import SchoolConcerns from "./components/Concern/SchoolConcerns.jsx"
import TechConcerns from "./components/Concern/TechConcerns.jsx";
import { UserAttendanceUpdated } from "./components/user/UpdatedUserAttendance.jsx";
import { NewNavbar } from "./components/Navbar/NewNavbar.jsx";
function App() {
  
  return (
    <>
   
      <Router>
        
        <SliderProvidedr>
          <DistrictBlockSchoolProvider>
            <BlockProvider>
              <SchoolProvider>
                <ClassOfStudentProvider>
                  <UserProvider>
                 
                    <Routes>
                      <Route path="/" element={<UserSignIn />} />

                      <Route path="/user-dash" element={<MainLayout />} />
                      <Route path="/app/:app_id" element={<MainSubScreen />} />

                      {/* Acadmecis routes */}
                      <Route path="/mb-attendance" element={<AttendanceMB />} />
                      <Route path="/upload-marks" element={<UploadMarks />} />
                      <Route path="/student-disciplinary-or-interaction" element={<StudentDisciplinaryOrInteraction />}/>
                      <Route path="/copy-checking" element={<CopyChecking />}/>

                      <Route
                        path="/upload-attendance-pdf"
                        element={<AttendancePdf />}
                      />

                      {/* download module */}

                      <Route
                        path="/attendance-pdf-format"
                        element={<DownloadAttendancePdfFormat />}
                      />

                      {/* Bills moudle */}
                      <Route path="/upload-bills" element={<Bills />} />

                      {/* Monitoring module */}
                      <Route
                        path="/center-disciplinary-or-interaction"
                        element={<MbCentersDisciplinary />}
                      />
                      {/* Admin module */}
                      {/* Below will be accessible to admin only */}
                      <Route
                        path="/test-controller"
                        element={<TestController />}
                      />

                      <Route
                        path="/initiate-test"
                        element={<CreateTest_Admin />}
                      />
                      <Route
                        path="/initiate-user-attendance"
                        element={<CreateEmpAttendanceData />}
                      />

                      <Route
                        path="/initiate-student-attendance"
                        element={<CreateStudentAttendanceData />}
                      />

                      {/* calling module */}
                      <Route
                        path="/student-callings"
                        element={<StudentRelatedCallings />}
                      />

                      <Route
                        path="/absentee-calling"
                        element={<AbsenteeCalling />}
                      />

                      <Route
                        path="/initiate-upload-attendance-pdf"
                        element={<CreateUploadAttendancePdf />}
                      />

                      <Route
                        path="/verify-bills"
                        element={<BillsVerification />}
                      />

                      {/* Concerns module */}

                      <Route path="/school-concerns" element = {<SchoolConcerns/>}/>
                       <Route path="/tech-concerns" element = {<TechConcerns/>}/>
                         <Route path="/attendance-user" element = {<UserAttendance/>}/>
                  <Route path="/user-attendance-updated" element = {<UserAttendanceUpdated/>}/>


                    </Routes>
                  </UserProvider>
                </ClassOfStudentProvider>
              </SchoolProvider>
            </BlockProvider>
          </DistrictBlockSchoolProvider>
        </SliderProvidedr>
      </Router>
    </>
  );
}

export default App;
