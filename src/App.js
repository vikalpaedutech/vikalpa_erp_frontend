
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route, Routes, RouterProvider} from "react-router-dom";
//Context api
import { DistrictBlockSchoolProvider, BlockProvider, SchoolProvider, ClassOfStudentProvider } from './components/contextAPIs/DependentDropdowns.contextAPI.js';

//UI Components


//Imports of Admin
import AdminPage from './pages/Admin.page.jsx';
import UpdateStudent from './components/AcademicsComponents/UpdateStudent.component.jsx';
import { TemplateLanding } from './pages/ModularPage/AdminPage.jsx';

//Imports of Users.

import { UserSignIn } from './components/user/UserSignIn.component.jsx';
import { UserProvider } from './components/contextAPIs/User.context.js';
import UserLoggedIn from './components/user/UserLoggedIn.component.jsx';
import {CenterCoordinator} from '../src/pages/UserScreens/CC.jsx';
import { UserAttendance } from './components/user/UserAttendance.jsx';
import { UserAttendanceLogout } from './components/user/userAttendanceLogout.jsx';

// Imports of Academics
import AttendanceMB from './components/AcademicsComponents/AttendanceMB.component.jsx';
import {UploadMarks} from "../src/components/AcademicsComponents/UploadMarks.component.jsx";
import { StudentDisciplinaryOrInteraction } from './components/AcademicsComponents/StudentDisciplinaryOrInteraction.component.jsx';

//Import of bills
import Bills from './components/Bills/Bills.jsx';
import BillsPending from './components/Bills/BillsPending.jsx';
import BillsVerification from './components/Bills/BillsVerification.jsx';
import BillsApproval from './components/Bills/BillsApproval.jsx';
import UserSignup from './components/user/UserSignup.component.jsx';

//Importing ACI
import { ACI } from './pages/UserScreens/ACI.jsx';

//Imports of Centers
import MbCentersDisciplinary from './components/CentersOrSchools/MbCentersDisciplinary.jsx';
import TestCss from './components/user/testCss.jsx';

//Attendance pdf
import { AttendancePdf } from './components/AcademicsComponents/AttendancePdf.component.jsx';
import { DownloadAttendancePdfFormat } from './components/AcademicsComponents/DownloadAttendancePdfFormat.component.jsx';
import { CenterDisciplinaryData } from './components/CentersOrSchools/CenterDisciplinaryData.jsx';

import { SliderProvidedr } from './components/contextAPIs/SliderHook.context.js';

//Academics imports
import { AcademicCoordinator } from './pages/UserScreens/AcademicCoordinator.jsx';

//Template
import { Template } from './pages/UserScreens/Template.jsx';


//Practice
import { Practice } from './practice/pactice.jsx';


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
        <Route path='/' element = {""}/>

        {/* Admin Routes */}
        <Route path= "/admin" element = {<AdminPage/>}/>
        <Route path='/edit-student-details' element = {<UpdateStudent/>}/>
        <Route path='/landing' element = {<TemplateLanding/>}/>

        {/* ________________________________________________________________________ */}


      {/* User Routes */}
 
      <Route path='/user-signin' element = {<UserSignIn/>}/> 

      <Route path='/user-signup' element = {<UserSignup/>}/>

      <Route path='/user' element = {<UserLoggedIn/>}/>

      <Route path='/center-coordinator'element = {<CenterCoordinator/>}/>

      <Route path='user-attendance' element = {<UserAttendance/>}/>
      <Route path='user-attendance-logout' element = {<UserAttendanceLogout/>}/>

      {/* ACI Routes */}
      <Route path='/user-aci' element = {<ACI/>}/>


      {/* Academics routes */}
      <Route path='/attendance-mb' element = {<AttendanceMB/>}/>
      <Route path='/update-marks' element = {<UploadMarks/>}/>
      <Route path='/student-disciplinaryinteraction' element = {<StudentDisciplinaryOrInteraction/>}/>

      {/* Bill related routes */}
      <Route path='/bills' element = {<Bills/>}/>
      <Route path = '/bills-pending' element = {<BillsPending/>}/>
      <Route path = '/bills-verifiaction' element = {<BillsVerification/>}/>
      <Route path = '/bills-approval' element = {<BillsApproval/>}/>


      <Route path = '/test' element = {<TestCss/>}/>

        {/* Centers related routes */}
        <Route path='/center-disciplinary-hold' element = {<MbCentersDisciplinary/>}/>
        <Route path='/center-disciplinary-data' element = {<CenterDisciplinaryData/>}/>
        
        {/* AttendancePdf */}
        <Route path='/attendance-pdf' element = {<AttendancePdf/>}/>
        <Route path='/download-attendance-pdf' element = {<DownloadAttendancePdfFormat/>}/>

        {/* Academic Routes */}
        <Route path='/academic-coordinator' element={<AcademicCoordinator/>}/>


        {/* Practice imports */}
        <Route path='practice' element = {<Practice/>}/>


        {/* Template */}

        <Route path='/logged-in' element = {<Template/>}/>
       


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
