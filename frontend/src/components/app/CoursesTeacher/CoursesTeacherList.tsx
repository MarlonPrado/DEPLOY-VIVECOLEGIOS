import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';

import { COLUMN_LIST } from '../../../constants/CourseTeacher/CourseTeacherConstants';
import * as courseActions from '../../../stores/actions/CourseActions';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import { Loader } from '../../common/Loader';

const CoursesTeacherList = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [modalOpen, setModalOpen] = useState(false);

  let navigate = useNavigate();


  const [data, setData] = useState(null);
  useEffect(() => {
    props.getListAllCourseTeacher(props?.loginReducer?.teacherId, props?.loginReducer?.schoolYear).then((listData: any) => {
      setDataTable(listData.map((c: any) => {
        c.node.grade_format = c.node.academicGrade ? c?.node?.academicGrade?.name : '';
        c.node.academicDay_format = c.node.academicDay ? c.node.academicDay.name : '';
        c.node.campus_format = c.node.campus ? c.node.campus.name : '';
        return c;
      }));
    });
  }, []);

  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable();
  };

  const getDataTable = async () => {
    props.getListAllCourseTeacher(props?.loginReducer?.teacherId, props?.loginReducer?.schoolYear).then((listData: any) => {
      setDataTable(listData.map((c: any) => {
        c.node.grade_format = c.node.academicGrade ? c?.node?.academicGrade?.name : '';
        c.node.academicDay_format = c.node.academicDay ? c.node.academicDay.name : '';
        c.node.campus_format = c.node.campus ? c.node.campus.name : '';
        return c;
      }));
    });
  };

  const additionalFunction = async (item: any, btn: any) => {

    switch (btn?.action) {
      case 'goToChildrenStudents':
        goToChildren(`/studentCourse?courseId=${item.id}&courseName=${item.name}&gradeName=${item?.academicGrade?.name}&gradeId=${item?.academicGrade?.id}`);
        break;
      case 'goToChildrenCodes':
        generateCodesStudents(item?.id);
        break;
      case 'goToChildrenAsignatureCourse':
        goToChildren(`/academicAsignatureCourseBasic?courseId=${item.id}&courseName=${item.name}`);
        break;
      case 'goToChildrenSpredsheetCourse':
        goToChildren(
          `/spreadsheetCourse?courseId=${item.id}`,
        );
        break;
      case 'goToChildrenStudentBehaviour':
        goToChildren(
          `/studentBehaviour?courseId=${item.id}`,
        );
        break;
      case 'goToChildrenPerformanceReportStudentsCourse':
        goToChildren(
          `/performanceReportStudentsCourse?courseId=${item.id}&courseName=${item.name}&gradeName=${item?.academicGrade?.name}&gradeId=${item?.academicGrade?.id}`,
        );
        break;
      case 'goToChildrenStudents2':
        goToChildren(`/performanceReportStudentsCourse2?courseId=${item.id}&courseName=${item.name}&gradeName=${item?.academicGrade?.name}&gradeId=${item?.academicGrade?.id}`);
        break;
      default:
        break;
    }
  };

  const generateCodesStudents = async (id: any) => {
    props.generateCodesStudentsCourse(id).then((listData: any) => {
    });
  };

  const goToChildren = async (url: any) => {
    navigate(url);
  };

  return (
    <>
      {' '}
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
                id: 0,
                label: 'Generar códigos',
                color: 'warning',
                icon: 'iconsminds-tag',
                action: 'goToChildrenCodes',
              },
              {
                id: 1,
                label: 'Estudiantes',
                color: 'info',
                icon: 'iconsminds-student-male-female',
                action: 'goToChildrenStudents',
              },
              {
                id: 2,
                label: 'Asignaturas',
                color: 'primary',
                icon: 'iconsminds-blackboard',
                action: 'goToChildrenAsignatureCourse',
              },
              {
                id: 4,
                label: 'Planilla General',
                color: 'warning',
                icon: 'iconsminds-library',
                action: 'goToChildrenSpredsheetCourse',
              },
              {
                id: 5,
                label: 'Comportamiento Escolar',
                color: 'info',
                icon: 'iconsminds-library',
                action: 'goToChildrenStudentBehaviour',
              },
              {
                id: 6,
                label: 'Certificado Desempeño',
                color: 'primary',
                icon: 'iconsminds-library',
                action: 'goToChildrenPerformanceReportStudentsCourse',
              },
              {
                id: 7,
                label: 'Desempeño Final',
                color: 'secondary',
                icon: 'iconsminds-student-male-female',
                action: 'goToChildrenStudents2',
              },
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
