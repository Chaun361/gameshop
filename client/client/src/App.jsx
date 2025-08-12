
import './App.css'
import {Routes , Route, Outlet} from 'react-router-dom';

import Login from './Components/Login.jsx';
import Home from './Components/Home.jsx'
import Register from './Components/Register.jsx';
import YourCart from './Components/YourCart.jsx';

function App() {
  

  return (
    <Routes path='/' element={<Outlet></Outlet>}>

      {/* public routes */}
      <Route path='login' element={<Login></Login>}></Route>
      <Route path='/' element={<Home></Home>}></Route>
      <Route path='register' element={<Register></Register>}></Route>

      {/*Protected routes */}
      <Route path="yourcart" element={<YourCart></YourCart>}></Route>

    </Routes>
  )
}

export default App
