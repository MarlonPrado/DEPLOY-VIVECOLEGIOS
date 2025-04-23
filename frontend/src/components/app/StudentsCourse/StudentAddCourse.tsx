import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import {
  Button,
  Label,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import * as StudentActions from '../../../stores/actions/StudentActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import CreateEditAuditInformation from '../../common/Data/CreateEditAuditInformation';
import FormGroupCustom from '../../common/Data/FormGroupCustom';
import LabelCustom from '../../common/Data/LabelCustom';
import RequiredMessagesCustom from '../../common/Data/RequiredMessagesCustom';
import { Loader } from '../../common/Loader';

const StudentAddCourse = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('student');
  const [searchValue, setSearchValue] = useState('');
  const [studentsList, setStudentsList] = useState([]);
  const [students, setStudents] = useState(null);

  const methods = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  let [params] = useSearchParams();
  const academicGradeId = params.get('gradeId');
  const courseId = params.get('courseId');

  const { handleSubmit, control, register, reset, setValue, formState, trigger } = methods;

  useEffect(() => {
    cleanForm();
    getDropdowns();
    setLoading(false);
  }, [props?.data]);

  const cleanForm = async () => {
    reset();
  };

  const getDropdowns = async () => {
    props.getListAllStudentWithoutCourse(props?.data?.data?.campusId, academicGradeId, props?.loginReducer?.schoolId).then((data: any) => {
      setStudentsList(
        data.map((c: any) => {
          return { label: `${c.node.user.name} ${c.node.user.lastName}`, value: c.node.id, key: c.node.id };
        }),
      );
    });
  };

  const addStudentsCourse = async () => {
    for (const e of students) {
      await props.updateStudent({ courseId: courseId }, e.key).then(() => {
      });
    }
    props.toggleModal();
    setStudents(null);
    getDropdowns();
    props.refreshDataTable();
  };

  const auditInfo = {
    createdAt: props?.data?.id ? props?.data?.createdAt : null,
    updatedAt: props?.data?.id ? props?.data?.createdAt : null,
    createdByStudent: props?.data?.id ? props?.data?.createdByStudent : null,
    updatedByStudent: props?.data?.id ? props?.data?.updatedByStudent : null,
    version: props?.data?.id ? props?.data?.version : null,
  };

  return (
    <>
      {loading ? (
        <>
          <Colxx sm={12} className="d-flex justify-content-center">
            <Loader />
          </Colxx>
        </>
      ) : (
        <>
          <AddNewModal
            modalOpen={props.modalOpen}
            toggleModal={() => {
              cleanForm();
              props.toggleModal();
            }}
            onSubmit={props.onSubmit}
            data={props.data}
            methods={methods}
            control={control}
            handleSubmit={handleSubmit}
            hideFooter={true}
          >
            <ModalBody>
              <FormGroupCustom>
                <LabelCustom id="menu.students" />
                <Select
                  isClearable
                  placeholder={<IntlMessages id="forms.select" />}
                  isMulti
                  className="react-select"
                  classNamePrefix="react-select"
                  options={studentsList}
                  value={students}
                  onChange={(selectedOption: any) => {
                    setStudents(selectedOption);
                  }}
                />
              </FormGroupCustom>
              <div className="form-group d-flex justify-content-center">
                <Button
                  className='text-center'
                  onClick={() => {
                    return addStudentsCourse();
                  }}
                  disabled={students === null || students?.length == 0}
                  color="primary">
                  <i className='iconsminds-add font-1rem mr-2' />
                  Vincular
                </Button>
              </div>
            </ModalBody>
            {props?.data?.id ? (
              <ModalFooter className="p-3">
                <CreateEditAuditInformation loading={loading} auditInfo={auditInfo} />
              </ModalFooter>
            ) : (
              <></>
            )}
          </AddNewModal>
        </>
      )}
    </>
  );
};

const mapDispatchToProps = {
  ...StudentActions,
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentAddCourse);
