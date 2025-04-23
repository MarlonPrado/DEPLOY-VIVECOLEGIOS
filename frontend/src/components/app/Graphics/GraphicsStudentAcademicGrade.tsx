import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { COLUMN_LIST } from '../../../constants/Graphics/studentListGradeConstants';
import * as graphicsStudentAcademicGradeActions from '../../../stores/actions/GraphicsStudentAcademicGradeActions';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
/* eslint-disable no-await-in-loop */
import { Loader } from '../../common/Loader';
import GraphicsGrade from './GraphicsGrade';

const GraphicsStudentAcademicGrade = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  let Students: number;

  useEffect(() => {
    props.dataGraphicsStudentAcademicGrade(props?.loginReducer?.schoolId, props?.loginReducer?.schoolYear,).then((listData: any) => {
      Students = listData.reduce((prev: any, next: any) => prev + next.node.countStudent, 0);
      setDataTable(
        listData.map((c: any) => {
          c.node.grade = c.node ? c.node.name : '';
          c.node.students = c.node ? c.node.countStudent : '';
          c.node.percentage = c.node
            ? ((c.node.countStudent * 100) / Students).toFixed(2) + ' %'
            : '';
          return c;
        }),
      );
    });
  }, []);

  const getDataTable = async () => {
    props.dataGraphicsStudentAcademicGrade(props?.loginReducer?.schoolId, props?.loginReducer?.schoolYear,).then((listData: any) => {
      Students = listData.reduce((prev: any, next: any) => prev + next.node.countStudent, 0);
      setDataTable(
        listData.map((c: any) => {
          c.node.grade = c.node ? c.node.name : '';
          c.node.students = c.node ? c.node.countStudent : '';
          c.node.percentage = c.node
            ? ((c.node.countStudent * 100) / Students).toFixed(2) + ' %'
            : '';
          return c;
        }),
      );
    });
  };

  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable();
  };

  return (
    <>
      {' '}
      {dataTable !== null ? (
        <>
          <div className="mt-4 d-flex justify-content-center align-items-center">
            <h1 className="font-bold">Grafica de Estudiantes por Grado</h1>
          </div>
          <GraphicsGrade />
          <DataList data={dataTable} columns={columns} refreshDataTable={refreshDataTable} />
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
const mapDispatchToProps = { ...graphicsStudentAcademicGradeActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(GraphicsStudentAcademicGrade);
