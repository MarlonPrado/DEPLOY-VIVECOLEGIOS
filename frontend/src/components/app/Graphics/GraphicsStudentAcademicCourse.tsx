import React, { useEffect, useState } from 'react';
/* eslint-disable no-await-in-loop */
import { connect } from 'react-redux';
import Select from 'react-select';
import { COLUMN_LIST } from '../../../constants/Graphics/studentListCourseConstants';
import * as graphicsStudentAcademicCourseActions from '../../../stores/actions/GraphicsStudentAcademicCourseActions';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import FormGroupCustom from '../../common/Data/FormGroupCustom';
import LabelCustom from '../../common/Data/LabelCustom';
import { Loader } from '../../common/Loader';
import GraphicsCourse from './GraphicsCourse';

const GraphicsStudentAcademicCourse = (props: any) => {
  const [gradeList, setGradesList] = useState(null);
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [grade, setGrade] = useState(null);
  const [label, setLabel] = useState(null);
  let Students: number;

  useEffect(() => {
    props
      .getDropdownsGraphicsStudentAcademicCourse(props?.loginReducer?.schoolId, props?.loginReducer?.schoolYear)
      .then((data: any) => {
        setGradesList(
          data.dataGrades.edges.map((c: any) => {
            return { label: c.node.name, value: c.node.id, key: c.node.id };
          }),
        );
      });
  }, []);

  const getDataTable = async (schoolId: any, academicGradeId: any) => {
    props.dataGraphicsStudentAcademicCourse(schoolId, academicGradeId).then((listData: any) => {
      Students = listData.reduce((prev: any, next: any) => prev + next.node.countStudent, 0);
      setDataTable(
        listData.map((c: any) => {
          c.node.course = c.node ? c.node.name + ' - ' + c.node.campus.name : '';
          c.node.students = c.node ? c.node.countStudent : '';
          c.node.percentage = c.node
            ? ((c.node.countStudent * 100) / Students).toFixed(2) + ' %'
            : '';
          return c;
        }),
      );
    });
  };

  const getCourses = async (academicGradeId: any, academicLabel: any) => {
    if (academicGradeId) {
      setDataTable(null);
      setGrade(academicGradeId);
      setLabel(academicLabel);
      await getDataTable(props?.loginReducer?.schoolId, academicGradeId);
    }
  };

  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable(props?.loginReducer?.schoolId, grade);
  };

  return (
    <>
      {' '}
      <div className="mt-4 d-flex justify-content-center align-items-center">
        <h1 className="font-bold">Grafica de Estudiantes por Grado {label}</h1>
      </div>
      <FormGroupCustom>
        <LabelCustom id="forms.grade" required={true} />
        <Select
          isClearable
          className="react-select"
          classNamePrefix="react-select"
          options={gradeList}
          value={grade}
          onChange={(selectedOption) => {
            getCourses(selectedOption?.key, selectedOption?.label);
          }}
        />
      </FormGroupCustom>
      {dataTable !== null ? (
        <>
          <GraphicsCourse data={grade} />
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
const mapDispatchToProps = { ...graphicsStudentAcademicCourseActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(GraphicsStudentAcademicCourse);
