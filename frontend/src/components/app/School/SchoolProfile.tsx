import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Badge, Button, Card, CardBody, FormGroup, Input, InputGroup, Label, Row } from 'reactstrap';

import BannerImg from '../../../assets/img/logos/banner.png';
import SchoolProfileImg from '../../../assets/img/profiles/empty.png';
import IntlMessages from '../../../helpers/IntlMessages';
import * as loginActions from '../../../stores/actions/LoginActions';
import * as userActions from '../../../stores/actions/UserActions';
import * as schoolActions from '../../../stores/actions/SchoolActions';
import { urlImages } from '../../../stores/graphql/index';
import { Colxx } from '../../common/CustomBootstrap';
import FormGroupCustom from '../../common/Data/FormGroupCustom';
import LabelCustom from '../../common/Data/LabelCustom';
import RequiredMessagesCustom from '../../common/Data/RequiredMessagesCustom';
import SingleLightbox from '../../common/layout/pages/SingleLightbox';
import { Loader } from '../../common/Loader';

const SchoolProfile = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [school, setSchool] = useState(null);

  const methods = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, control, register, reset, setValue, formState, trigger, getValues } = methods;

  useEffect(() => {
    getSchool();
    setLoading(false);
  }, []);

  const getSchool = async () => {
    props.dataSchool(props?.loginReducer?.schoolId).then((resp: any) => {
      setSchool(resp.data);
      setValue('name', resp?.data?.name);
      setValue('daneCode', resp?.data?.daneCode);
      setValue('textResolution', resp?.data?.textResolution);
      setValue('textAddress', resp?.data?.textAddress);
      setValue('textDaneNit', resp?.data?.textDaneNit);
      setValue('textPrincipalSignature', resp?.data?.textPrincipalSignature);
    });
  };

  const uploadLogo = async (file: any) => {
    props.uploadLogo(file, props?.loginReducer?.schoolId).then((resp: any) => {
      //getUser();
      //me();
      getSchool();
    });
  };

  const uploadImgPrincipalSignature = async (file: any) => {
    props.uploadImgPrincipalSignature(file, props?.loginReducer?.schoolId).then((resp: any) => {
      //getUser();
      //me();
      getSchool();
    });
  };

  const uploadImgSecretarySignature = async (file: any) => {
    props.uploadImgSecretarySignature(file, props?.loginReducer?.schoolId).then((resp: any) => {
      //getUser();
      //me();
      getSchool();
    });
  };

  const updateSchool = async () => {
    console.log(methods.getValues());
    props.updateSchool(methods.getValues(), props?.loginReducer?.schoolId).then((resp: any) => {
      getSchool();
    });
  };

  const updateSchoolDeleteImgPrincipalSignature = async () => {
    setValue('imgPrincipalSignature', null);
    props.updateSchool(methods.getValues(), props?.loginReducer?.schoolId).then((resp: any) => {
      getSchool();
    });
  };

  const updateSchoolDeleteImgSecretarySignature = async () => {
    setValue('imgSecretarySignature', null);
    props.updateSchool(methods.getValues(), props?.loginReducer?.schoolId).then((resp: any) => {
      getSchool();
    });
  };

  const me = async () => {
    await props.me().then((dataResp: any) => { });
  };

  return (
    <>
      {loading && school == null ? (
        <>
          <Colxx sm={12} className="d-flex justify-content-center">
            <Loader />
          </Colxx>
        </>
      ) : (
        <>
          <Row>
            <Colxx xxs="12" className="mb-5">
              <Card>
                <SingleLightbox
                  thumb={BannerImg}
                  large={BannerImg}
                  className="social-header h-250 card-img"
                />
              </Card>
            </Colxx>
            <Colxx xxs="12" lg="5" xl="4" className="col-left">
              <SingleLightbox
                id="1"
                thumb={school?.logo ? urlImages + school?.logo : SchoolProfileImg}
                large={school?.logo ? urlImages + school?.logo : SchoolProfileImg}
                className="img-thumbnail card-img social-profile-img"
              />
              <Card>
                <CardBody className="pb-0">
                  <div className="text-center pt-4 mb-4 mt-4">
                    <Badge color="primary font-0-8rem" pill>
                      {'Escudo Institución Educativa'}
                    </Badge>
                  </div>
                  <InputGroup className="mb-3">
                    <Input
                      type="file"
                      id="exampleCustomFileBrowser2"
                      name="customFile"
                      onChange={(e) => uploadLogo(e.target.files[0])}
                    />
                  </InputGroup>
                  <small>
                    *El escudo se cargará automaticamente una vez sea seleccionada*
                  </small>
                  <hr />
                </CardBody>
              </Card>
            </Colxx>
            <Colxx xxs="12" lg="7" xl="8" className="col-right">
              <Card className="mb-4">
                <CardBody>
                  <FormGroupCustom>
                    <LabelCustom id="forms.name" required={true} />
                    <Input className="form-control" defaultValue={school?.name} onChange={(data) => {
                      setValue('name', data.target.value);
                    }} />
                    <RequiredMessagesCustom formState={formState} register={"name"} />
                  </FormGroupCustom>
                  <FormGroupCustom>
                    <LabelCustom id="forms.daneCode" required={true} />
                    <Input className="form-control" defaultValue={school?.daneCode} onChange={(data) => {
                      setValue('daneCode', data.target.value);
                    }} />
                    <RequiredMessagesCustom formState={formState} register={"daneCode"} />
                  </FormGroupCustom>
                  <FormGroupCustom>
                    <LabelCustom id="forms.textResolution" required={true} />
                    <Input className="form-control" defaultValue={school?.textResolution} onChange={(data) => {
                      setValue('textResolution', data.target.value);
                    }} />
                    <RequiredMessagesCustom formState={formState} register={"textResolution"} />
                  </FormGroupCustom>
                  <FormGroupCustom>
                    <LabelCustom id="forms.textAddress" required={true} />
                    <Input className="form-control" defaultValue={school?.textAddress} onChange={(data) => {
                      setValue('textAddress', data.target.value);
                    }} />
                    <RequiredMessagesCustom formState={formState} register={"textAddress"} />
                  </FormGroupCustom>
                  <FormGroupCustom>
                    <LabelCustom id="forms.textDaneNit" required={true} />
                    <Input className="form-control" defaultValue={school?.textDaneNit} onChange={(data) => {
                      setValue('textDaneNit', data.target.value);
                    }} />
                    <RequiredMessagesCustom formState={formState} register={"textDaneNit"} />
                  </FormGroupCustom>
                  <FormGroupCustom>
                    <LabelCustom id="forms.textPrincipalSignature" required={true} />
                    <Input className="form-control" defaultValue={school?.textPrincipalSignature} onChange={(data) => {
                      setValue('textPrincipalSignature', data.target.value);
                    }} />
                    <RequiredMessagesCustom formState={formState} register={"textPrincipalSignature"} />
                  </FormGroupCustom>
                  <FormGroupCustom>
                    <LabelCustom id="forms.textSecretarySignature" required={true} />
                    <Input className="form-control" defaultValue={school?.textSecretarySignature} onChange={(data) => {
                      setValue('textSecretarySignature', data.target.value);
                    }} />
                    <RequiredMessagesCustom formState={formState} register={"textSecretarySignature"} />
                  </FormGroupCustom>
                  <Button
                    color="primary"
                    className={`mb-5 mt-5 btn-primary btn-shadow`}
                    size="lg"
                    type="submit"
                    onClick={updateSchool}
                  >
                    Actualizar
                  </Button>
                </CardBody>
              </Card>
            </Colxx>
            <Colxx xxs="12" lg="5" xl="4" className="col-left" style={{ marginTop: "-50vh" }}>
              <SingleLightbox
                id="2"
                thumb={school?.imgPrincipalSignature ? urlImages + school?.imgPrincipalSignature : SchoolProfileImg}
                large={school?.imgPrincipalSignature ? urlImages + school?.imgPrincipalSignature : SchoolProfileImg}
                className="img-thumbnail card-img social-profile-img"
              />
              <Card>
                <CardBody className="pb-0">
                  <div className="text-center pt-4 mb-4 mt-2">
                    <Badge color="primary font-0-8rem" pill>
                      {'Firma Directivo Principal'}
                    </Badge>
                    <Button
                      color="danger"
                      className={`ml-2 btn-shadow`}
                      size="xs"
                      type="submit"
                      onClick={updateSchoolDeleteImgPrincipalSignature}
                    >
                      Eliminar Firma
                    </Button>
                  </div>
                  <InputGroup className="mb-3">
                    <Input
                      type="file"
                      id="exampleCustomFileBrowser2"
                      name="customFile"
                      onChange={(e) => uploadImgPrincipalSignature(e.target.files[0])}
                    />
                  </InputGroup>
                  <small>
                    *La firma se cargará automaticamente una vez sea seleccionada*
                  </small>
                  <hr />
                </CardBody>
              </Card>
            </Colxx>
          </Row>
          <Row>
            <Colxx xxs="12" lg="5" xl="4" className="col-left" style={{ marginTop: "-10vh" }}>
              <SingleLightbox
                id="3"
                thumb={school?.imgSecretarySignature ? urlImages + school?.imgSecretarySignature : SchoolProfileImg}
                large={school?.imgSecretarySignature ? urlImages + school?.imgSecretarySignature : SchoolProfileImg}
                className="img-thumbnail card-img social-profile-img"
              />
              <Card>
                <CardBody className="pb-0">
                  <div className="text-center pt-4 mb-4 mt-2">
                    <Badge color="primary font-0-8rem" pill>
                      {'Firma Auxiliar Administrativo/Secretario(a)'}
                    </Badge>
                    <Button
                      color="danger"
                      className={`mt-2 btn-shadow`}
                      size="xs"
                      type="submit"
                      onClick={updateSchoolDeleteImgSecretarySignature}
                    >
                      Eliminar Firma
                    </Button>
                  </div>
                  <InputGroup className="mb-3">
                    <Input
                      type="file"
                      id="exampleCustomFileBrowser3"
                      name="customFile"
                      onChange={(e) => uploadImgSecretarySignature(e.target.files[0])}
                    />
                  </InputGroup>
                  <small>
                    *La firma se cargará automaticamente una vez sea seleccionada*
                  </small>
                  <hr />
                </CardBody>
              </Card>
            </Colxx>
          </Row>
        </>
      )}
    </>
  );
};

const mapDispatchToProps = { ...loginActions, ...schoolActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(SchoolProfile);
