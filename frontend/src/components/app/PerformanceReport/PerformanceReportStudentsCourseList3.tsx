/* eslint-disable no-await-in-loop */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Button } from 'reactstrap';

import { COLUMN_LIST } from '../../../constants/Student/studentConstants';
import { compare } from '../../../helpers/DataTransformations';
import { getInitialsName } from '../../../helpers/Utils';
import * as academicPeriodActions from '../../../stores/actions/AcademicPeriodActions';
import * as courseActions from '../../../stores/actions/CourseActions';
import * as experienceLearningActions from '../../../stores/actions/ExperienceLearningActions';
import * as performanceReportActions from '../../../stores/actions/PerformanceReportActions';
import * as studentActions from '../../../stores/actions/StudentActions';
import { urlImages } from '../../../stores/graphql/index';
import { Colxx } from '../../common/CustomBootstrap';
import DataList from '../../common/Data/DataList';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import ThumbnailImage from '../Aplications/AplicationsComponents/ThumbnailImage';

const PerformanceReportStudentCourseList3 = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [academicPeriods, setAcademicPeriods] = useState(null);
  const [students, setStudents] = useState(null);
  const [loading, setLoading] = useState(true);

  let [params] = useSearchParams();
  const courseName = params.get('courseName');
  const gradeName = params.get('gradeName');
  const courseId = params.get('courseId');
  const gradeId = params.get('gradeId');

  useEffect(() => {
    let { roleMenus } = props.loginReducer;
    let submenus: any = [];
    roleMenus.map((c: any) => {
      return submenus = submenus.concat(c.menuItemsLogin);
    });
    setCurrentMenu(submenus.find((c: any) => { return (c?.module?.url == 'student_link_course_permit') }));
    getDataTable();
  }, []);

  const getDataTable = async () => {
    setLoading(true);
    if (courseId) {
      await props.getAcademicPeriodsExperienceLearning(props?.loginReducer?.schoolId,
        props?.loginReducer?.schoolYear).then(async (listData: any) => {
          setAcademicPeriods(listData);
          await props.dataCourse(courseId).then((course: any) => {
            setStudents(course?.data?.students.sort(compare));
            setLoading(false);
          });
        });
    } else {
      setLoading(false);
    }
  };

  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable();
  };

  const generatePerformanceReportCourse3 = async (format: any) => {
    setLoading(true);
    props.generatePerformanceReportCourse3(courseId, props?.loginReducer?.schoolId,
      props?.loginReducer?.schoolYear, format, true).then(async (dataUrl: any) => {
        let alink = document.createElement('a');
        alink.href = urlImages + dataUrl;
        alink.target = "_blank"
        alink.download = 'SamplePDF.pdf';
        setTimeout(() => {
          alink.click();
          setLoading(false);
        }, 5000);
      });
  };

  const generatePerformanceReportCourseStudent3 = async (studentId: any, format: any) => {
    setLoading(true);
    props.generatePerformanceReportCourseStudent3(courseId, props?.loginReducer?.schoolId,
      props?.loginReducer?.schoolYear, studentId, format, true).then(async (dataUrl: any) => {
        let alink = document.createElement('a');
        alink.href = urlImages + dataUrl;
        alink.target = "_blank"
        alink.download = 'SamplePDF.pdf';
        setTimeout(() => {
          alink.click();
          setLoading(false);
        }, 5000);
      });
  };

  return (
    <>
      {' '}
      <>
        <div className='d-flex justify-content-between align-items-center'>
          <HeaderInfoAcademic generic={{ title: 'Grado / Curso', value: gradeName + ' / ' + courseName }} goTitle="Regresar a cursos" />
          <div>
            <div className="d-flex justify-content-start align-items-center" >
              <button
                onClick={() => {
                  return generatePerformanceReportCourse3("Letter");
                  //return getSpreadsheet(item?.node?.id);
                }}
                className={`ml-1 btn btn-info`}
                type="button"
              >
                <i className="iconsminds-download"></i> {'Certificado - Carta'}
              </button>{'  '}
            </div>
            <div className="d-flex justify-content-start align-items-center mt-2" >
              <button
                onClick={() => {
                  return generatePerformanceReportCourse3("Legal");
                  //return getSpreadsheet(item?.node?.id);
                }}
                className={`ml-1 btn btn-info`}
                type="button"
              >
                <i className="iconsminds-download"></i>  {'Certificado - Oficio'}
              </button>{'  '}
            </div>
          </div>
        </div>
        {loading ? (
          <>
            <Colxx sm={12} className="d-flex justify-content-center">
              <Loader />
            </Colxx>
          </>
        ) : students !== null ? (
          <div style={{ overflow: "scroll", height: "70vh" }}>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th rowSpan={1} className="text-center vertical-middle">
                    Código
                  </th>
                  <th rowSpan={1} className="text-center vertical-middle">
                    Estudiante
                  </th>
                  <th
                    colSpan={1}
                    className="text-center vertical-middle"
                  >
                    Certificado
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((itemStudent: any, index: any) => {
                  return (
                    <>
                      <tr key={index}>
                        <td className="text-center vertical-middle">
                          <span className="font-bold">{itemStudent?.code}</span>
                        </td>
                        <td className="text-center vertical-middle">
                          <div className="d-flex align-items-center justify-content-start">
                            {itemStudent?.user?.urlPhoto ? (
                              <ThumbnailImage
                                rounded
                                src={itemStudent?.user?.urlPhoto}
                                alt="profile"
                                className="xsmall mr-3"
                              />
                            ) : (
                              <span className="img-thumbnail md-avatar-initials border-0 span-initials rounded-circle mr-3 list-thumbnail align-self-center xsmall">
                                {getInitialsName(
                                  itemStudent?.user
                                    ? itemStudent?.user?.lastName +
                                    ' ' +
                                    itemStudent?.user?.name
                                    : 'N N',
                                )}
                              </span>
                            )}
                            <span>
                              {itemStudent?.user?.lastName} {itemStudent?.user?.name}
                            </span>
                          </div>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              return generatePerformanceReportCourseStudent3(itemStudent?.id, "Letter");
                              //return getSpreadsheet(item?.node?.id);
                            }}
                            className={`ml-1 btn btn-info`}
                            type="button"
                          >
                            <i className="iconsminds-download"></i> {"Descargar - Carta"}
                          </button>
                          <button
                            onClick={() => {
                              return generatePerformanceReportCourseStudent3(itemStudent?.id, "Legal");
                              //return getSpreadsheet(item?.node?.id);
                            }}
                            className={`ml-1 btn btn-info`}
                            type="button"
                          >
                            <i className="iconsminds-download"></i> {"Descargar - Oficio"}
                          </button>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <></>
        )}
      </>
    </>
  );
};
const mapDispatchToProps = { ...courseActions, ...studentActions, ...academicPeriodActions, ...experienceLearningActions, ...performanceReportActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceReportStudentCourseList3);
