import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';

import { COLUMN_LIST } from '../../../constants/AcademicGrade/AcademicGradeConstants';
import { createNotification } from '../../../helpers/Notification';
import * as gradeActions from '../../../stores/actions/Academic/GradeActions';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import { Loader } from '../../common/Loader';

const StudentObserverGradeList = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState(null);

  let navigate = useNavigate();

  useEffect(() => {
    props.getListAllGrade(props?.loginReducer?.schoolId, props?.loginReducer?.schoolYear).then((listData: any) => {
      setDataTable(
        listData.map((c: any) => {
          c.node.cycle_format = c.node.generalAcademicCycle ? c.node.generalAcademicCycle.name : '';
          c.node.speciality_format = c.node.specialty ? c.node.specialty.name : '';
          c.node.education_level_format = c.node.educationLevel ? c.node.educationLevel.name : '';
          return c;
        }),
      );
    });
  }, []);

  const getDataTable = async () => {
    props.getListAllGrade(props?.loginReducer?.schoolId, props?.loginReducer?.schoolYear).then((listData: any) => {
      setDataTable(
        listData.map((c: any) => {
          c.node.cycle_format = c.node.generalAcademicCycle ? c.node.generalAcademicCycle.name : '';
          c.node.speciality_format = c.node.specialty ? c.node.specialty.name : '';
          c.node.education_level_format = c.node.educationLevel ? c.node.educationLevel.name : '';
          return c;
        }),
      );
    });
  };

  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable();
  };

  const onSubmit = async (dataForm: any) => {
    if (data === null) {
      await props.saveNewGrade(dataForm).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          refreshDataTable();
        }
      });
    } else {
      await props.updateGrade(dataForm, data.id).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          setData(null);
          refreshDataTable();
        }
      });
    }
  };

  const viewEditData = async (id: any) => {
    await props.dataGrade(id).then((formData: any) => {
      setData(formData.data);
      setModalOpen(true);
    });
  };

  const changeActiveData = async (active: any, id: any) => {
    await props.changeActiveGrade(active, id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteData = async (id: any) => {
    await props.deleteGrade(id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const additionalFunction = async (item: any, btn: any) => {
    switch (btn?.action) {
      case 'goToChildrenCourse':
        goToChildren(`/studentObserverCourseList?academicGradeId=${item?.id}&gradeName=${item?.name}`);
        break;
      default:
        break;
    }
  };

  const goToChildren = async (url: any) => {
    navigate(url);
  };

  const deleteAll = async (items: any) => {
    items.map(async (item: any) => {
      await props.deleteGrade(item.id, false).then(
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
      await props.changeActiveGrade(!item.active, item.id, false).then(
        () => { },
        () => {
          createNotification('error', 'error', '');
        },
      );
    });
    refreshDataTable();
    createNotification('success', 'success', '');
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
            viewEditData={viewEditData}
            deleteData={deleteData}
            changeActiveData={changeActiveData}
            deleteAll={deleteAll}
            changeActiveDataAll={changeActiveDataAll}
            additionalFunction={additionalFunction}
            childrenButtons={[
              {
                id: 0,
                label: 'Cursos',
                color: 'secondary',
                icon: 'simple-icon-link',
                action: 'goToChildrenCourse',
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
const mapDispatchToProps = { ...gradeActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentObserverGradeList);
