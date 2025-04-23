import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';

import { COLUMN_LIST } from '../../../constants/Teacher/teacherConstants';
import * as teacherActions from '../../../stores/actions/TeacherActions';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import { Loader } from '../../common/Loader';

const AcademicAssignment = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [currentMenu, setCurrentMenu] = useState(null);

  let navigate = useNavigate();

  const [data, setData] = useState(null);
  useEffect(() => {
    let { roleMenus } = props.loginReducer;
    let submenus: any = [];
    roleMenus.map((c: any) => {
      return submenus = submenus.concat(c.menuItemsLogin);
    });
    //setCurrentMenu(submenus.find((c: any) => { return (c?.module?.url == 'academicAssignment') }));
    if (props?.loginReducer?.campusId) {
      props.getListAllTeacher(props?.loginReducer?.campusId, props?.loginReducer?.schoolId, props?.loginReducer?.schoolYear).then((listData: any) => {
        setDataTable(
          listData.map((c: any) => {
            c.node.name = c.node.user ? c.node.user.name : '';
            c.node.lastName = c.node.user ? c.node.user.lastName : '';
            c.node.phone = c.node.user ? c.node.user.phone : '';
            c.node.email = c.node.user ? c.node.user.email : '';
            c.node.documentNumber = c.node.user ? c.node.user.documentNumber : '';
            return c;
          }),
        );
      });
    } else {
      props.getListAllTeacherOnlySchool(props?.loginReducer?.schoolId, props?.loginReducer?.schoolYear).then((listData: any) => {
        setDataTable(
          listData.map((c: any) => {
            c.node.name = c.node.user ? c.node.user.name : '';
            c.node.lastName = c.node.user ? c.node.user.lastName : '';
            c.node.phone = c.node.user ? c.node.user.phone : '';
            c.node.email = c.node.user ? c.node.user.email : '';
            c.node.documentNumber = c.node.user ? c.node.user.documentNumber : '';
            return c;
          }),
        );
      });
    }
  }, []);

  const getDataTable = async () => {
    if (props?.loginReducer?.campusId) {
      props.getListAllTeacher(props?.loginReducer?.campusId, props?.loginReducer?.schoolId, props?.loginReducer?.schoolYear).then((listData: any) => {
        setDataTable(
          listData.map((c: any) => {
            c.node.name = c.node.user ? c.node.user.name : '';
            c.node.lastName = c.node.user ? c.node.user.lastName : '';
            c.node.phone = c.node.user ? c.node.user.phone : '';
            c.node.email = c.node.user ? c.node.user.email : '';
            c.node.documentNumber = c.node.user ? c.node.user.documentNumber : '';
            return c;
          }),
        );
      });
    } else {
      props.getListAllTeacherOnlySchool(props?.loginReducer?.schoolId, props?.loginReducer?.schoolYear).then((listData: any) => {
        setDataTable(
          listData.map((c: any) => {
            c.node.name = c.node.user ? c.node.user.name : '';
            c.node.lastName = c.node.user ? c.node.user.lastName : '';
            c.node.phone = c.node.user ? c.node.user.phone : '';
            c.node.email = c.node.user ? c.node.user.email : '';
            c.node.documentNumber = c.node.user ? c.node.user.documentNumber : '';
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

  const additionalFunction = async (item: any, btn: any) => {
    switch (btn?.action) {
      case 'goToAcademicAssignmentTeacher':
        goToChildren(
          `/academicAssignmentTeacher?teacherId=${item?.id}`,
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
          <DataList
            data={dataTable}
            columns={columns}
            match={props?.match}
            additionalFunction={additionalFunction}
            childrenButtons={[
              {
                id: 0,
                label: 'Asignacion Academica',
                color: 'success',
                icon: 'iconsminds-notepad',
                action: 'goToAcademicAssignmentTeacher',
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

const mapDispatchToProps = { ...teacherActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(AcademicAssignment);