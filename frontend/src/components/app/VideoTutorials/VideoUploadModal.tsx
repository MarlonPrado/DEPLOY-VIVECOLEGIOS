import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import { createNotification } from '../../../helpers/Notification';
import * as videoTutorialActions from '../../../stores/actions/VideoTutorialActions';

const VideoUploadModal = (props: any) => {
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title || !videoUrl) {
      createNotification('error', 'error', 'El título y la URL son obligatorios');
      return;
    }

    // Construir objeto de video
    const videoData = {
      name: title,
      description: description,
      miniumResolutionFileUrl: videoUrl,
      mediumResolutionFileUrl: videoUrl,
      maxResolutionFileUrl: videoUrl,
      rolesId: [props?.loginReducer?.role?.id]
    };

    props.saveNewVideoTutorial(videoData).then(() => {
      props.toggleModal();
      props.refreshList();
      resetForm();
    });
  };

  const resetForm = () => {
    setTitle('');
    setVideoUrl('');
    setDescription('');
  };

  return (
    <Modal isOpen={props.modalOpen} toggle={props.toggleModal} wrapClassName="modal-right">
      <ModalHeader toggle={props.toggleModal}>
        <IntlMessages id="pages.add-new-video" defaultMessage="Agregar Nuevo Video" />
      </ModalHeader>
      <ModalBody>
        <div className="form-group">
          <Label>Título del video</Label>
          <Input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <Label>URL del video</Label>
          <Input 
            type="text" 
            value={videoUrl} 
            onChange={(e) => setVideoUrl(e.target.value)} 
            placeholder="https://ejemplo.com/video.mp4" 
          />
        </div>
        <div className="form-group">
          <Label>Descripción (opcional)</Label>
          <Input 
            type="textarea" 
            rows={3}
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={props.toggleModal}>
          <IntlMessages id="pages.cancel" defaultMessage="Cancelar" />
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          <IntlMessages id="pages.submit" defaultMessage="Guardar" />
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapDispatchToProps = { ...videoTutorialActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoUploadModal);