import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { FormGroup, Label, Input } from 'reactstrap';
import * as forumActions from '../../../../stores/actions/ForumAction';
import { createNotification } from '../../../../helpers/Notification';
import AddNewModal from '../../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../../common/Data/CreateEditAuditInformation';

interface ForumCreateEditProps {
  modalOpen: boolean;
  toggleModal: () => void;
  data: any;
  schoolId?: string;
  courseId?: string;
  refreshDataTable?: () => void;
  // Redux props
  loginReducer: any;
  // Redux actions
  saveNewForum: (data: any) => Promise<any>;
  updateForum: (data: any) => Promise<any>;
}

const ForumCreateEdit = (props: ForumCreateEditProps) => {
  // Estados
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState<{name?: string, description?: string}>({});
  
  // No usamos react-hook-form para evitar problemas con DevTool

  // Efecto cuando cambia el item seleccionado
  useEffect(() => {
    // Limpiar campos al abrir modal de creación
    if (!props.data) {
      setName('');
      setDescription('');
      setDetails('');
      setErrors({});
    } else {
      // Llenar datos para edición
      setName(props.data.name || '');
      setDescription(props.data.description || '');
      setDetails(props.data.details || '');
      setErrors({});
    }
  }, [props.data]);

  // Validación y envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    const newErrors: {name?: string, description?: string} = {};
    if (!name.trim()) {
      newErrors.name = 'El título es obligatorio';
    }
    if (!description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const dataToSave: any = {
        name,
        description,
        details,
        schoolId: props.schoolId || props.loginReducer?.schoolId,
        academicAsignatureCourseId: props.courseId || null,
        schoolYearId: props.loginReducer?.schoolYear
      };

      if (props.loginReducer?.campusId) {
        dataToSave.campusId = props.loginReducer.campusId;
      }
      
      // Si hay ID, actualizar; si no, crear
      if (props.data?.id) {
        dataToSave.id = props.data.id;
        await props.updateForum(dataToSave);
        createNotification('success', 'Éxito', 'Foro actualizado correctamente');
      } else {
        await props.saveNewForum(dataToSave);
        createNotification('success', 'Éxito', 'Foro creado correctamente');
      }
      
      // Limpiar y cerrar
      setName('');
      setDescription('');
      setDetails('');
      props.toggleModal();
      
      // Recargar lista
      if (typeof props.refreshDataTable === 'function') {
        props.refreshDataTable();
      }
    } catch (error) {
      console.error("Error al guardar foro:", error);
      createNotification('error', 'Error', 'No se pudo guardar el foro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddNewModal
      modalOpen={props.modalOpen}
      toggleModal={props.toggleModal}
      handleSubmit={handleSubmit}
      loading={loading}
      data={props.data}
      title={props.data?.id ? 'Editar Foro' : 'Crear Nuevo Foro'}
    >
      <FormGroup>
        <Label for="name">Título *</Label>
        <Input
          type="text"
          id="name"
          placeholder="Título del foro"
          value={name}
          onChange={(e) => setName(e.target.value)}
          invalid={!!errors.name}
        />
        {errors.name && (
          <div className="invalid-feedback d-block">
            {errors.name}
          </div>
        )}
      </FormGroup>
      
      <FormGroup>
        <Label for="description">Descripción *</Label>
        <Input
          type="text"
          id="description"
          placeholder="Breve descripción del foro"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          invalid={!!errors.description}
        />
        {errors.description && (
          <div className="invalid-feedback d-block">
            {errors.description}
          </div>
        )}
      </FormGroup>
      
      <FormGroup>
        <Label for="details">Detalles</Label>
        <Input
          type="textarea"
          id="details"
          rows={5}
          placeholder="Contenido detallado del foro"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </FormGroup>

      {/* Información de auditoría (solo en edición) */}
      {props.data?.id && (
        <CreateEditAuditInformation
          created_at={props.data.createdAt}
          updated_at={props.data.updatedAt}
          created_by={props.data.createdByUser?.name}
          updated_by={props.data.updatedByUser?.name}
        />
      )}
    </AddNewModal>
  );
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, { ...forumActions })(ForumCreateEdit);