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
  DistrictProvider,
} from "./components/contextAPIs/DependentDropdowns.contextAPI.js";

//UI Components

//Imports of Admin

import UpdateStudent from "./components/AcademicsComponents/UpdateStudent.component.jsx";
import { TemplateLanding } from "./pages/ModularPage/AdminPage.jsx";

//Imports of Users.

import { UserSignIn } from "./components/user/UserSignIn.component.jsx";
import { UserProvider } from "./components/contextAPIs/User.context.js";
import UserLoggedIn from "./components/user/UserLoggedIn.component.jsx";

import { UserAttendance } from "./components/user/UserAttendance.jsx";
import { UserAttendanceLogout } from "./components/user/userAttendanceLogout.jsx";

// Imports of Academics
import AttendanceMB from "./components/AcademicsComponents/AttendanceMB.component.jsx";
import { UploadMarks } from "../src/components/AcademicsComponents/UploadMarks.component.jsx";
import { StudentDisciplinaryOrInteraction } from "./components/AcademicsComponents/StudentDisciplinaryOrInteraction.component.jsx";
import { ManualAttendance } from "./components/AcademicsComponents/ManualAttendance.jsx";

//Import of bills
import Bills from "./components/Bills/Bills.jsx";
import BillsPending from "./components/Bills/BillsPending.jsx";
import BillsVerification from "./components/Bills/BillsVerification.jsx";
import BillsApproval from "./components/Bills/BillsApproval.jsx";
import UserSignup from "./components/user/UserSignup.component.jsx";



//Imports of Centers
import MbCentersDisciplinary from "./components/CentersOrSchools/MbCentersDisciplinary.jsx";
import TestCss from "./components/user/testCss.jsx";

//Attendance pdf
import { AttendancePdf } from "./components/AcademicsComponents/AttendancePdf.component.jsx";
import { DownloadAttendancePdfFormat } from "./components/AcademicsComponents/DownloadAttendancePdfFormat.component.jsx";
import { CenterDisciplinaryData } from "./components/CentersOrSchools/CenterDisciplinaryData.jsx";

import { SliderProvidedr } from "./components/contextAPIs/SliderHook.context.js";


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

import { CopyChecking } from "./components/AcademicsComponents/CopyChecking.jsx";
import SchoolConcernsForm from "./components/Concern/SchoolConcernsForm.jsx"
import TechConcerns from "./components/Concern/TechConcerns.jsx";
import { UserAttendanceUpdated } from "./components/user/UpdatedUserAttendance.jsx";
import { NewNavbar } from "./components/Navbar/NewNavbar.jsx";
import { AbsentCalling } from "./Callings/AbsentCalling.jsx";
import LayoutWithNewNavbar from "./components/Navbar/LayoutWithNewNavbar.jsx";
import MainLayoutAciLevel from "./pages/UserScreens/MainLayoutAciLevel.jsx";
import { TechConcernsResolution } from "./components/Concern/TechConcernsResolution.jsx";
import { TechConcernsStatus } from "./components/Concern/TechConcernsStatus.jsx";
import SchoolConcerns from "./components/Concern/SchoolConcerns.jsx";
import BillsPage from "./components/Bills/BillsPage.jsx";
import BillsVerificationPage from "./components/Bills/BillsVerificationPage.jsx";
import {IndividualConcernsForm } from "./components/Concern/IndividualConcernsForm.jsx";
import { IndividualConcerns } from "./components/Concern/IndividualConcerns.jsx";
import { IndividualLeaveRequests } from "./components/Concern/IndividualLeaveRequests.jsx";
import { IndividualConcenrsResolution } from "./components/Concern/IndividualConcernsResolutions.jsx";
import { UserAttendanceACI } from "./components/user/UserAttendanceACI.jsx";
import SchoolConcernsRequest from "./components/Concern/SchoolConcernsRequest.jsx";
import { ForgotPassword } from "./components/user/ForgotPassword.jsx";
import MainLayoutManagerLevel from "./pages/UserScreens/MainLayoutManager.jsx";
import OfficeCommunityTeam from "./pages/UserScreens/OfficeCommunityTeam.jsx";
import { StudentAttendanceDashBoard } from "./components/DashBoard/AttendanceDashBoard.jsx";
import { StudentCallingDashBoard } from "./components/DashBoard/CallingDashboards.component.jsx";
import { AttendancePdfCount } from "./components/DashBoard/AttendancePdfCount.component.jsx";
import { UserAttendanceDash } from "./components/user/UserAttendanceDashboard.jsx";
import { UserProfile } from "./components/user/UserProfile.jsx";
import AdminLayout from "./pages/UserScreens/AdminMainLayout.jsx";
import TechConcernsLayout from "./pages/UserScreens/TechConcernsLayout.jsx";
import { StudentDisciplinaryDashboard } from "./components/DashBoard/StudentDisciplinaryDashboard.jsx";
import MainLayoutOfficeLevel from "./pages/UserScreens/MainLayoutOffice.jsx";
import { IndividualConcernsRequest } from "./components/Concern/IndividualConcernsRequest.jsx";
import { BillDashboard } from "./components/Bills/BillDashboard.jsx";
import { GamificationDisciplinary } from "./components/AcademicsComponents/GamificationDisciplinary.compoent.jsx";
import { S100Attendances } from "./components/AcademicsComponents/S100Attendances.component.jsx";

