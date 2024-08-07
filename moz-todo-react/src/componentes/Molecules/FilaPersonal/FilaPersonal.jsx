import React, { useState } from "react";
import ModalPersonal from "../../cells/ModalPersonal/ModalPersonal";

export default function FilaPersonal ({perId, perNombre, perApellidoP, perApellidoM, perArea, perCargo, perEstatus, autentificar}){
    
    let idPropPersonal=perId;
    
    return (
    <tr key={perId} id="keyPersonal">
        <td>{perNombre}</td>
        <td>{perApellidoP}</td>
        <td>{perApellidoM}</td>
        <td>{perCargo}</td>
        <td>{perArea}</td>
        <td>{perEstatus}</td>
        <td><ModalPersonal idEmploye={idPropPersonal} autentificacion={autentificar}/></td>
    </tr>
    );
}