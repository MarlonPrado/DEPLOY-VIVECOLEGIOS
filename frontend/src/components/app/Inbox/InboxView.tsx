import React, { useEffect, useState } from 'react';
import { FormProvider, useForm, useFormState } from 'react-hook-form';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import defaultAvatar from '../../../assets/img/profiles/l-1.jpg';

interface InboxViewProps {
  data: any;
  modalOpen: boolean;
  toggleModal: () => void;
  onDelete: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}

const InboxView = ({ data, modalOpen, toggleModal, onDelete, onMarkAsRead }: InboxViewProps) => {
  if (!data) return null;
  
  const isUnread = !data.dateRead;
  const senderName = data.user ? `${data.user.name} ${data.user.lastName}` : 'Usuario desconocido';
  const profileImage = data.user?.profilePhoto || defaultAvatar;
  
  const formatFullDate = (dateString: string) => {
    return moment(dateString).format('D [de] MMMM [de] YYYY, HH:mm');
  };

  return (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      className="modal-dialog-centered"
    >
      <ModalHeader toggle={toggleModal}>
        <div className="w-100">
          <h5 className="mb-1">{data.title || 'Sin título'}</h5>
          <div className="d-flex align-items-center">
            <div className="d-24 mr-2">
              <img 
                src={profileImage} 
                alt={senderName}
                className="img-fluid rounded-circle"
              />
            </div>
            <small className="text-muted">
              De: {senderName}
            </small>
          </div>
        </div>
      </ModalHeader>
      
      <ModalBody>
        <div className="d-flex justify-content-between mb-3">
          <small className="text-muted">
            <i className="simple-icon-calendar mr-1"></i>
            {formatFullDate(data.dateSend)}
          </small>
          
          {data.dateRead && (
            <small className="text-success">
              <i className="simple-icon-check mr-1"></i>
              Leído el {formatFullDate(data.dateRead)}
            </small>
          )}
        </div>
        
        <div className="message-content p-3 border-left-primary bg-light rounded">
          {data.message?.split('\n').map((line: string, idx: number) => (
            <p key={idx} className={idx > 0 ? 'mb-2' : ''}>
              {line || <br />}
            </p>
          ))}
        </div>
      </ModalBody>
      
      <ModalFooter>
        <Button 
          color="danger" 
          outline
          onClick={() => onDelete(data.id)}
        >
          <i className="simple-icon-trash mr-2"></i>
          Eliminar
        </Button>
        
        <div>
          {isUnread && (
            <Button 
              color="success" 
              className="mr-2"
              onClick={() => onMarkAsRead(data.id)}
            >
              <i className="simple-icon-check mr-2"></i>
              Marcar como leído
            </Button>
          )}
          
          <Button 
            color="primary" 
            onClick={toggleModal}
          >
            Cerrar
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default InboxView;