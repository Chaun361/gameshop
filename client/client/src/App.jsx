
import './App.css'
import {Routes , Route, Outlet} from 'react-router-dom';

import Login from './Components/Login.jsx';
import Home from './Components/Home.jsx'
import Register from './Components/Register.jsx';
import YourCart from './Components/YourCart.jsx';
import RequireAuth from './Components/RequireAuth.jsx';
import PersistLogin from './Components/PersistLogin.jsx';

function App() {
  

  return (
    <Routes path='/' element={<Outlet></Outlet>}>

      {/* public routes */}
      <Route path='login' element={<Login></Login>}></Route>
      
      <Route path='register' element={<Register></Register>}></Route>

      <Route element={<PersistLogin></PersistLogin>}>
        <Route path='/' element={<Home></Home>}></Route>

      {/*Protected routes */}
      
        <Route element={<RequireAuth></RequireAuth>}>
          <Route path="yourcart" element={<YourCart></YourCart>}></Route>
        </Route>
      </Route>

    </Routes>
  )
}

export default App
