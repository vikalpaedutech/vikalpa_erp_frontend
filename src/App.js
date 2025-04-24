
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

function App() {
  return (
  <>
    <Router>
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
        <Route path='/center-disciplinary' element = {<MbCentersDisciplinary/>}/>

      </Routes>
      </UserProvider>
      </ClassOfStudentProvider>
      </SchoolProvider>
      </BlockProvider>
      </DistrictBlockSchoolProvider>
    </Router>
  
  
  </>
  );
}

export default App;
