import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react'
import { downloadExcel, DownloadTableExcel, useDownloadExcel } from 'react-export-table-to-excel';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { Badge, Progress } from 'reactstrap';

import { calculateDaysTwoDate, compare, compareOrderAcademicArea } from '../../../helpers/DataTransformations';
import { createNotification } from '../../../helpers/Notification';
import { getInitialsName } from '../../../helpers/Utils';
import * as performanceLevelActions from '../../../stores/actions/Academic/PerformanceLevelActions';
import * as academicAsignatureCouseActions from '../../../stores/actions/AcademicAsignatureCourseActions';
import * as academicPeriodActions from '../../../stores/actions/AcademicPeriodActions';
import * as componentEvaluativeActions from '../../../stores/actions/ComponentEvaluativeActions';
import * as courseActions from '../../../stores/actions/CourseActions';
import * as experienceLearningActions from '../../../stores/actions/ExperienceLearningActions';
import * as experienceLearningCoEvaluationActions from '../../../stores/actions/ExperienceLearningCoEvaluationValuationActions';
import * as experienceLearningSelfActions from '../../../stores/actions/ExperienceLearningSelfAssessmentValuationActions';
import * as experienceLearningTraditionalActions from '../../../stores/actions/ExperienceLearningTraditionalValuationActions';
import * as schoolConfiguarionActions from '../../../stores/actions/SchoolConfigurationActions';
import * as valuationsActions from '../../../stores/actions/ValuationsActions';
import { Colxx } from '../../common/CustomBootstrap';
import HeaderInfoAcademic from '../../common/Data/HeaderInfoAcademic';
import { Loader } from '../../common/Loader';
import { StyledBadge } from '../../styled/BadgeCustom';
import AreaList from '../Academic/Area/AreaList';
import ThumbnailImage from '../Aplications/AplicationsComponents/ThumbnailImage';

