import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react'
import { downloadExcel, DownloadTableExcel, useDownloadExcel } from 'react-export-table-to-excel';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip';
import { Badge, Button, Input, Progress } from 'reactstrap';

import { calculateDaysTwoDate, compare, compareOrderAcademicArea, comparePerformanceLevelsTopScore } from '../../../helpers/DataTransformations';
import IntlMessages from '../../../helpers/IntlMessages';
import { createNotification } from '../../../helpers/Notification';
import { getInitialsName } from '../../../helpers/Utils';
import * as performanceLevelActions from '../../../stores/actions/Academic/PerformanceLevelActions';
import * as academicAreaCourseYearValuationActions from '../../../stores/actions/AcademicAreaCourseYearValuationActions';
import * as academicAsignatureCouseActions from '../../../stores/actions/AcademicAsignatureCourseActions';
import * as academicAsignatureCoursYearPeriodValuationActions from '../../../stores/actions/AcademicAsignatureCourseYearValuationActions';
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

const ValuationDefinitivePeriodStudent = (props: any) => {

  const [students, setStudents] = useState(null);
  const [performanceLevels, setPerformanceLevels] = useState(null);
  const [performanceLevelsList, setPerformanceLevelsList] = useState(null);
  const [performanceLevelType, setPerformanceLevelType] = useState(null);
  const [academicPeriods, setAcademicPeriods] = useState(null);
  const [currentAcademicPeriod, setCurrentAcademicPeriod] = useState(null);
  const [asignatures, setAsignatures] = useState(null);
  const [areas, setAreas] = useState(null);
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
  const [min, setMin] = useState(null);
  const [max, setMax] = useState(null);

  let navigate = useNavigate();
  const location = useLocation();
  const history = useNavigate();
  const currentUrl = location.pathname;

  let [params] = useSearchParams();
  const courseId = params.get('courseId');
  const studentId = params.get('studentId');
  const schoolYearId = params.get('schoolYearId');

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  const [data, setData] = useState(null);
  useEffect(() => {
    // let { roleMenus } = props.loginReducer;
    // let submenus: any = [];
    // roleMenus.map((c: any) => {
    //   return (submenus = submenus.concat(c.menuItemsLogin));
    // });
    // let cm = submenus.find((c: any) => {
    //   return currentUrl.includes(c?.module?.url);
    // });
    // if (cm && cm.readAction) {
    //   setCurrentMenu(cm);
    // } else {
    //   history(`/home`);
    //   createNotification('warning', 'notPermissions', '');
    // }
    // props.dataCurrentAcademicPeriod(props?.loginReducer?.schoolId).then(async (period: any) => {
    props.getListAllSchoolConfiguration(props?.loginReducer?.schoolId).then(async (schoolConfigurations: any) => {
      for (let schoolConfiguration of schoolConfigurations) {
        if (schoolConfiguration?.node?.code == "COUNT_DIGITS_PERFORMANCE_LEVEL") {
          setCountDigits(schoolConfiguration?.node?.valueNumber);
        }
      }
    });
    // await setCurrentAcademicPeriod(period);
    // if (period) {
    //   const today = new Date();
    //   const startDate = new Date(period.startDate);
    //   const endDate = new Date(period?.endDate);
    //   const totalDays = calculateDaysTwoDate(startDate, endDate);
    //   let countDays = totalDays;
    //   if (today < endDate && today > startDate) {
    //     countDays = calculateDaysTwoDate(startDate, new Date());
    //   }
    //   setDateProgress({ startDate, endDate, totalDays, countDays })
    // }
    getSpreadsheet(schoolYearId);
    // });
  }, []);

  const getSpreadsheet = async (schoolYearId: any) => {
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
        .getListAllPerformanceLevelCourseFinal(courseId)
        .then((dataLevels: any) => {
          setPerformanceLevels(dataLevels);
          let levelsOrderDesc = levels.sort(comparePerformanceLevelsTopScore);
          setMax(levelsOrderDesc[levelsOrderDesc.length - 1]?.node?.topScore);
          setMin(levelsOrderDesc[0]?.node?.minimumScore);
          levels = dataLevels;
          setPerformanceLevelType(dataLevels[0]?.node?.type);
          setPerformanceLevelsList(
            levels.map((c: any) => {
              return { label: c.node.name, value: c.node.id, key: c.node.id };
            }),
          );
        });
      // await props.getAcademicPeriodsExperienceLearning(props?.loginReducer?.schoolId,
      //   props?.loginReducer?.schoolYear).then(async (listData: any) => {
      //     setAcademicPeriods(listData);
      let promisesListAsignatures: any[] = [];
      let promisesListAreas: any[] = [];
      if (schoolYearId) {
        await props
          .getListAllAcademicAsignatureCourseByCourse(null, courseId)
          .then(async (asignaturesList: any) => {
            setAsignatures(asignaturesList)
            let areasAux: any[] = []
            for (let asignature of asignaturesList) {
              if (asignature?.node?.academicAsignature?.academicArea) {
                areasAux.push(asignature?.node?.academicAsignature?.academicArea);
              }
              promisesListAsignatures.push(
                props
                  .getAllAcademicAsignatureCourseYearValuationStudent(schoolYearId, asignature?.node?.id, studentId)
                  .then(async (notesFinal: any) => {
                    nts[asignature?.node?.id] = notesFinal.data.edges;
                  })
              );
            }
            const ids = areasAux.map(o => o?.id)
            const count: any = {};
            ids.forEach(element => {
              count[element] = (count[element] || 0) + 1;
            });
            let filtered = areasAux.filter(({ id }, index) => !ids.includes(id, index + 1))
            for (let filter of filtered) {
              filter.count = count[filter?.id];
            }
            filtered = filtered.sort(compareOrderAcademicArea);
            setAreas(filtered);
            for (let area of filtered) {
              promisesListAreas.push(
                props
                  .getAllAcademicAreaCourseYearValuationStudent(schoolYearId, area?.id, studentId)
                  .then(async (notesFinal: any) => {
                    ntsArea[area?.id] = notesFinal.data.edges;
                  })
              );
            }
          });
        await Promise.all(promisesListAreas).then(() => {
          setValuationsArea(ntsArea);
        });
        await Promise.all(promisesListAsignatures).then(() => {
          setValuations(nts);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
      // });
    });
  };

  const goTo = async () => {
    navigate(-1);
  };

  const saveBlur = async (item: any, type: any, valuationType: any, assessment: any, performanceLevelId: any) => {
    let data: any = {};
    switch (type) {
      case "AREA":
        switch (valuationType) {
          case "":
            data.academicAreaId = item?.academicAreaId;
            data.schoolYearId = item?.schoolYearId;
            data.assessment = assessment;
            data.studentId = item?.studentId;
            data.valuationType = "DEFINITIVE";
            if (performanceLevelType == "QUALITATIVE") {
              data.performanceLevelId = performanceLevelId;
            } else {
              data.performanceLevelId = await getPerformanceLevel(assessment);
              data.performanceLevelId = data.performanceLevelId?.id;
            }
            if (
              (performanceLevelType != 'QUALITATIVE' && data?.assessment !== null) ||
              performanceLevelType == 'QUALITATIVE'
            ) {
              await props.saveNewAcademicAreaCourseYearValuation(data).then(() => {
                getSpreadsheet(schoolYearId);
              });
            }
            break;
          case "CALCULATE":
            data.academicAreaId = item?.academicAreaId;
            data.schoolYearId = item?.schoolYearId;
            data.assessment = assessment;
            if (performanceLevelType == "QUALITATIVE") {
              data.performanceLevelId = performanceLevelId;
            } else {
              data.performanceLevelId = await getPerformanceLevel(assessment);
              data.performanceLevelId = data.performanceLevelId?.id;
            }
            data.studentId = item?.studentId;
            data.valuationType = 'DEFINITIVE';
            if (
              (performanceLevelType != 'QUALITATIVE' && data?.assessment !== null) ||
              performanceLevelType == 'QUALITATIVE'
            ) {
              await props.saveNewAcademicAreaCourseYearValuation(data).then(() => {
                getSpreadsheet(schoolYearId);
              });
            }
            break;
          case "DEFINITIVE":
            data.academicAreaId = item?.academicAreaId;
            data.schoolYearId = item?.schoolYearId;
            data.assessment = assessment;
            if (performanceLevelType == "QUALITATIVE") {
              data.performanceLevelId = performanceLevelId;
            } else {
              data.performanceLevelId = await getPerformanceLevel(assessment);
              data.performanceLevelId = data.performanceLevelId?.id;
            }
            data.studentId = item?.studentId;
            if (
              (performanceLevelType != 'QUALITATIVE' && data?.assessment !== null) ||
              performanceLevelType == 'QUALITATIVE'
            ) {
              await props.updateAcademicAreaCourseYearValuation(data, item?.id?.toString()).then(() => {
                getSpreadsheet(schoolYearId);
              });
            }
            break;
        }
        break;
      case "ASIGNATURE":
        switch (valuationType) {
          case "":
            data.academicAsignatureCourseId = item?.academicAsignatureCourseId;
            data.schoolYearId = item?.schoolYearId;
            data.assessment = assessment;
            data.studentId = item?.studentId;
            data.valuationType = "DEFINITIVE";
            if (performanceLevelType == "QUALITATIVE") {
              data.performanceLevelId = performanceLevelId;
            } else {
              data.performanceLevelId = await getPerformanceLevel(assessment);
              data.performanceLevelId = data.performanceLevelId?.id;
            }
            if (
              (performanceLevelType != 'QUALITATIVE' && data?.assessment !== null) ||
              performanceLevelType == 'QUALITATIVE'
            ) {
              await props.saveNewAcademicAsignatureCourseYearValuation(data).then(() => {
                getSpreadsheet(schoolYearId);
              });
            }
            break;
          case "CALCULATE":
            data.academicAsignatureCourseId = item?.academicAsignatureCourseId;
            data.schoolYearId = item?.schoolYearId;
            data.assessment = assessment;
            if (performanceLevelType == "QUALITATIVE") {
              data.performanceLevelId = performanceLevelId;
            } else {
              data.performanceLevelId = await getPerformanceLevel(assessment);
              data.performanceLevelId = data.performanceLevelId?.id;
            }
            data.studentId = item?.studentId;
            data.valuationType = 'DEFINITIVE';
            if (
              (performanceLevelType != 'QUALITATIVE' && data?.assessment !== null) ||
              performanceLevelType == 'QUALITATIVE'
            ) {
              await props.saveNewAcademicAsignatureCourseYearValuation(data).then(() => {
                getSpreadsheet(schoolYearId);
              });
            }
            break;
          case "DEFINITIVE":
            data.academicAsignatureCourseId = item?.academicAsignatureCourseId;
            data.schoolYearId = item?.schoolYearId;
            data.assessment = assessment;
            if (performanceLevelType == "QUALITATIVE") {
              data.performanceLevelId = performanceLevelId;
            } else {
              data.performanceLevelId = await getPerformanceLevel(assessment);
              console.log(data.performanceLevelId)
              data.performanceLevelId = data.performanceLevelId?.id;
            }
            data.studentId = item?.studentId;
            if (
              (performanceLevelType != 'QUALITATIVE' && data?.assessment !== null) ||
              performanceLevelType == 'QUALITATIVE'
            ) {
              await props.updateAcademicAsignatureCourseYearValuation(data, item?.id?.toString()).then(() => {
                getSpreadsheet(schoolYearId);
              });
            }
            break;
        }
        break;
    }
  };

  const getPerformanceLevel = async (assesment: any) => {
    let perf = null;
    if (assesment) {
      perf = performanceLevels?.find((c: any) => {
        return assesment < c.node.topScore && assesment >= c.node.minimumScore;
      });
      if (perf === undefined) {
        perf = performanceLevels?.find((c: any) => {
          return assesment <= c.node.topScore && assesment > c.node.minimumScore;
        });
      }
    }
    debugger
    if (perf) {
      console.log(perf)
      return perf.node;
    } else {
      return null;
    }
  };

  return (
    <>
      <div className="mt-4 d-flex justify-content-center align-items-center">
        <h1 className="font-bold">Valoraciones Finales Estudiante</h1>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-center">
        <HeaderInfoAcademic grade course modality student goTitle="Regresar a Estudiantes Curso" courseId={courseId} studentId={studentId} />
      </div>
      <div className='mb-2' style={{ textAlign: "right" }}>
      </div>
      {loading ? (
        <>
          <Colxx sm={12} className="d-flex justify-content-center">
            <Loader />
          </Colxx>
        </>
      ) : valuations != null ? (
        <>
          {students !== null ? (
            <div style={{ overflow: "scroll", height: "70vh" }}>
              <table className="table table-bordered" ref={tableRef}>
                <thead>
                  <tr>
                    <th rowSpan={1} className="text-center vertical-middle">
                      Tipo
                    </th>
                    <th rowSpan={1} className="text-center vertical-middle">
                      Area/Asignatura
                    </th>
                    <th rowSpan={1} className="text-center vertical-middle">
                      Valoración Calculada
                    </th>
                    {performanceLevelType === 'QUANTITATIVE' ?
                      <th rowSpan={1} className="text-center vertical-middle">
                        Nivel de desempeño
                      </th> : <></>
                    }
                    <th rowSpan={1} className="text-center vertical-middle">
                      Valoración Final
                    </th>
                    {performanceLevelType === 'QUANTITATIVE' ?
                      <th rowSpan={1} className="text-center vertical-middle">
                        Nivel de desempeño
                      </th> : <></>
                    }
                    <th rowSpan={1} className="text-center vertical-middle">
                      Cambiar Valoracion Final a:
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {areas?.map((item: any, index: any) => {
                    return (
                      <>
                        <tr>
                          <td className="text-center vertical-middle">
                            {"Area"}
                          </td>
                          <td className="text-center vertical-middle">
                            {item?.name}
                          </td>
                          {students.map((itemStudent: any, index: any) => {
                            let valuationArea = valuationsArea[item?.id]?.filter((itemA: any) => itemA?.node?.studentId == itemStudent?.id);
                            let valuationAreaCalculate;
                            let valuationAreaDefinitive;
                            for (let valuationAreaAux of valuationArea) {
                              switch (valuationAreaAux?.node?.valuationType) {
                                case "CALCULATE":
                                  valuationAreaCalculate = valuationAreaAux;
                                  break;
                                case "DEFINITIVE":
                                  valuationAreaDefinitive = valuationAreaAux;
                                  break;
                              }
                            }
                            let valuationType = valuationAreaDefinitive ? "DEFINITIVE" : valuationAreaCalculate ? "CALCULATE" : "";
                            return (
                              <>
                                {itemStudent?.id?.toString() == studentId ?
                                  <>
                                    {valuationAreaCalculate ?
                                      <>
                                        <td className="text-center vertical-middle">
                                          {performanceLevelType === "QUALITATIVE" ?
                                            <>
                                              <StyledBadge color="primary" className="font-0-8rem" background={valuationAreaCalculate?.node?.performanceLevel?.colorHex ? `${valuationAreaCalculate?.node?.performanceLevel?.colorHex}` : "#00cafe"}>
                                                {valuationAreaCalculate?.node?.performanceLevel?.name}
                                              </StyledBadge>
                                            </> :
                                            <>
                                              {valuationAreaCalculate?.node?.assessment?.toFixed(countDigits)}
                                            </>
                                          }
                                        </td>
                                        {performanceLevelType === 'QUANTITATIVE' ? (
                                          <td className="text-center vertical-middle">
                                            <StyledBadge color="primary" className="font-0-8rem" background={valuationAreaCalculate?.node?.performanceLevel?.colorHex ? `${valuationAreaCalculate?.node?.performanceLevel?.colorHex}` : "#00cafe"}>
                                              {valuationAreaCalculate?.node?.performanceLevel?.name}
                                            </StyledBadge>
                                          </td>
                                        ) : (
                                          <>
                                          </>
                                        )}
                                      </>
                                      : <>
                                        <td></td>
                                        <>
                                          {performanceLevelType === 'QUANTITATIVE' ? (
                                            <td></td>) : (
                                            <>
                                            </>
                                          )}
                                        </>
                                      </>}
                                    {valuationAreaDefinitive ?
                                      <>
                                        <td className="text-center vertical-middle">
                                          {performanceLevelType === "QUALITATIVE" ?
                                            <>
                                              <StyledBadge color="primary" className="font-0-8rem" background={valuationAreaDefinitive?.node?.performanceLevel?.colorHex ? `${valuationAreaDefinitive?.node?.performanceLevel?.colorHex}` : "#00cafe"}>
                                                {valuationAreaDefinitive?.node?.performanceLevel?.name}
                                              </StyledBadge>
                                            </> :
                                            <>
                                              {valuationAreaDefinitive?.node?.assessment?.toFixed(countDigits)}
                                            </>
                                          }
                                        </td>
                                        {performanceLevelType === 'QUANTITATIVE' ? (
                                          <td className="text-center vertical-middle">
                                            <StyledBadge color="primary" className="font-0-8rem" background={valuationAreaDefinitive?.node?.performanceLevel?.colorHex ? `${valuationAreaDefinitive?.node?.performanceLevel?.colorHex}` : "#00cafe"}>
                                              {valuationAreaDefinitive?.node?.performanceLevel?.name}
                                            </StyledBadge>
                                          </td>
                                        ) : (
                                          <>
                                          </>
                                        )}
                                      </>
                                      : <>
                                        <td></td>
                                        <>
                                          {performanceLevelType === 'QUANTITATIVE' ? (
                                            <td></td>) : (
                                            <>
                                            </>
                                          )}
                                        </>
                                      </>}
                                    <td>
                                      {
                                        performanceLevelType === "QUALITATIVE" ?
                                          <Select
                                            //isClearable
                                            placeholder={<IntlMessages id="forms.select" />}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            options={performanceLevelsList}
                                            onChange={(selectedOption: any) => {
                                              let valuation = valuationArea[0]?.node;
                                              if (valuation == null) {
                                                valuation = {};
                                                valuation.studentId = itemStudent?.id;
                                                valuation.schoolYearId = schoolYearId;
                                                valuation.academicAreaId = item?.id;
                                                valuation.assesment = 0;
                                                valuation.valuationType = "DEFINITIVE";
                                                valuation.performanceLevelId = "";
                                              }
                                              saveBlur(valuation, "AREA", valuationType, 0, selectedOption?.key);
                                            }}
                                          /> : performanceLevelType === "QUANTITATIVE" ?
                                            <Input
                                              type="number"
                                              onBlur={(event: any) => {
                                                let valuation = valuationArea[0]?.node;
                                                if (valuation == null) {
                                                  valuation = {};
                                                  valuation.studentId = itemStudent?.id;
                                                  valuation.schoolYearId = schoolYearId;
                                                  valuation.academicAreaId = item?.id;
                                                  valuation.assesment = Number(event?.target?.value);
                                                  valuation.valuationType = "DEFINITIVE";
                                                  valuation.performanceLevelId = "";
                                                }
                                                saveBlur(valuation, "AREA", valuationType, event?.target?.value?.length > 0
                                                  ? Number(event?.target?.value)
                                                  : null, null);
                                              }}
                                              onInput={(e: any) => {
                                                if (e.target.value < min || e.target.value > max) {
                                                  e.target.value = null;
                                                }
                                              }}
                                              {...item?.node?.assessment}
                                              defaultValue={item?.node?.assessment}
                                              className={item?.node?.assessment ? 'border-green form-control' : 'form-control'}
                                            /> : ""
                                      }
                                    </td>
                                  </>
                                  : <></>}
                              </>
                            );
                          })}

                        </tr>
                        {students.map((itemStudent: any, index: any) => {
                          let asignaturesArea = asignatures?.filter((itemV: any) => itemV?.node?.academicAsignature?.academicAreaId == item?.id);
                          return (
                            <>
                              {itemStudent?.id?.toString() == studentId ?
                                <>
                                  {
                                    asignaturesArea?.map((itemAsignature: any, indexe: any) => {
                                      //let valuation = valuations[itemAsignature?.node?.id]?.filter((itemV: any) => itemV?.node?.studentId == itemStudent?.id);
                                      let valuationAsignature = valuations[itemAsignature?.node?.id]?.filter((itemA: any) => itemA?.node?.studentId == itemStudent?.id);
                                      let valuationAsignatureCalculate;
                                      let valuationAsignatureDefinitive;
                                      for (let valuationAsignatureAux of valuationAsignature) {
                                        switch (valuationAsignatureAux?.node?.valuationType) {
                                          case "CALCULATE":
                                            valuationAsignatureCalculate = valuationAsignatureAux;
                                            break;
                                          case "DEFINITIVE":
                                            valuationAsignatureDefinitive = valuationAsignatureAux;
                                            break;
                                        }
                                      }
                                      let valuationType = valuationAsignatureDefinitive ? "DEFINITIVE" : valuationAsignatureCalculate ? "CALCULATE" : "";

                                      return (
                                        <>
                                          <tr>
                                            <td className="text-center vertical-middle">
                                              {"Asignatura"}
                                            </td>
                                            {itemAsignature?.node?.academicAsignature?.academicAreaId === item?.id ?
                                              <td className="text-center vertical-middle">
                                                {itemAsignature?.node?.academicAsignature?.name}
                                              </td>
                                              : <></>}
                                            {valuationAsignatureCalculate ?
                                              <>
                                                <td className="text-center vertical-middle">
                                                  {performanceLevelType === "QUALITATIVE" ?
                                                    <>
                                                      <StyledBadge color="primary" className="font-0-8rem" background={valuationAsignatureCalculate?.node?.performanceLevel?.colorHex ? `${valuationAsignatureCalculate?.node?.performanceLevel?.colorHex}` : "#00cafe"}>
                                                        {valuationAsignatureCalculate?.node?.performanceLevel?.name}
                                                      </StyledBadge>
                                                    </> :
                                                    <>
                                                      {valuationAsignatureCalculate?.node?.assessment?.toFixed(countDigits)}
                                                    </>
                                                  }
                                                </td>
                                                {performanceLevelType === 'QUANTITATIVE' ? (
                                                  <td className="text-center vertical-middle">
                                                    <StyledBadge color="primary" className="font-0-8rem" background={valuationAsignatureCalculate?.node?.performanceLevel?.colorHex ? `${valuationAsignatureCalculate?.node?.performanceLevel?.colorHex}` : "#00cafe"}>
                                                      {valuationAsignatureCalculate?.node?.performanceLevel?.name}
                                                    </StyledBadge>
                                                  </td>
                                                ) : (
                                                  <>
                                                  </>
                                                )}
                                              </>
                                              : <>
                                                <td></td>
                                                <>
                                                  {performanceLevelType === 'QUANTITATIVE' ? (
                                                    <td></td>) : (
                                                    <>
                                                    </>
                                                  )}
                                                </>
                                              </>}
                                            {valuationAsignatureDefinitive ?
                                              <>
                                                <td className="text-center vertical-middle">
                                                  {performanceLevelType === "QUALITATIVE" ?
                                                    <>
                                                      <StyledBadge color="primary" className="font-0-8rem" background={valuationAsignatureDefinitive?.node?.performanceLevel?.colorHex ? `${valuationAsignatureDefinitive?.node?.performanceLevel?.colorHex}` : "#00cafe"}>
                                                        {valuationAsignatureDefinitive?.node?.performanceLevel?.name}
                                                      </StyledBadge>
                                                    </> :
                                                    <>
                                                      {valuationAsignatureDefinitive?.node?.assessment?.toFixed(countDigits)}
                                                    </>
                                                  }
                                                </td>

                                                {performanceLevelType === 'QUANTITATIVE' ? (
                                                  <td className="text-center vertical-middle">
                                                    <StyledBadge color="primary" className="font-0-8rem" background={valuationAsignatureDefinitive?.node?.performanceLevel?.colorHex ? `${valuationAsignatureDefinitive?.node?.performanceLevel?.colorHex}` : "#00cafe"}>
                                                      {valuationAsignatureDefinitive?.node?.performanceLevel?.name}
                                                    </StyledBadge>
                                                  </td>
                                                ) : (
                                                  <>
                                                  </>
                                                )}
                                              </>
                                              : <>
                                                <td></td>
                                                <>
                                                  {performanceLevelType === 'QUANTITATIVE' ? (
                                                    <td></td>) : (
                                                    <>
                                                    </>
                                                  )}
                                                </>
                                              </>}
                                            <td>
                                              {
                                                performanceLevelType === "QUALITATIVE" ?
                                                  <Select
                                                    //isClearable
                                                    placeholder={<IntlMessages id="forms.select" />}
                                                    className="react-select"
                                                    classNamePrefix="react-select"
                                                    options={performanceLevelsList}
                                                    onChange={(selectedOption: any) => {
                                                      //item.node.assessment = undefined;
                                                      //item.node.performanceLevel = { id: selectedOption?.key, name: selectedOption?.label }
                                                      let valuation = valuationAsignature[0]?.node;
                                                      if (valuation == null) {
                                                        valuation = {};
                                                        valuation.studentId = itemStudent?.id;
                                                        valuation.schoolYearId = schoolYearId;
                                                        valuation.academicAsignatureCourseId = itemAsignature?.node?.id;
                                                        valuation.assesment = 0;
                                                        valuation.valuationType = "DEFINITIVE";
                                                        valuation.performanceLevelId = "";
                                                      }
                                                      saveBlur(valuation, "ASIGNATURE", valuationType, 0, selectedOption?.key);
                                                    }}
                                                  /> : performanceLevelType === "QUANTITATIVE" ?
                                                    <Input
                                                      type="number"
                                                      onBlur={(event: any) => {
                                                        let valuation = valuationAsignature[0]?.node;
                                                        if (valuation == null) {
                                                          valuation = {};
                                                          valuation.studentId = itemStudent?.id;
                                                          valuation.schoolYearId = schoolYearId;
                                                          valuation.academicAsignatureCourseId = itemAsignature?.node?.id;
                                                          valuation.assesment = Number(event?.target?.value);
                                                          valuation.valuationType = "DEFINITIVE";
                                                          valuation.performanceLevelId = "";
                                                        }
                                                        saveBlur(valuation, "ASIGNATURE", valuationType, event?.target?.value?.length > 0
                                                          ? Number(event?.target?.value)
                                                          : null, null);
                                                      }}
                                                      onInput={(e: any) => {
                                                        if (e.target.value < min || e.target.value > max) {
                                                          e.target.value = null;
                                                        }
                                                        //return getPerformanceLevel(e, item);
                                                      }}
                                                      {...item?.node?.assessment}
                                                      defaultValue={item?.node?.assessment}
                                                      className={item?.node?.assessment ? 'border-green form-control' : 'form-control'}
                                                    /> : ""
                                              }
                                            </td>
                                          </tr>
                                        </>
                                      );
                                    })
                                  }
                                </>
                                : <></>}
                            </>
                          );
                        })}
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
  ...schoolConfiguarionActions,
  ...academicAreaCourseYearValuationActions,
  ...academicAsignatureCoursYearPeriodValuationActions
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(ValuationDefinitivePeriodStudent);
