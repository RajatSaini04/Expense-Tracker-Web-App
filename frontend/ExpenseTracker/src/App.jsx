import React from 'react'

import{ 
 BrowserRouter as Router ,
  Routes ,
  Route ,
  Navigate
  } from 'react-router-dom';

  import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Home from './pages/dashboard/Home';
import Income from './pages/dashboard/Income';
import Expense from './pages/dashboard/Expense';
import UserProvider from './context/UserContext';
import { Toaster } from "react-hot-toast";




const App = () => {
  return (
  <UserProvider>
   <div>
    <Router>
      <Routes>
        <Route path='/' element={<Root />}/>
        <Route path='/login'  exact element={<Login />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/dashboard' element={<Home/>}/>
        <Route path='/home' element={<Home />}/>
        <Route path='/income' element={<Income />}/>
        <Route path='/expense' element={<Expense />}/>
     
      </Routes>
    </Router>
   </div>

   <Toaster
         toastOptions={{
          classNames:"",
          style:{
            fontsize:"13px"
          },
         }}
         />
   </UserProvider>
  )
}

export default App;


const Root = () => {
  //check if token existed in local storage
  const isAuthenticated = !!localStorage.getItem('token') ;

  //Redirect tot dashBoard if authenticated otherwiese redirect to login

  return isAuthenticated?
  (<Navigate to='/dashboard' />):
 (<Navigate to='/login' />);
};


