import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { COLUMN_LIST } from '../../../constants/ExperienceLearningRubricCriteria/experienceLearningRubricCriteriaConstants';
import { createNotification } from '../../../helpers/Notification';
import * as academicPeriodActions from '../../../stores/actions/AcademicPeriodActions';
import * as experienceLearningRubricCriteriaActions from '../../../stores/actions/ExperienceLearningRubricCriteriaActions';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import ExperienceLearningRubricCriteriaCreateEdit from './RubricCriteriaCreateEdit';

const ExperienceLearningRubricCriteriaList = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [modalOpen, setModalOpen] = useState(false);
  const [total, setTotal] = useState(0);

  let navigate = useNavigate();

  let [params] = useSearchParams();
  const academicAsignatureCourseId = params.get('academicAsignatureCourseId');
  const learningId = params.get('learningId');

  const [data, setData] = useState(null);
  useEffect(() => {
    props.getListAllExperienceLearningRubricCriteria(learningId).then((listData: any) => {
      setDataTable(listData);
      let count = 0;
      listData?.map((d: any) => {
        count += d?.node?.weight;
      })
      setTotal(count);
    });
  }, []);

  const getDataTable = async (idAcademicPeriod: any = null) => {
    props.getListAllExperienceLearningRubricCriteria(learningId).then(async (listData: any) => {
      await setDataTable(listData);
      getCantTotal(listData);
    });
  };

  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable();
  };

  const onSubmit = async (dataForm: any) => {
    if (data === null) {
      await props.saveNewExperienceLearningRubricCriteria(dataForm).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          refreshDataTable();
        }
      });
    } else {
      await props.updateExperienceLearningRubricCriteria(dataForm, data.id).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          setData(null);
          refreshDataTable();
        }
      });
    }
  };

  const viewEditData = async (id: any) => {
    await props.dataExperienceLearningRubricCriteria(id).then((formData: any) => {
      setData(formData.data);
      setModalOpen(true);
    });
  };

  const changeActiveData = async (active: any, id: any) => {
    await props
      .changeActiveExperienceLearningRubricCriteria(active, id, true)
      .then((formData: any) => {
        refreshDataTable();
      });
  };

  const deleteData = async (id: any) => {
    await props.deleteExperienceLearningRubricCriteria(id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteAll = async (items: any) => {
    items.map(async (item: any) => {
      await props.deleteExperienceLearningRubricCriteria(item.id, false).then(
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
      await props.changeActiveExperienceLearningRubricCriteria(!item.active, item.id, false).then(
        () => { },
        () => {
          createNotification('error', 'error', '');
        },
      );
    });
    refreshDataTable();
    createNotification('success', 'success', '');
  };

  const goTo = async () => {
    navigate(-1);
  };

  const goToChildren = async (url: string) => {
    navigate(url);
  };

  const getCantTotal = async (dataList: any[]) => {
    let count = 0;
    dataList?.map((d: any) => {
      count += d?.node?.weight;
    })
    setTotal(count);
  };

  const additionalFunction = async (item: any, btn: any) => {
    switch (btn?.action) {
      case 'TRADITIONALVALUATION':
        goToChildren(
          `/traditionalValuation?courseId=${item?.academicAsignatureCourse?.courseId}&learningId=${item?.id}&learningName=${item?.title}&asignatureName=${item?.academicAsignatureCourse?.academicAsignature?.name}&courseName=${item?.academicAsignatureCourse?.course?.name}&gradeName=${item?.academicAsignatureCourse?.course?.academicGrade?.name}`,
        );
        break;
      case 'SELFAPPRAISAL':
        goToChildren(
          `/selfValuation?courseId=${item?.academicAsignatureCourse?.courseId}&learningId=${item?.id}&learningName=${item?.title}&asignatureName=${item?.academicAsignatureCourse?.academicAsignature?.name}&courseName=${item?.academicAsignatureCourse?.course?.name}&gradeName=${item?.academicAsignatureCourse?.course?.academicGrade?.name}`,
        );
        break;
      case 'VALUATIONRUBRIC':
        goToChildren(
          `/rubricValuation?courseId=${item?.academicAsignatureCourse?.courseId}&learningId=${item?.id}&learningName=${item?.title}&asignatureName=${item?.academicAsignatureCourse?.academicAsignature?.name}&courseName=${item?.academicAsignatureCourse?.course?.name}&gradeName=${item?.academicAsignatureCourse?.course?.academicGrade?.name}`,
        );
        break;
      default:
        break;
    }
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
            createActionDisabled={total >= 100 ? true : false}
            childrenButtons={[
              {
                id: 0,
                label: 'Coevaluación',
                color: 'info',
                icon: 'iconsminds-pen-2',
                action: 'COEVALUATION',
              },
              {
                id: 1,
                label: 'Autoevaluación',
                color: 'info',
                icon: 'iconsminds-pen-2',
                action: 'SELFAPPRAISAL',
              },
              {
                id: 2,
                label: 'Valoración tradicional',
                color: 'info',
                icon: 'iconsminds-pen-2',
                action: 'TRADITIONALVALUATION',
              },
              {
                id: 3,
                label: 'Rúbrica de valoración',
                color: 'info',
                icon: 'iconsminds-pen-2',
                action: 'VALUATIONRUBRIC',
              },
              {
                id: 4,
                label: 'Prueba en Línea',
                color: 'info',
                icon: 'iconsminds-pen-2',
                action: 'ONLINETEST',
              },
            ]}
            withChildren={true}
            filterChildren={'experienceType'}
            header={
              <>
                <div className="d-flex justify-content-between mt-4 align-items-center">
                  <div className="d-flex justify-content-between align-items-center">
                    <HeaderInfoAcademic asignature grade course experienceLearnig goTitle="Regresar a experiencias de aprendizaje" experienceLearnigId={learningId} academicAsignatureCourseId={academicAsignatureCourseId} />
                  </div>
                  <div className='d-flex text-right flex-column'>
                    <span>Peso total:</span>{' '}
                    <h1 className="text-info font-bold">{total}</h1>
                  </div>
                </div>
              </>
            }
            refreshDataTable={refreshDataTable}
          />
          <ExperienceLearningRubricCriteriaCreateEdit
            data={data}
            modalOpen={modalOpen}
            toggleModal={() => {
              setData(null);
              return setModalOpen(!modalOpen);
            }}
            onSubmit={onSubmit}
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
const mapDispatchToProps = { ...experienceLearningRubricCriteriaActions, ...academicPeriodActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExperienceLearningRubricCriteriaList);
