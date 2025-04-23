import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';

import { COLUMN_LIST } from '../../../constants/Menu/menuConstants';
import { createNotification } from '../../../helpers/Notification';
import * as loginActions from '../../../stores/actions/LoginActions';
import * as menuActions from '../../../stores/actions/MenuModelActions';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import { Loader } from '../../common/Loader';
import MenuCreateEdit from './MenuCreateEdit';

const MenuList = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [modalOpen, setModalOpen] = useState(false);

  let navigate = useNavigate();

  const [data, setData] = useState(null);
  useEffect(() => {
    props.getListAllMenu().then((listData: any) => {
      setDataTable(listData);
    });
  }, []);

  const getDataTable = async () => {
    props.getListAllMenu().then((listData: any) => {
      setDataTable(listData);
    });
  };

  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable();
  };

  const onSubmit = async (dataForm: any) => {
    if (data === null) {
      await props.saveNewMenu(dataForm).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          refreshDataTable();
          me();
        }
      });
    } else {
      await props.updateMenu(dataForm, data.id).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          setData(null);
          refreshDataTable();
          me();
        }
      });
    }
  };

  const viewEditData = async (id: any) => {
    await props.dataMenu(id).then((formData: any) => {
      setData(formData.data);
      setModalOpen(true);
    });
  };

  const changeActiveData = async (active: any, id: any) => {
    await props.changeActiveMenu(active, id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteData = async (id: any) => {
    await props.deleteMenu(id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const additionalFunction = async (item: any, btn: any) => {
    switch (btn?.action) {
      case 'goToChildren':
        goToChildren(item.id);
        break;
      default:
        break;
    }
  };

  const goToChildren = async (id: any) => {
    navigate(`/submenus?id=${id}`)
  };

  const me = async () => {
    await props.me().then((dataResp: any) => {
      window.location.reload();
    });
  };

  const deleteAll = async (items: any) => {
    items.map(async (item: any) => {
      await props.deleteMenu(item.id, false).then(
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
      await props.changeActiveMenu(!item.active, item.id, false).then(
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
            additionalFunction={additionalFunction}
            changeActiveDataAll={changeActiveDataAll}
            childrenButtons={
              [
                { id: 0, label: "Submenus", color: "secondary", icon: "simple-icon-link", action: "goToChildren" },
              ]
            }
            withChildren={true}
            refreshDataTable={refreshDataTable}
          />
          <MenuCreateEdit
            isLg={true}
            data={data}
            modalOpen={modalOpen}
            toggleModal={() => {
              setData(null);
              return setModalOpen(!modalOpen);
            }}
            onSubmit={onSubmit}
          >
          </MenuCreateEdit>
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
const mapDispatchToProps = { ...menuActions, ...loginActions };

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuList);
