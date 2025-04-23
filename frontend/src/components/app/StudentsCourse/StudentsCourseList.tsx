/* eslint-disable no-await-in-loop */
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Button } from 'reactstrap';

import {
  COLUMN_LIST_STUDENT_COURSE,
  COLUMN_LIST_STUDENT_GRADE,
} from '../../../constants/StudentCourse/studentCourseConstants';
import { permissionsMenu } from '../../../helpers/DataTransformations';
import * as courseActions from '../../../stores/actions/CourseActions';
import * as studentActions from '../../../stores/actions/StudentActions';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import StudentAddCourse from './StudentAddCourse';

const StudentCourseList = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const location = useLocation();
  const [currentMenu, setCurrentMenu] = useState(null);

  let [params] = useSearchParams();
  const courseName = params.get('courseName');
  const gradeName = params.get('gradeName');
  const courseId = params.get('courseId');
  const gradeId = params.get('gradeId');
  const fromGrade = params.get('fromGrade');

  const getDataTable = useCallback(async () => {
    let { roleMenus } = props.loginReducer;
    let submenus: any = [];
    roleMenus.map((c: any) => {
      return (submenus = submenus.concat(c.menuItemsLogin));
    });
    setCurrentMenu(
      submenus.find((c: any) => {
        return c?.module?.url == 'student_link_course_permit';
      }),
    );
    console.log(
      submenus.find((c: any) => {
        return c?.module?.url == 'student_link_course_permit';
      }),
    );
    let permissions = permissionsMenu(props?.loginReducer, location.pathname);
    if (courseId && !fromGrade) {
      setColumns(COLUMN_LIST_STUDENT_COURSE);
      props.dataCourse(courseId).then((resp: any) => {
        setData(resp);
        setDataTable(
          resp?.data?.students?.map((c: any) => {
            c.node = {};
            c.node.code = c?.code;
            c.node.id = c?.id;
            c.node.name = c?.user ? c?.user?.name : '';
            c.node.lastName = c?.user ? c?.user?.lastName : '';
            c.node.documentType_format = c?.user ? c?.user?.documentType?.name : '';
            c.node.documentNumber = c?.user ? c?.user?.documentNumber : '';
            c.node.gender_format = c?.user ? c?.user?.gender?.name : '';
            return c;
          }),
        );
      });
    }
    if (fromGrade) {
      setColumns(COLUMN_LIST_STUDENT_GRADE);
      props
        .getListAllStudentAcademicGrade(
          props?.loginReducer?.campusId,
          gradeId,
          props?.loginReducer?.schoolId,
          props?.loginReducer?.schoolYear,
        )
        .then((response: any) => {
          setData(response);
          setDataTable(
            response?.map((c: any) => {
              c.node.name = c?.node?.user ? c?.node?.user?.name : '';
              c.node.lastName = c?.node?.user ? c?.node?.user?.lastName : '';
              c.node.documentNumber = c?.node?.user ? c?.node?.user?.documentNumber : '';
              c.node.documentType_format = c?.node?.user ? c?.node?.user?.documentType?.name : '';
              c.node.gender_format = c?.node?.user ? c?.node?.user?.gender?.name : '';
              c.node.course_format = c?.node?.course ? c?.node?.course?.name : '';
              c.node.campus_format = c?.node?.course ? c?.node?.course?.campus?.name : '';
              return c;
            }),
          );
        });
    }
  }, []);

  useEffect(() => {
    getDataTable().catch(console.error);
  }, [getDataTable]);

  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable();
  };

  const onSubmit = async (dataForm: any) => {};

  const additionalFunction = async (item: any, btn: any) => {
    switch (btn?.action) {
      case 'goToChildrenRemove':
        removeStudent(item);
        break;
      default:
        break;
    }
  };

  const removeStudent = async (item: any) => {
    await props.updateStudent({ courseId: null }, item?.id).then(() => {
      refreshDataTable();
    });
  };

  return (
    <>
      {' '}
      {dataTable !== null ? (
        <>
          <div className="d-flex justify-content-between align-items-center">
            {fromGrade ? (
              <HeaderInfoAcademic
                generic={{ title: 'Grado', value: gradeName }}
                goTitle="Regresar a grados"
              />
            ) : (
              <HeaderInfoAcademic
                generic={{ title: 'Grado / Curso', value: gradeName + ' / ' + courseName }}
                goTitle="Regresar a cursos"
              />
            )}
            {!fromGrade && currentMenu?.readAction ? (
              <Button
                onClick={() => {
                  return setModalOpen(!modalOpen);
                }}
                color="green"
              >
                <i className="iconsminds-add font-1rem mr-2" />
                Vincular Estudiante
              </Button>
            ) : (
              ''
            )}
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
                label: 'Desvincular',
                color: 'danger',
                icon: 'iconsminds-close',
                action: 'goToChildrenRemove',
                hide: !fromGrade && currentMenu?.readAction ? false : true,
              },
            ]}
            withChildren={fromGrade ? false : true}
            refreshDataTable={refreshDataTable}
          />
          {!fromGrade && currentMenu?.readAction ? (
            <StudentAddCourse
              data={data}
              modalOpen={modalOpen}
              toggleModal={() => {
                setData(null);
                refreshDataTable();
                return setModalOpen(!modalOpen);
              }}
              refreshDataTable={refreshDataTable}
              onSubmit={onSubmit}
            />
          ) : (
            ''
          )}
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

export default connect(mapStateToProps, mapDispatchToProps)(StudentCourseList);