const SpreadsheetAccumulatedBehaviour = (props: any) => {

  const [students, setStudents] = useState(null);
  const [performanceLevels, setPerformanceLevels] = useState(null);
  const [performanceLevelType, setPerformanceLevelType] = useState(null);
  const [academicPeriods, setAcademicPeriods] = useState(null);
  const [currentAcademicPeriod, setCurrentAcademicPeriod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormEnabled, setIsFormEnabled] = useState(true);
  const [currentMenu, setCurrentMenu] = useState({
    createAction: false,
    deleteAction: false,
    updateAction: false,
    readAction: false,
    fullAccess: false,
    activateAction: false,
    inactiveAction: false,
  });
  let [valuations, setValuations] = useState(null);
  let [valuationsArea, setValuationsArea] = useState(null);
  let [notes, setNotes] = useState([]);
  let [averages, setAverages] = useState([]);
  let [averagesFinal, setAveragesFinal] = useState([]);
  let [countDownload, setcountDownload] = useState(0);
  const [dateProgress, setDateProgress] = useState({ startDate: null, endDate: null, totalDays: 0, countDays: 0 })
  let [countDigits, setCountDigits] = useState(2);
  const tableRef = useRef();

  let navigate = useNavigate();
  const location = useLocation();
  const history = useNavigate();
  const currentUrl = location.pathname;

  let [params] = useSearchParams();
  const courseId = params.get('courseId');

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  const [data, setData] = useState(null);
  useEffect(() => {
    let { roleMenus } = props.loginReducer;
    let submenus: any = [];
    roleMenus.map((c: any) => {
      return (submenus = submenus.concat(c.menuItemsLogin));
    });
    let cm = submenus.find((c: any) => {
      return currentUrl.includes(c?.module?.url);
    });
    if (cm && cm.readAction) {
      setCurrentMenu(cm);
    } else {
      //history(`/home`);
      createNotification('warning', 'notPermissions', '');
    }
    //props.dataCurrentAcademicPeriod(props?.loginReducer?.schoolId).then(async (period: any) => {
    props.getListAllSchoolConfiguration(props?.loginReducer?.schoolId).then(async (schoolConfigurations: any) => {
      for (let schoolConfiguration of schoolConfigurations) {
        if (schoolConfiguration?.node?.code == "COUNT_DIGITS_PERFORMANCE_LEVEL") {
          setCountDigits(schoolConfiguration?.node?.valueNumber);
        }
      }
    });
    getSpreadsheet();
    //});
  }, []);

  const getSpreadsheet = async () => {
    setLoading(true);
    await props.dataCourse(courseId).then(async (course: any) => {
      setStudents(course?.data?.students.sort(compare));
      let obj: any = [];
      let nts: any = [];
      let ntsArea: any = [];
      let avrgs: any = [];
      let avrgsFinal: any = [];
      let levels: any = [];
      await props
        .getListAllPerformanceLevelCourse(courseId)
        .then((dataLevels: any) => {
          setPerformanceLevels(dataLevels);
          levels = dataLevels;
          setPerformanceLevelType(dataLevels[0]?.node?.type);
        });
      await props.getAcademicPeriodsExperienceLearning(props?.loginReducer?.schoolId,
        props?.loginReducer?.schoolYear).then(async (listData: any) => {
          setAcademicPeriods(listData);
          let promisesListAsignatures: any[] = [];
          let promisesListAreas: any[] = []
          await listData.forEach(async (period: any) => {
            if (period.node.id?.toString()) {

              promisesListAreas.push(
                props
                  .getAllAcademicBehaviourPeriodValuation(period.node.id?.toString(), courseId)
                  .then(async (notesFinal: any) => {
                    if (ntsArea[period.node.id?.toString()] != null) {
                      ntsArea[period.node.id?.toString()] = [...ntsArea[period.node.id?.toString()], ...notesFinal.data.edges];
                    } else {
                      ntsArea[period.node.id?.toString()] = [...notesFinal.data.edges];
                    }
                  })
              );
              promisesListAsignatures.push(
                props
                  .getAllAcademicBehaviourYearValuation(props?.loginReducer?.schoolYear, courseId)
                  .then(async (notesFinal: any) => {
                    nts[0] = [...notesFinal.data.edges];
                  })
              )

            } else {
              setLoading(false);
            }
          });
          await Promise.all(promisesListAreas).then(() => {
            setValuationsArea(ntsArea);
          });
          await Promise.all(promisesListAsignatures).then(() => {
            setValuations(nts);
            setLoading(false);
          });


        });
    });
  };

  const goTo = async () => {
    navigate(-1);
  };

  const download = async () => {
    if (countDownload != 0) {
      onDownload();
    }
    setcountDownload(countDownload + 1)
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'Planilla General',
    sheet: 'Planilla General'
  })

  const recalculateYear = async () => {
    setLoading(true);
    await props.updateAllStudentAcademicBehaviourYearValuation(courseId,
      props?.loginReducer?.schoolYear).then(async (data: any) => {
        getSpreadsheet();
      })
  }

  return (
    <>
      <div className="mt-4 d-flex justify-content-center align-items-center">
        <h1 className="font-bold">Planilla Consolidado Comportamiento</h1>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-center">
        <HeaderInfoAcademic grade course modality goTitle="Regresar a cursos" courseId={courseId} />

        <div className="d-flex justify-content-start align-items-center flex-column" >
          <button
            onClick={download}
            key={"download"}
            className={`ml-1 btn btn-info mb-2`}
            type="button"
          >
            <i className="iconsminds-download"></i> {"Descargar XLS"}
          </button>
          <button
            onClick={recalculateYear}
            key={"download"}
            className={`ml-1 btn btn-danger`}
            type="button"
          >
            <i className="iconsminds-download"></i> {"Recalcular Año"}
          </button>
        </div>
      </div>
      <div className='mb-2' style={{ textAlign: "right" }}>

      </div>
      {loading ? (
        <>
          <Colxx sm={12} className="d-flex justify-content-center">
            <Loader />
          </Colxx>
        </>
      ) : valuationsArea != null ? (
        <>
          {students !== null ? (
            <div style={{ overflow: "scroll", height: "70vh" }}>
              <table className="table table-bordered" ref={tableRef}>
                <thead>
                  <tr>
                    <th rowSpan={2} className="text-center vertical-middle">
                      Código
                    </th>
                    <th rowSpan={2} className="text-center vertical-middle">
                      Estudiante
                    </th>
                    {academicPeriods
                      ? academicPeriods.map((item: any) => {
                        return (
                          <>
                            <th className="text-center vertical-middle"> {item?.node?.name}</th>
                          </>
                        );
                      })
                      : ''}
                    {academicPeriods ?
                      <th className="text-center vertical-middle">Valoracion Final.</th>
                      : ''}
                  </tr>
                </thead>
                <tbody>
                  {students.map((itemStudent: any, index: any) => {
                    let valuationAreaYear = valuations[0]?.filter((itemA: any) => itemA?.node?.studentId == itemStudent?.id)[0];

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
                          {academicPeriods.map((itemPeriod: any) => {
                            let valuationAux = valuationsArea[itemPeriod?.node?.id.toString()]?.filter((itemA: any) => itemA?.node?.studentId == itemStudent?.id && itemA?.node?.academicPeriodId == itemPeriod?.node?.id.toString());
                            let valuation;
                            if (valuationAux?.length > 0) {
                              valuation = valuationAux[0];
                            }
                            return (
                              <>
                                <td className="text-center vertical-middle">
                                  {valuation ?
                                    <>
                                      {performanceLevelType === "QUALITATIVE" ?
                                        <>
                                          <StyledBadge color="primary" className="font-0-8rem" background={valuation?.node?.performanceLevel?.colorHex ? `${valuation?.node?.performanceLevel?.colorHex}` : "#00cafe"}>
                                            {valuation?.node?.performanceLevel?.abbreviation ? valuation?.node?.performanceLevel?.abbreviation : valuation?.node?.performanceLevel?.name}
                                          </StyledBadge>
                                        </> :
                                        <>
                                          {valuation?.node?.assessment?.toFixed(countDigits)}
                                        </>
                                      }
                                    </>
                                    : <>

                                    </>}
                                </td>
                              </>
                            )
                          })}
                          <td className="text-center vertical-middle font-weight-bold">
                            {performanceLevelType === "QUALITATIVE" ?
                              <>
                                <StyledBadge color="primary" className="font-0-8rem pt-2" background={valuationAreaYear?.node?.performanceLevel?.colorHex ? `${valuationAreaYear?.node?.performanceLevel?.colorHex}` : "#00cafe"}>
                                  {valuationAreaYear?.node?.performanceLevel?.abbreviation ? valuationAreaYear?.node?.performanceLevel?.abbreviation : valuationAreaYear?.node?.performanceLevel?.name}
                                </StyledBadge>
                              </> :
                              <>
                                {valuationAreaYear?.node?.assessment?.toFixed(countDigits)}
                              </>
                            }
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
      ) : (
        ''
      )}
    </>
  );
};
const mapDispatchToProps = {
  ...experienceLearningActions,
  ...courseActions,
  ...componentEvaluativeActions,
  ...academicPeriodActions,
  ...valuationsActions,
  ...experienceLearningSelfActions,
  ...experienceLearningCoEvaluationActions,
  ...experienceLearningTraditionalActions,
  ...performanceLevelActions,
  ...academicAsignatureCouseActions,
  ...schoolConfiguarionActions
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(SpreadsheetAccumulatedBehaviour);
