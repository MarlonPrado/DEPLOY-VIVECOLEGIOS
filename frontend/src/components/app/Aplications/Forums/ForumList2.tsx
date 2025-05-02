import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';

import { COLUMN_LIST } from '../../../../constants/Course/CourseConstants';
import * as courseActions from '../../../../stores/actions/CourseActions';
import { Colxx } from '../../../common/CustomBootstrap';
import DataList from '../../../common/Data/DataList';
import { Loader } from '../../../common/Loader';

const CoursesTeacherList = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [modalOpen, setModalOpen] = useState(false);

  let navigate = useNavigate();
  
  // Cargar datos iniciales
  useEffect(() => {
    getDataTable();
  }, []);

  // Refrescar datos
  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable();
  };

  // Obtener cursos del docente
  const getDataTable = async () => {
    try {
      const listData = await props.getListAllCourseTeacher(
        props?.loginReducer?.teacherId, 
        props?.loginReducer?.schoolYear
      );
      
      // Verificar si tenemos datos en array
      if (Array.isArray(listData)) {
        setDataTable(listData.map((c: any) => {
          c.node.grade_format = c.node.academicGrade ? c.node.academicGrade.name : '';
          c.node.academicDay_format = c.node.academicDay ? c.node.academicDay.name : '';
          c.node.campus_format = c.node.campus ? c.node.campus.name : '';
          return c;
        }));
      } else {
        console.error("Respuesta no es un array:", listData);
        setDataTable([]);
      }
    } catch (error) {
      console.error("Error al cargar cursos:", error);
      setDataTable([]);
    }
  };

  // Función para manejar navegación
  const additionalFunction = async (item: any, btn: any) => {
    switch (btn?.action) {
      case 'goToForums':
        // Navegar a la ruta correcta con los parámetros necesarios
        goToChildren(`/foros?schoolId=${props?.loginReducer?.schoolId}&courseId=${item.id}&courseName=${item.name}`);
        break;
      default:
        break;
    }
  };

  // Función de navegación
  const goToChildren = async (url: any) => {
    navigate(url);
  };

  return (
    <>
      {dataTable !== null ? (
        <>
          <DataList
            data={dataTable}
            columns={columns}
            match={props?.match}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            additionalFunction={additionalFunction}
            childrenButtons={[
              {
                id: 1,
                label: 'Mis foros',
                color: 'primary',
                icon: 'iconsminds-speach-bubble-dialog',
                action: 'goToForums',
              }
            ]}
            withChildren={true}
            refreshDataTable={refreshDataTable}
          />
        </>
      ) : (
        <>
          <Colxx sm={12} className="d-flex justify-content-center">
            <Loader />
          </Colxx>
        </>
      )}
    </>
  );
};

const mapDispatchToProps = { ...courseActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(CoursesTeacherList);
