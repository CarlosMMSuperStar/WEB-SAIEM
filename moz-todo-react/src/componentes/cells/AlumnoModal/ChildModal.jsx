import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChildModal.css'; // Importa la hoja de estilos
import Logo2 from './AssetsDAlumn/Logo2.png';
import { FaUserEdit } from "react-icons/fa";
  
export default function NestedModal({ valueId, autentificacion }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const imprimirDatoDeUnAlumno = async () => {
    const token = localStorage.getItem('token');
    const url = 'https://saiemapi.integrador.xyz/alumnos';

    fetch(`${url}/${valueId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al imprimir los alumnos: ' + response.status);
        }
        return response.json();
      })
      .then(response => {
        setData(response[0]); // Ajuste aquí para asegurar que data sea un objeto
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
        autentificacion();
      });
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  useEffect(() => {
    if (open) {
      imprimirDatoDeUnAlumno();
    }
  }, [open]);

  return (
    <div>
      <Button onClick={handleOpen}> <FaUserEdit /> </Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box className="modal-box">

          <header id='header-DAlmun'>
            <img src={Logo2} alt="Left" className='image-left' />
            <h2 id="child-modal-title">Datos del Alumno</h2>
            <img src={Logo2} alt="Right" className='image-right' />
          </header>

          {error && <p>Error: {error}</p>}
          {!error && data && (
          <div >
            <br />
            <p id='pd2'>Datos del Alumno:</p>
            <br />
            <ul>
              <li>Nombre: {data.nombre || "N/A"} {data.apellido_p || "N/A"} {data.apellido_m || "N/A"}</li>
              <li>Grado: {data.grado || "N/A"}</li>
              <li>Grupo: {data.grupo || "N/A"}</li>
              <li>Turno: {data.turno || "N/A"}</li>
              <li>No. Control: {data.noControl || "N/A"}</li>
              <li>Estatus: {data.tipo_estatus || "N/A"}</li>
              <li>CURP: {data.curp || "N/A"}</li>
              <li>Teléfono: {data.telefono || "N/A"}</li>
              <li>Correo: {data.correo || "N/A"}</li>
              <li>Tutor: {data.nombre_tutor || "N/A"} {data.apellidoP_tutor || "N/A"} {data.apellidoM_tutor || "N/A"}</li>
              <li>Teléfono del tutor: {data.telefono_tutor || "N/A"}</li>
              <li>Nivel académico: {data.nivelAcademico || "N/A"}</li>
            </ul>
            <br />
            <p id='pd'>Datos del Examen del Curso Pre-Universitari:</p>
            <br />
            <ul>
              <li>Colegio de proveniencia: {data.escuelaProcedente}</li>
              <li>Universidad a la que aspira: {data.colegioAspirado || "N/A"}</li>
              <li>Carrera a la que aspira: {data.carreraAspirada || "N/A"}</li>
              <li>Fecha de inicio del curso: {formatearFecha(data.fechaInicioCurso)}</li>
              <li>Fecha de examen de diagnóstico: {formatearFecha(data.fechaExamenDiagnostico)}</li>
              <li>Pensamiento Matemático: {data.nivelMatematico || "N/A"}</li>
              <li>Pensamiento Analítico: {data.nivelAnalitico || "N/A"}</li>
              <li>Nivel Lingüístico: {data.nivelLinguistico || "N/A"}</li>
              <li>Comprensión Lectora: {data.nivelComprension || "N/A"}</li>
              <li>Puntaje General: {data.nivelGeneral || "N/A"}</li>
            </ul>
            <Button className='EditA' onClick={() => navigate('/editAlumno', { state: { data } })}>
            Editar
            </Button>
          </div>
          )}
          <Button className='CloseA' onClick={handleClose}>Cerrar</Button>
        </Box>
      </Modal>
    </div>
  );
}