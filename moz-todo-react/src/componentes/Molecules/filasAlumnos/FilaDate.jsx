import React, { useState } from "react";
import NestedModal from "../../cells/AlumnoModal/ChildModal";

export default function FilaDate (
    {idAlumno, noControlAlumno, nombreAlumno, apellidoPAlumno, 
        apellidoMAlumno, gradoAlumno, grupoAlumno, turnoAlumno, estatusAlumno, autenticar}){
    
    let idProp = idAlumno;

    return(
        <tr key={idAlumno} id="keyAlumno">
            <td>{noControlAlumno}</td>
            <td>{nombreAlumno}</td>
            <td>{apellidoPAlumno}</td>
            <td>{apellidoMAlumno}</td>
            <td>{gradoAlumno}</td>
            <td>{grupoAlumno}</td>
            <td>{turnoAlumno}</td>
            <td>{estatusAlumno}</td>
            <td><NestedModal
                valueId={idProp} autentificacion={autenticar}
            /></td>        
        </tr>
    );
}