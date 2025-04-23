import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { COLUMN_LIST } from '../../../constants/Course/CourseConstants';
import { createNotification } from '../../../helpers/Notification';
import * as courseActions from '../../../stores/actions/CourseActions';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';

const PerformanceReportCourseList = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [modalOpen, setModalOpen] = useState(false);

  let navigate = useNavigate();

  let [params] = useSearchParams();
  const academicGradeId = params.get('academicGradeId');
  const gradeName = params.get('gradeName');

  const [data, setData] = useState(null);
  useEffect(() => {
    props.getListAllCourse(props?.loginReducer?.campusId, academicGradeId ? academicGradeId : '', props?.loginReducer?.schoolId).then((listData: any) => {
      setDataTable(listData.map((c: any) => {
        c.node.teacher_format = c.node.teacher ? c?.node?.teacher?.user?.name + c?.node?.teacher?.user?.lastName : '';
        c.node.academicDay_format = c.node.academicDay ? c.node.academicDay.name : '';
        c.node.campus_format = c.node.campus ? c.node.campus.name : '';
        return c;
      }));
    });
  }, []);

  const getDataTable = async () => {
    props.getListAllCourse(props?.loginReducer?.campusId, academicGradeId ? academicGradeId : '', props?.loginReducer?.schoolId).then((listData: any) => {
      setDataTable(listData.map((c: any) => {
        c.node.teacher_format = c.node.teacher ? c?.node?.teacher?.user?.name + c?.node?.teacher?.user?.lastName : '';
        c.node.academicDay_format = c.node.academicDay ? c.node.academicDay.name : '';
        c.node.campus_format = c.node.campus ? c.node.campus.name : '';
        return c;
      }));
    });
  };

  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable();
  };

  const onSubmit = async (dataForm: any) => {
    if (data === null) {
      await props.saveNewCourse(dataForm).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          refreshDataTable();
        }
      });
    } else {
      await props.updateCourse(dataForm, data.id).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          setData(null);
          refreshDataTable();
        }
      });
    }
  };

  const viewEditData = async (id: any) => {
    await props.dataCourse(id).then((formData: any) => {
      setData(formData.data);
      setModalOpen(true);
    });
  };

  const changeActiveData = async (active: any, id: any) => {
    await props.changeActiveCourse(active, id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteData = async (id: any) => {
    await props.deleteCourse(id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteAll = async (items: any) => {
    items.map(async (item: any) => {
      await props.deleteCourse(item.id, false).then(
        () => { },
        () => {
          createNotification('error', 'error', '');
        },
      );
    });
    refreshDataTable();
    createNotification('success', 'success', '');
  };

  const changeActiveDataAll = async (items: any) => {
    items.map(async (item: any) => {
      await props.changeActiveCourse(!item.active, item.id, false).then(
        () => { },
        () => {
          createNotification('error', 'error', '');
        },
      );
    });
    refreshDataTable();
    createNotification('success', 'success', '');
  };

  const additionalFunction = async (item: any, btn: any) => {
    switch (btn?.action) {
      case 'goToChildrenStudents1':
        goToChildren(`/performanceReportStudentsCourse?courseId=${item.id}&courseName=${item.name}&gradeName=${gradeName}&gradeId=${academicGradeId}`);
        break;
      case 'goToChildrenStudents2':
        goToChildren(`/performanceReportStudentsCourse2?courseId=${item.id}&courseName=${item.name}&gradeName=${gradeName}&gradeId=${academicGradeId}`);
        break;
      case 'goToChildrenStudents3':
        goToChildren(`/performanceReportStudentsCourse3?courseId=${item.id}&courseName=${item.name}&gradeName=${gradeName}&gradeId=${academicGradeId}`);
        break;
      default:
        break;
    }
  };

  const goToChildren = async (url: any) => {
    navigate(url);
  };

  return (
    <>
      {' '}
      {dataTable !== null ? (
        <>
          <HeaderInfoAcademic generic={{ title: 'Grado', value: gradeName }} goTitle="Regresar a grados" />
          <DataList
            data={dataTable}
            columns={columns}
            match={props?.match}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            viewEditData={viewEditData}
            deleteData={deleteData}
            changeActiveData={changeActiveData}
            deleteAll={deleteAll}
            changeActiveDataAll={changeActiveDataAll}
            additionalFunction={additionalFunction}
            childrenButtons={[
              {
                id: 1,
                label: 'Desempeño Periodos',
                color: 'secondary',
                icon: 'iconsminds-student-male-female',
                action: 'goToChildrenStudents1',
              },
              {
                id: 2,
                label: 'Desempeño Final',
                color: 'secondary',
                icon: 'iconsminds-student-male-female',
                action: 'goToChildrenStudents2',
              },
              {
                id: 3,
                label: 'Certificado',
                color: 'secondary',
                icon: 'iconsminds-student-male-female',
                action: 'goToChildrenStudents3',
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

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceReportCourseList);
