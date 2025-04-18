
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
//Context api
import { DistrictBlockSchoolProvider, BlockProvider, SchoolProvider, ClassOfStudentProvider } from './components/contextAPIs/DependentDropdowns.contextAPI.js';


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
      <Route path='/user' element = {<UserLoggedIn/>}/>

      <Route path='/center-coordinator'element = {<CenterCoordinator/>}/>


      {/* Academics routes */}
      <Route path='/attendance-mb' element = {<AttendanceMB/>}/>
      <Route path='/update-marks' element = {<UploadMarks/>}/>
      <Route path='/student-disciplinaryinteraction' element = {<StudentDisciplinaryOrInteraction/>}/>


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
