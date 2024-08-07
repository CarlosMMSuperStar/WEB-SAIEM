import React, { useState } from "react";
import ModalProfesor from "../../cells/ModalProfesor/ModalProfesor";

export default function FilaProfesor ({proId, proNombre, proApellioP, proApellidoM, proEspecialidad, proEstatus, autentificar}){
    
    let profIdProp = proId;

    return (
        <tr key={proId} id="keyProfesor">
            <td>{proNombre}</td>
            <td>{proApellioP}</td>
            <td>{proApellidoM}</td>
            <td>Docente</td>
            <td>{proEspecialidad}</td>
            <td>{proEstatus}</td>
            <td><ModalProfesor idTeacher={profIdProp} autenticación={autentificar}/></td>
        </tr>
    );
}