import { CreateUser } from "./Admin/CreateUser.component.jsx";
import { UpdateUser } from "./Admin/UpdateUser.component.jsx";
import { MainBillPage } from "./components/Bills/MainBillPage.jsx";
import VerifiedAndRejectedBills from "./components/Bills/VerifiedAndRejectedBills.jsx";
import { UserMainLayout } from "./pages/UserScreens/UsersMainLayout.jsx";
import { Gamification } from "./components/Gamification/Gamification.jsx";
function App() {
  
  return (
    <>
   
      <Router>
        
        <SliderProvidedr>
          <DistrictBlockSchoolProvider>
            <DistrictProvider>
            <BlockProvider>
              <SchoolProvider>
                <ClassOfStudentProvider>
                  <UserProvider>
                 
                    <Routes>
                      <Route path="/" element={<UserSignIn />} />
                      
                      <Route path="/forgot-password" element = {<ForgotPassword/>}/>
                      
                      <Route path="/user-signup" element = {<UserSignup/>}/>

                      <Route element = {<LayoutWithNewNavbar/>}> 
                      
                      <Route path="/user-dash" element={<MainLayout />} />
                      
                      <Route path="/l2-user-dash" element = {<MainLayoutAciLevel/>}/>  
                      
                      <Route path="/l3-user-dash" element = {<MainLayoutManagerLevel/>}/>  
                      
                      {/* <Route path="/l0-user-dash" element = {<OfficeCommunityTeam/>}/>                     */}

                      <Route path="/l0-user-dash" element={<MainLayoutOfficeLevel/>}/>

                      <Route path="/tech-dash" element = {<TechConcernsLayout/>}/>

                      <Route path="/user-profile" element = {<UserProfile/>}/>



                      {/* Acadmecis routes */}
                      <Route path="/mb-attendance" element={<AttendanceMB />} />
                      <Route path="/upload-marks" element={<UploadMarks />} />
                      <Route path="/student-disciplinary-or-interaction" element={<StudentDisciplinaryOrInteraction />}/>
                      <Route path="/copy-checking" element={<CopyChecking />}/>
                      <Route path="/manual-attendance" element={<ManualAttendance />}/>

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
                      <Route path="/upload-bills" element={<BillsPage />} />
                          <Route
                        path="/verify-bills"
                        element={<BillsVerificationPage />}
                      />

                      <Route path="/bill-dashboard" element={<BillDashboard />} />

                      <Route path="/bills-pending-verification" element={<MainBillPage/>}/>
                      <Route path="/verified-rejected-bills" element = {<VerifiedAndRejectedBills/>}/>

                      {/* Monitoring module */}
                      <Route
                        path="/center-disciplinary-or-interaction"
                        element={<MbCentersDisciplinary />}
                      />
                      {/* Admin module */}
                      {/* Below will be accessible to admin only */}
                      <Route path="/admin-dash" element = {<AdminLayout/>}/>
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

                      
                      <Route
                        path="/create-user"
                        element={<CreateUser/>}
                      />


                      <Route path="/update-user"
                      element = {<UpdateUser/>}/>



                      <Route path="/user-dashboard" element = {<UserMainLayout/>}/>


                      {/* calling module */}
                      <Route
                        path="/student-callings"
                        element={<StudentRelatedCallings />}
                      />

                      <Route
                        path="/absentee-calling"
                        element={<AbsenteeCalling />}
                      />

                      <Route path="/absent-calling" element = {<AbsentCalling/>}/>

                      <Route
                        path="/initiate-upload-attendance-pdf"
                        element={<CreateUploadAttendancePdf />}
                      />

                  

                      {/* Concerns module */}

                      {/* <Route path="/school-concerns" element = {<SchoolConcernsForm/>}/> */}
                    <Route path="/school-concerns" element = {<SchoolConcerns/>}/>
                      
                    <Route path="/tech-concerns" element = {<TechConcerns/>}/>
                     
                    <Route path="/tech-concerns-resolution" element = {<TechConcernsResolution/>}/>
                      
                    <Route path="/tech-concerns-status" element = {<TechConcernsStatus/>}/>
                     
                    <Route path="/tech-concerns-status" element = {<TechConcernsStatus/>}/>
                     
                    <Route path ="/individual-concerns-form" element = {<IndividualConcerns/>}/>
                      
                    <Route path="/individual-leave-requests" element = {<IndividualLeaveRequests/>}/>
                      
                    <Route path="/individual-concerns-resolution" element = {<IndividualConcenrsResolution/>}/> 
                      
                    <Route path="/self-cocnerns-resolution" element = {<IndividualConcernsRequest/>}/>




                      
                  <Route path="/school-concerns-request" element = {<SchoolConcernsRequest/>}/> 


                  <Route path="/attendance-user" element = {<UserAttendance/>}/>
                  
                  <Route path="/user-attendance-updated" element = {<UserAttendanceUpdated/>}/>
                  
                  <Route path="/user-attendance-aci" element = {<UserAttendanceACI/>}/>
                    
                      {/* Dashboard */}
                      <Route path="/student-attendance-dashboard" element = {<StudentAttendanceDashBoard/>}/>
                      <Route path="/student-calling-dashboard" element = {<StudentCallingDashBoard/>}/>
                       <Route path="/attendance-pdf-count-dashboard" element = {<AttendancePdfCount/>}/>
                      <Route path="/user-attendance-dashboard" element = {<UserAttendanceDash/>}/>          
                      
                      <Route path="/student-disciplinary-dashboard" element = {<StudentDisciplinaryDashboard/>}/>



                      {/* Gamification */}
                      <Route path="/gamification-disciplinary" element ={<GamificationDisciplinary/>}/>

                      <Route path="/s100-attendance" element ={<S100Attendances/>}/>


                      <Route path="/award-points" element = {<Gamification/>}/>



                  


                      </Route>
                    </Routes>
                  </UserProvider>
                </ClassOfStudentProvider>
              </SchoolProvider>
            </BlockProvider>
            </DistrictProvider>
          </DistrictBlockSchoolProvider>
        </SliderProvidedr>
      </Router>
    </>
  );
}

export default App;
