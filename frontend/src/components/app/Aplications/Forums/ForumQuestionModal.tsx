import React, { useState } from 'react';
import { 
  Modal, ModalHeader, ModalBody, ModalFooter, Button,
  FormGroup, Label, Input, Alert
} from 'reactstrap';
import { connect } from 'react-redux';
import { createNotification } from '../../../../helpers/Notification';

interface ForumQuestionModalProps {
  isOpen: boolean;
  toggle: () => void;
  forumId: string;
  onSuccess: () => void;
  // Esta función la tendrás que añadir a ForumAction:
  // saveForumQuestion: (data: any) => Promise<any>;
}

const ForumQuestionModal = ({
  isOpen,
  toggle,
  forumId,
  onSuccess,
  // saveForumQuestion,
  ...props
}: ForumQuestionModalProps & any) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Por favor ingrese el título de la pregunta');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      // Aquí iría la llamada para guardar la pregunta del foro
      // El backend no tiene implementada esta funcionalidad aún, según mencionaste
      
      // Mock de éxito - Reemplazar con la implementación real cuando esté disponible
      createNotification('success', 'Éxito', 'Pregunta creada correctamente (simulación)');
      setFormData({ name: '', description: '' });
      onSuccess();
    } catch (err) {
      console.error("Error al crear pregunta:", err);
      setError('No se pudo guardar la pregunta. Por favor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        Nueva Pregunta
      </ModalHeader>
      <ModalBody>
        {error && (
          <Alert color="danger" className="mb-4">
            <i className="simple-icon-exclamation mr-2"></i>
            {error}
          </Alert>
        )}
        
        <FormGroup>
          <Label for="name">Título de la pregunta *</Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="Ej: ¿Cómo resolver la ecuación de segundo grado?"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label for="description">Descripción (opcional)</Label>
          <Input
            type="textarea"
            name="description"
            id="description"
            rows="4"
            placeholder="Detalles adicionales sobre la pregunta"
            value={formData.description}
            onChange={handleInputChange}
          />
          <small className="form-text text-muted">
            Puede incluir fórmulas matemáticas utilizando notación especial
          </small>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
              Guardando...
            </>
          ) : (
            'Publicar Pregunta'
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, {
  // Añadir aquí la acción saveForumQuestion cuando esté disponible
})(ForumQuestionModal);