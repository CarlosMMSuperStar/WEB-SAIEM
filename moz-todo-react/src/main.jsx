import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Inicio from './componentes/pages/InicioForm/Inicio.jsx';
import Usuarios from './componentes/pages/UsuariosForm/UsuariosInicio/Usuarios.jsx';
import Alumnos from './componentes/pages/AlumnosForm/AlumnoInicio/Alumnos.jsx';
import AggAlumno from './componentes/pages/AlumnosForm/Alum-Add/AggAlumno.jsx';
import Tramites from './componentes/pages/PagosTramtesForm/InicioTramites/Tramites.jsx';
import AddTramite from './componentes/pages/PagosTramtesForm/AddTram/AddTramite.jsx';
import EditAlum from './componentes/pages/AlumnosForm/EditAlumno/EditAlum.jsx';
import Personal from './componentes/pages/PersonalForm/PersonalInicio/Personal.jsx';
import AddEmpleado from './componentes/pages/PersonalForm/AddEmpleado/AddEmpleado.jsx';
import AddProfesor from './componentes/pages/PersonalForm/AddProfesor/AddProfesor.jsx';
import EditEmpleado from './componentes/pages/PersonalForm/EditEmpleado/EditEmpleado.jsx';
import EditProfesor from './componentes/pages/PersonalForm/EditProfesor/EditProfesor.jsx';
import AddPagoPersonal from './componentes/pages/PagosEmpleadoForm/addPagoPersonal/AddPagoPersonal.jsx';
import AddPagoProfesor from './componentes/pages/PagosEmpleadoForm/addPagoProfesor/AddPagoProfesor.jsx';
import PagoEmpleados from './componentes/pages/PagosEmpleadoForm/PagoEmpleadosInicio/PagoEmpleados.jsx';
import AddUser from './componentes/pages/UsuariosForm/AddUser/AddUser.jsx';
import EditUser from './componentes/pages/UsuariosForm/EditUser/EditUser.jsx';

import App from './App';

import { LogInfoProvider } from './LogInfo.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <h1>Error</h1>
  },
  
  {
    path: "/inicio",
    element: <Inicio/>,
  },
  {
    path: "/usuarios",
    element: <Usuarios/>,
  },
  {
    path: "/aggUsers",
    element: <AddUser/>
  },
  {
    path: "/alumnos",
    element: <Alumnos/>,
  },
  {
    path: "/agg",
    element: <AggAlumno/>,
  },
  {
    path: "/empleados",
    element: <Personal/>,
  },
  {
    path: "/addEmpleado",
    element: <AddEmpleado/>,
  },
  {
    path: "/addMaestro",
    element: <AddProfesor/>,
  },
  {
    path:'/tramites',
    element:<Tramites/>,
  },
  {
    path: "/addTra",
    element: <AddTramite/>,
  },
  {
    path: '/editAlumno',
    element: <EditAlum></EditAlum>,
  },
  {
    path: '/editEmpleado',
    element: <EditEmpleado/>
  },
  {
    path: '/editProfesor',
    element: <EditProfesor/>
  },
  {
    path: '/updateUsers',
    element: <EditUser/>
  },
  {
    path:'/addPer',
    element:<AddPagoPersonal/>
  },
  {
    path:'/addPro',
    element:<AddPagoProfesor/>
  },
  {
    path: '/pagosEmp',
    element: <PagoEmpleados/>
  }
])



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <LogInfoProvider>
    <RouterProvider  router = {router}/>
  </LogInfoProvider>

);
