import React, {useContext} from "react";
import { ImExit } from "react-icons/im";
import { LogInfoContext } from "../../../LogInfo";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import './BotonExit.css'

export default function BotonExit (){
    const { isLoggedIn, setIsLoggedIn } = useContext(LogInfoContext);
    const navigate = useNavigate();

    const cerrarSesion = () => {
        Swal.fire({
          title: "¿Desea cerrar la sesión?",
          showCancelButton: true,
          confirmButtonText: "Salir",
        }).then((result) => {
          if (result.isConfirmed) {
            setTimeout(() => {
              navigate('/');
            }, 1000);
            localStorage.removeItem('token');
            localStorage.removeItem('idUser');
            localStorage.removeItem('typeUser');
            setIsLoggedIn(false);
          }
        });
    }

    return(
        <button className='menu-exit' onClick={cerrarSesion}><ImExit className='icon-exit'/></button>
    );
}