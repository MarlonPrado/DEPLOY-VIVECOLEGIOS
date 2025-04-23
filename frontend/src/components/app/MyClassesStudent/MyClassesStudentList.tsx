import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

import { COLUMN_LIST } from '../../../constants/MyClassesStudent/myClassesStudentConstants';
import { createNotification } from '../../../helpers/Notification';
import * as academicIndicatorActions from '../../../stores/actions/AcademicAsignatureCourseActions';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import { Loader } from '../../common/Loader';
import { permissionsMenu } from '../../../helpers/DataTransformations';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';

const MyClassesStudentList = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [modalOpen, setModalOpen] = useState(false);

  let navigate = useNavigate();

  const [data, setData] = useState(null);
  const location = useLocation();

  const getDataTable = useCallback(async () => {
    let permissions = permissionsMenu(props?.loginReducer, location.pathname);
    props
      .getListAllAcademicAsignatureCourse(props?.loginReducer?.courseId, permissions.fullAccess)
      .then((listData: any) => {
        setDataTable(
          listData.map((c: any) => {
            c.node.asignature_format = c.node.academicAsignature
              ? c.node.academicAsignature.name
              : '';
            c.node.teacher_format = c.node.teacher && c.node.teacher.user ? c.node.teacher.user.lastName + ' ' + c.node.teacher.user.name : ''
            return c;
          }),
        );
      });

  }, []);


  useEffect(() => {
    getDataTable()
      .catch(console.error);;
  }, [getDataTable]);

  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable();
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
      case 'goToChildrenStudentAttendance':
        goToChildren(
          `/studentAttendance?courseName=${item?.course?.name}&courseId=${item?.course?.id}&academicAsignatureCourseId=${item?.id}&asignatureId=${item.academicAsignatureId}&asignatureName=${item.academicAsignature?.name}&academicAsignatureCourseId=${item?.id}`,
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
      {dataTable !== null ? (
        <>
          <div className="d-flex justify-content-start align-items-center w-100">
            <div className="d-flex justify-content-start align-items-center w-100">
              <HeaderInfoAcademic courseId={props?.loginReducer?.courseId} course grade />
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
              {
                id: 3,
                label: 'Asistencia',
                color: 'info',
                icon: 'iconsminds-letter-open',
                action: 'goToChildrenStudentAttendance',
              },
              // {
              //   id: 4,
              //   label: 'Planilla General',
              //   color: 'warning',
              //   icon: 'iconsminds-letter-open',
              //   action: 'goToChildrenValuations',
              // },
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
const mapDispatchToProps = { ...academicIndicatorActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyClassesStudentList);
