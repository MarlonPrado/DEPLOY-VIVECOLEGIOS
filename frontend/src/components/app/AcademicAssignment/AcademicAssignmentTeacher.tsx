import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { COLUMN_LIST } from '../../../constants/AcademicAsignatureCourse/AcademicAsignatureCourseConstants';
import { createNotification } from '../../../helpers/Notification';
import * as academicIndicatorActions from '../../../stores/actions/AcademicAsignatureCourseActions';
import * as teacherActions from '../../../stores/actions/TeacherActions';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';

const AcademicAssignmentTeacher = (props: any) => {

  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [modalOpen, setModalOpen] = useState(false);
  const [teacher, setTeacher] = useState(null);

  let [params] = useSearchParams();
  const teacherId = params.get('teacherId');

  let navigate = useNavigate();

  const [data, setData] = useState(null);
  useEffect(() => {
    if (teacherId) {
      props.dataTeacher(teacherId).then((data: any) => {
        setTeacher(data?.data);
      });
      props
        .getListAllAcademicAsignatureCourseTeacher(teacherId, props?.loginReducer?.schoolYear)
        .then((listData: any) => {
          setDataTable(
            listData.map((c: any) => {
              c.node.course_format = c.node.course ? c.node.course.name : '';
              c.node.grade_format = c?.node?.course?.academicGrade?.name;
              c.node.asignature_format = c.node.academicAsignature
                ? c.node.academicAsignature.name
                : '';
              c.node.teacher_format = c.node.teacherId
                ? c.node.teacher?.user?.lastName + " " + c.node.teacher?.user?.name
                : '';
              return c;
            }),
          );
        });
    }
  }, []);

  const getDataTable = async () => {
    if (teacherId) {
      props
        .getListAllAcademicAsignatureCourseTeacher(teacherId, props?.loginReducer?.schoolYear)
        .then((listData: any) => {
          setDataTable(
            listData.map((c: any) => {
              c.node.course_format = c.node.course ? c.node.course.name : '';
              c.node.grade_format = c?.node?.course?.academicGrade?.name;
              c.node.asignature_format = c.node.academicAsignature
                ? c.node.academicAsignature.name
                : '';
              c.node.teacher_format = c.node.teacherId
                ? c.node.teacher?.user?.lastName + " " + c.node.teacher?.user?.name
                : '';
              return c;
            }),
          );
        });
    }
  };

  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable();
  };

  const onSubmit = async (dataForm: any) => {
    if (data === null) {
      await props.saveNewAcademicAsignatureCourse(dataForm).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          refreshDataTable();
        }
      });
    } else {
      await props.updateAcademicAsignatureCourse(dataForm, data.id).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          setData(null);
          refreshDataTable();
        }
      });
    }
  };

  const additionalFunction = async (item: any, btn: any) => {
    switch (btn?.action) {
      case 'goToChildrenExperience':
        goToChildren(
          `/experienceLearning?gradeId=${item?.course?.academicGradeId}&asignatureId=${item.academicAsignatureId}&academicAsignatureCourseId=${item?.id}`,
        );
        break;
      case 'goToChildrenValuations':
        goToChildren(
          `/spreadsheet?gradeId=${item?.course?.academicGradeId}&gradeName=${item?.course?.academicGrade?.name}&courseName=${item?.course?.name}&courseId=${item?.course?.id}&academicAsignatureCourseId=${item?.id}&asignatureId=${item.academicAsignatureId}&asignatureName=${item.academicAsignature?.name}&academicAsignatureCourseId=${item?.id}`,
        );
        break;
      default:
        break;
    }
  };

  const goToChildren = async (url: string) => {
    navigate(url);
  };


  return (
    <>

      {' '}
      {dataTable !== null ? (
        <>
          <div className="d-flex justify-content-start align-items-center w-100">
            <div className="d-flex justify-content-start align-items-center w-100">
              <HeaderInfoAcademic generic={{ title: 'Docente', value: teacher?.user?.lastName + " " + teacher?.user?.name }} goTitle="Regresar Asignacion Academica Docente" />
            </div>
          </div>
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
                label: 'Actividades de valoracion',
                color: 'secondary',
                icon: 'iconsminds-blackboard',
                action: 'goToChildrenExperience',
              },
              // {
              //   id: 1,
              //   label: 'Plan de nivelación',
              //   color: 'info',
              //   icon: 'iconsminds-handshake',
              //   action: 'goToChildren',
              // },
              {
                id: 2,
                label: 'Valoraciones',
                color: 'warning',
                icon: 'iconsminds-letter-open',
                action: 'goToChildrenValuations',
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
  )
}

const mapDispatchToProps = { ...academicIndicatorActions, ...teacherActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(AcademicAssignmentTeacher);
