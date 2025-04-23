import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { COLUMN_LIST } from '../../../constants/GradeAssignment/gradeAssignmentConstants';
import * as gradeAssignmentActions from '../../../stores/actions/GradeAssignmentActions';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';

const GradeAssignmentReferentsList = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);

  let [params] = useSearchParams();
  const academicAsignatureId = params.get('academicAsignatureId');
  const asignatureName = params.get('asignatureName');

  let navigate = useNavigate();

  const [data, setData] = useState(null);
  useEffect(() => {
    props.getListAllGradeAssignmentByAsignature(props?.loginReducer?.schoolId, academicAsignatureId).then((listData: any) => {
      setDataTable(
        listData.map((c: any) => {
          c.node.grade_format = c.node.academicGrade ? c.node.academicGrade.name : '';
          c.node.area_format = c.node.academicAsignature?.academicArea ? c.node.academicAsignature?.academicArea?.name : '';
          c.node.asignature_format = c.node.academicAsignature
            ? c.node.academicAsignature.name
            : '';
          return c;
        }),
      );
    });
  }, []);

  const goToChildren = async (url: string) => {
    navigate(url);
  };

  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable();
  };

  const getDataTable = async () => {
    props.getListAllGradeAssignmentByAsignature(props?.loginReducer?.schoolId, academicAsignatureId).then((listData: any) => {
      setDataTable(
        listData.map((c: any) => {
          c.node.grade_format = c.node.academicGrade ? c.node.academicGrade.name : '';
          c.node.asignature_format = c.node.academicAsignature
            ? c.node.academicAsignature.name
            : '';
          return c;
        }),
      );
    });
  }

  const additionalFunction = async (item: any, btn: any) => {
    switch (btn?.action) {
      case 'goToChildrenStandard':
        goToChildren(
          `/standardAcademic?gradeId=${item?.academicGradeId}&asignatureId=${item.academicAsignatureId}&gradeAssignment=${item?.id}`,
        );
        break;
      case 'goToChildrenDBA':
        goToChildren(
          `/dba?gradeId=${item?.academicGrade?.generalAcademicGradeId}&asignatureId=${item.academicAsignature?.generalAcademicAsignatureId}&gradeAssignment=${item?.id}`,
        );
        break;
      case 'goToChildrenLearning':
        goToChildren(
          `/learning?gradeGeneralId=${item?.academicGrade?.generalAcademicGradeId}&gradeId=${item?.academicGradeId}&asignatureId=${item.academicAsignatureId}&asignatureGeneralId=${item.academicAsignature?.generalAcademicAsignatureId}&gradeAssignment=${item?.id}`,
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
          <HeaderInfoAcademic generic={{ title: 'Asignatura', value: asignatureName }} goTitle="Regresar a asignaturas" />
          <DataList
            data={dataTable}
            columns={columns}
            match={props?.match}
            additionalFunction={additionalFunction}
            childrenButtons={[
              {
                id: 0,
                label: 'Estándares / Lineamientos',
                color: 'secondary',
                icon: 'iconsminds-check',
                action: 'goToChildrenStandard',
              },
              {
                id: 1,
                label: 'DBA',
                color: 'info',
                icon: 'iconsminds-brain',
                action: 'goToChildrenDBA',
              },
              {
                id: 2,
                label: 'Aprendizaje',
                color: 'warning',
                icon: 'iconsminds-idea',
                action: 'goToChildrenLearning',
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
const mapDispatchToProps = { ...gradeAssignmentActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(GradeAssignmentReferentsList);
