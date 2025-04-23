import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { COLUMN_LIST } from '../../../../constants/Asignature/asignatureConstants';
import { createNotification } from '../../../../helpers/Notification';
import * as asignatureActions from '../../../../stores/actions/Academic/AsignatureActions';
import { Colxx } from '../../../common/CustomBootstrap';
import DataList from '../../../common/Data/DataList';
import HeaderInfoAcademic from '../../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../../common/Loader';
import AsignatureCreateEdit from './AsignatureCreateEdit';
import { useLocation } from 'react-router';
import { permissionsMenu } from '../../../../helpers/DataTransformations';

const AsignatureList = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [modalOpen, setModalOpen] = useState(false);

  let [params] = useSearchParams();
  const areaName = params.get('areaName');

  const [data, setData] = useState(null);
  const location = useLocation();

  const getDataTable = useCallback(async () => {
    const areaId = params.get('id');
    let permissions = permissionsMenu(props?.loginReducer, location.pathname);
    props.getListAllAcademicAsignature(props?.loginReducer?.schoolId, areaId ? areaId : '', props?.loginReducer?.schoolYear, permissions.fullAccess).then((listData: any) => {
      setDataTable(listData.map((c: any) => {
        c.node.generalAsignature_format = c.node.generalAcademicAsignature ? c.node.generalAcademicAsignature.name : '';
        return c;
      }));
    });
  }, [])

  useEffect(() => {
    getDataTable()
      .catch(console.error);;
  }, [getDataTable]);

  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable();
  };

  const onSubmit = async (dataForm: any) => {
    if (data === null) {
      await props.saveNewAsignature(dataForm).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          refreshDataTable();
        }
      });
    } else {
      await props.updateAsignature(dataForm, data.id).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          setData(null);
          refreshDataTable();
        }
      });
    }
  };

  const viewEditData = async (id: any) => {
    await props.dataAsignature(id).then((formData: any) => {
      setData(formData.data);
      setModalOpen(true);
    });
  };

  const changeActiveData = async (active: any, id: any) => {
    await props.changeActiveAsignature(active, id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteData = async (id: any) => {
    await props.deleteAsignature(id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteAll = async (items: any) => {
    items.map(async (item: any) => {
      await props.deleteAsignature(item.id, false).then(
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
      await props.changeActiveAsignature(!item.active, item.id, false).then(
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
          <HeaderInfoAcademic generic={{ title: 'Área', value: areaName }} goTitle="Regresar a áreas" />
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
            refreshDataTable={refreshDataTable}
          />
          <AsignatureCreateEdit
            data={data}
            modalOpen={modalOpen}
            toggleModal={() => {
              setData(null);
              refreshDataTable();
              return setModalOpen(!modalOpen);
            }}
            onSubmit={onSubmit}
          >
          </AsignatureCreateEdit>
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
const mapDispatchToProps = { ...asignatureActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(AsignatureList);
