/* eslint-disable no-await-in-loop */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from 'reactstrap';

import { COLUMN_LIST } from '../../../constants/Student/studentConstants';
import * as courseActions from '../../../stores/actions/CourseActions';
import * as studentActions from '../../../stores/actions/StudentActions';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';

const StudentObserverCourseStudentList = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [currentMenu, setCurrentMenu] = useState(null);

  let [params] = useSearchParams();
  const courseName = params.get('courseName');
  const gradeName = params.get('gradeName');
  const courseId = params.get('courseId');
  const gradeId = params.get('gradeId');
  const fromGrade = params.get('fromGrade');

  let navigate = useNavigate();

  useEffect(() => {
    let { roleMenus } = props.loginReducer;
    let submenus: any = [];
    roleMenus.map((c: any) => {
      return submenus = submenus.concat(c.menuItemsLogin);
    });
    setCurrentMenu(submenus.find((c: any) => { return (c?.module?.url == 'student_link_course_permit') }));
    if (courseId && !fromGrade) {
      props.dataCourse(courseId).then((resp: any) => {
        setData(resp);
        setDataTable(resp?.data?.students?.map((c: any) => {
          c.node = {};
          c.node.code = c?.code;
          c.node.id = c?.id;
          c.node.name = c?.user ? c?.user?.name : '';
          c.node.lastName = c?.user ? c?.user?.lastName : '';
          c.node.documentType_format = c?.user ? c?.user?.documentType?.name : '';
          c.node.documentNumber = c?.user ? c?.user?.documentNumber : '';
          c.node.gender_format = c?.user ? c?.user?.gender?.name : '';
          return c;
        }));
      });
    }
    if (fromGrade) {
      props.getListAllStudentAcademicGrade(props?.loginReducer?.campusId, gradeId, props?.loginReducer?.schoolId).then((response: any) => {
        setData(response);
        setDataTable(response?.map((c: any) => {
          c.node.name = c?.node?.user ? c?.node?.user?.name : '';
          c.node.lastName = c?.node?.user ? c?.node?.user?.lastName : '';
          c.node.documentNumber = c?.node?.user ? c?.node?.user?.documentNumber : '';
          c.node.documentType_format = c?.node?.user ? c?.node?.user?.documentType?.name : '';
          c.node.gender_format = c?.node?.user ? c?.node?.user?.gender?.name : '';
          return c;
        }));
      });
    }
  }, []);

  const getDataTable = async () => {
    if (courseId && !fromGrade) {
      props.dataCourse(courseId).then((listData: any) => {
        setData(listData);
        setDataTable(listData?.data?.students?.map((c: any) => {
          c.node = {};
          c.node.code = c?.code;
          c.node.id = c?.id;
          c.node.name = c?.user ? c?.user?.name : '';
          c.node.lastName = c?.user ? c?.user?.lastName : '';
          c.node.documentType_format = c?.user ? c?.user?.documentType?.name : '';
          c.node.gender_format = c?.user ? c?.user?.gender?.name : '';
          return c;
        }));
      });
    }
    if (fromGrade) {
      props.getListAllStudentAcademicGrade(props?.loginReducer?.campusId, gradeId, props?.loginReducer?.schoolId).then((listData: any) => {
        setData(listData);
        setDataTable(listData?.map((c: any) => {
          c.node.name = c?.node?.user ? c?.node?.user?.name : '';
          c.node.lastName = c?.node?.user ? c?.node?.user?.lastName : '';
          c.node.documentNumber = c?.node?.user ? c?.node?.user?.documentNumber : '';
          c.node.documentType_format = c?.node?.user ? c?.node?.user?.documentType?.name : '';
          c.node.gender_format = c?.node?.user ? c?.node?.user?.gender?.name : '';
          return c;
        }));
      });
    }
  };

  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable();
  };

  const additionalFunction = async (item: any, btn: any) => {
    switch (btn?.action) {
      case 'goToChildrenStudentObserver':
        goToChildren(`/studentObserverAnnotationList?studentId=${item?.id}&courseId=${courseId}&gradeId=${gradeId}`);
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
          <div className='d-flex justify-content-between align-items-center'>
            {fromGrade ?
              <HeaderInfoAcademic generic={{ title: 'Grado', value: gradeName }} goTitle="Regresar a grados" />
              :
              <HeaderInfoAcademic generic={{ title: 'Grado / Curso', value: gradeName + ' / ' + courseName }} goTitle="Regresar a cursos" />
            }
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
                label: 'Observador',
                color: 'danger',
                icon: 'iconsminds-user',
                action: 'goToChildrenStudentObserver',
              },
            ]}
            withChildren={fromGrade ? false : true}
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
const mapDispatchToProps = { ...courseActions, ...studentActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentObserverCourseStudentList);
