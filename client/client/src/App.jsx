
import './App.css'
import {Routes , Route, Outlet} from 'react-router-dom';

import Login from './Components/Login.jsx';
import Home from './Components/Home.jsx'

function App() {
  

  return (
    <Routes path='/' element={<Outlet></Outlet>}>

      {/* public routes */}
      <Route path='login' element={<Login></Login>}></Route>
      <Route path='/' element={<Home></Home>}></Route>
      

    </Routes>
  )
}

export default App
