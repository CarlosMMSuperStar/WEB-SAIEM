import React from 'react';
import Modal from 'react-modal';
import './EditModal.css';
import { SiGoogleforms } from "react-icons/si";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";


Modal.setAppElement('#root');

const EditModal = ({ isOpen, onRequestClose, onDelete, onSave }) => {
  return (
    <Modal portalClassName='M-odal'
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Editar Alumno"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="button-container">
        <button className='form' onClick={onSave}><SiGoogleforms /></button>
        <button className='delete' onClick={onDelete}><RiDeleteBin6Line /></button>
        <button className='edit' onClick={onRequestClose}><MdEdit /></button>
      </div>
    </Modal>
  );
};

export default EditModal;