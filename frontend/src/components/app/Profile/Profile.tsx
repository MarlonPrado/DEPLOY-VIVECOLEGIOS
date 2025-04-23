import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Badge, Button, Card, CardBody, FormGroup, Input, InputGroup, Label, Row } from 'reactstrap';

import BannerImg from '../../../assets/img/logos/banner.png';
import ProfileImg from '../../../assets/img/profiles/empty.png';
import IntlMessages from '../../../helpers/IntlMessages';
import * as loginActions from '../../../stores/actions/LoginActions';
import * as userActions from '../../../stores/actions/UserActions';
import { urlImages } from '../../../stores/graphql/index';
import { Colxx } from '../../common/CustomBootstrap';
import FormGroupCustom from '../../common/Data/FormGroupCustom';
import LabelCustom from '../../common/Data/LabelCustom';
import RequiredMessagesCustom from '../../common/Data/RequiredMessagesCustom';
import SingleLightbox from '../../common/layout/pages/SingleLightbox';
import { Loader } from '../../common/Loader';

const Profile = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState(null);
  const { register, getValues, formState } = useForm();

  const [documentTypesList, setDocumentTypesList] = useState(null);
  const [gendersList, setGendersList] = useState(null);
  const [birtdate, setBirtdate] = useState(null);
  const [gender, setGender] = useState(null);
  const [documentType, setDocumentType] = useState(null);
  const [newUser, setNewUser] = useState({
    name: undefined,
    lastName: undefined,
    phone: undefined,
    email: undefined,
    documentNumber: undefined,
    genderId: undefined,
    documentTypeId: undefined,
  });

  const methods = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const { setValue } = methods;

  useEffect(() => {
    getUser();
    getDropdowns();
    setLoading(false);
  }, [props?.data]);

  useEffect(() => {
    if (user) {
      if (user !== undefined && user != null) {
        setNewUser({
          name: user?.name,
          lastName: user?.lastName,
          phone: user?.phone,
          email: user?.email,
          documentNumber: user?.documentNumber,
          genderId: user?.genderId,
          documentTypeId: user?.documentTypeId,
        });
      }
      if (user && user?.birthdate !== undefined && user?.birthdate != null) {
        setBirtdate(new Date(user?.birthdate));
      }
      if (user && user?.gender !== undefined && user?.gender != null) {
        setGender({
          key: user?.gender?.id,
          label: user?.gender?.name,
          value: user?.gender?.id,
        });
      }
      if (user && user?.documentType !== undefined && user?.documentType != null) {
        setDocumentType({
          key: user?.documentType?.id,
          label: user?.documentType?.name,
          value: user?.documentType?.id,
        });
      }
      register('newUser', {
        required: true,
        value: newUser,
      });
    }
  }, [user]);

  const getUser = async () => {
    props.dataUser(props?.loginReducer?.userId).then((resp: any) => {
      setUser(resp.data);
    });
  };

  const uploadFileImage = async (file: any) => {
    props.updateProfilePhotoUser(file, props?.loginReducer?.userId).then((resp: any) => {
      getUser();
      me();
    });
  };

  const updatePassword = async () => {
    props
      .changePasswordUser(getValues().password, props?.loginReducer?.userId)
      .then((resp: any) => {
        getUser();
      });
  };

  const updateUser = async () => {
    props.updateUser(newUser, props?.loginReducer?.userId).then((resp: any) => {
      getUser();
    });
  };

  const validatePasswordsMatch = async (e: any, compare: any, type: string) => {
    if (e.target.value !== compare) {
      setErrors({
        password_repeat: 'Las contraseñas no coinciden',
        password: 'Las contraseñas no coinciden',
      });
    } else if (e.target.value.length == 0 || (e.target.value.length < 7 && type == 'password')) {
      setErrors({ password: 'La contraseña debe tener minimo 7 caractéres' });
    } else if (e.target.value.length == 0 || (e.target.value.length < 7 && type != 'password')) {
      setErrors({ password_repeat: 'La contraseña debe tener minimo 7 caractéres' });
    } else {
      setErrors(null);
      return;
    }
  };

  const me = async () => {
    await props.me().then((dataResp: any) => { });
  };

  const { ref: passwordRef, ...passwordRest } = register('password', {
    required: true,
    value: props?.data?.id ? props?.data?.password : '',
  });
  const { ref: passwordRepeatRef, ...passwordRepeatRest } = register('password_repeat', {
    required: true,
    value: props?.data?.id ? props?.data?.password_repeat : '',
  });

  const getDropdowns = async () => {
    props.getDropdownsUser().then((data: any) => {
      setGendersList(
        data.dataGenders.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
      setDocumentTypesList(
        data.dataDocumentTypes.edges.map((c: any) => {
          return { label: c.node.name, value: c.node.id, key: c.node.id };
        }),
      );
    });
  };

  const uploadImgSignature = async (file: any) => {
    props.uploadImgSignature(file, props?.loginReducer?.userId).then((resp: any) => {
      getUser();
      //me();
    });
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
                thumb={user?.profilePhoto ? urlImages + user?.profilePhoto : ProfileImg}
                large={user?.profilePhoto ? urlImages + user?.profilePhoto : ProfileImg}
                className="img-thumbnail card-img social-profile-img"
              />
              <Card>
                <CardBody className="pb-0">
                  <div className="text-center pt-4 mb-4 mt-4">
                    <p className="pt-2 mb-1 font-1-5rem">
                      <strong>
                        {user ? user.name : ''} {user ? user.lastName : ''}
                      </strong>
                    </p>
                    <p className="text-muted mb-2 font-1rem">{user ? user.email : ''}</p>
                    <Badge color="primary font-0-8rem" pill>
                      {user ? user.role.name : ''}
                    </Badge>
                  </div>
                  <InputGroup className="mb-3">
                    <Input
                      type="file"
                      id="exampleCustomFileBrowser2"
                      name="customFile"
                      onChange={(e) => uploadFileImage(e.target.files[0])}
                    />
                  </InputGroup>
                  <small>
                    *La foto de perfil se cargará automaticamente una vez sea seleccionada*
                  </small>
                  <hr />
                </CardBody>
                <CardBody className="text-center pt-0">
                  <div className="text-center pt-4 mb-4 mt-3">
                    <p className="pt-2 mb-1 font-1-5rem">
                      <strong>Cambiar contraseña</strong>
                    </p>
                  </div>
                  <FormGroup className="form-group has-float-label">
                    <Label>Contraseña</Label>
                    <Input
                      onInput={(e) =>
                        validatePasswordsMatch(e, getValues('password_repeat'), 'password')
                      }
                      type="password"
                      {...passwordRest}
                      innerRef={passwordRef}
                      className="form-control"
                    />
                    {errors?.password && (
                      <div className="invalid-feedback d-block">{errors?.password}</div>
                    )}
                  </FormGroup>
                  <FormGroup className="form-group has-float-label">
                    <Label>Repetir contraseña</Label>
                    <Input
                      onInput={(e) =>
                        validatePasswordsMatch(e, getValues('password'), 'password_repeat')
                      }
                      type="password"
                      {...passwordRepeatRest}
                      innerRef={passwordRepeatRef}
                      className="form-control"
                    />
                    {errors?.password_repeat && (
                      <div className="invalid-feedback d-block">{errors?.password_repeat}</div>
                    )}
                  </FormGroup>
                  <Button
                    color="primary"
                    className={`mb-5 mt-5 btn-login btn-shadow`}
                    size="lg"
                    type="submit"
                    disabled={errors || !getValues('password') || !getValues('password_repeat')}
                    onClick={updatePassword}
                  >
                    {' '}
                    Guardar
                  </Button>
                </CardBody>
              </Card>
            </Colxx>
            <Colxx xxs="12" lg="7" xl="8" className="col-right">
              <Card className="mb-4">
                <CardBody>
                  <FormGroupCustom>
                    <LabelCustom id="forms.name" required={true} />
                    <Input
                      name="name"
                      defaultValue={newUser.name}
                      onChange={(data) => {
                        setValue('newUser', { ...newUser, ...{ name: data.target.value } });
                        setNewUser({ ...newUser, ...{ name: data.target.value } });
                      }}
                    />
                    <RequiredMessagesCustom formState={formState} register={'name'} />
                  </FormGroupCustom>
                  <FormGroupCustom>
                    <LabelCustom id="forms.lastname" required={true} />
                    <Input
                      name="lastName"
                      defaultValue={newUser.lastName}
                      onChange={(data) => {
                        setValue('newUser', { ...newUser, ...{ lastName: data.target.value } });
                        setNewUser({ ...newUser, ...{ lastName: data.target.value } });
                      }}
                    />
                    <RequiredMessagesCustom formState={formState} register={'lastName'} />
                  </FormGroupCustom>
                  <FormGroupCustom>
                    <LabelCustom id="forms.phone" required={false} />
                    <Input
                      name="phone"
                      defaultValue={newUser.phone}
                      onChange={(data) => {
                        setValue('newUser', { ...newUser, ...{ phone: data.target.value } });
                        setNewUser({ ...newUser, ...{ phone: data.target.value } });
                      }}
                    />
                  </FormGroupCustom>
                  <FormGroupCustom>
                    <LabelCustom id="forms.email" required={false} />
                    <Input
                      name="email"
                      defaultValue={newUser.email}
                      onChange={(data) => {
                        setValue('newUser', { ...newUser, ...{ email: data.target.value } });
                        setNewUser({ ...newUser, ...{ email: data.target.value } });
                      }}
                    />
                  </FormGroupCustom>
                  <FormGroupCustom>
                    <LabelCustom id="forms.birthdate" required={false} />
                    <ReactDatePicker
                      selected={birtdate}
                      onChange={(date) => {
                        setValue('newUser', { ...newUser, ...{ birthdate: date as Date } });
                        setNewUser({ ...newUser, ...{ birthdate: date as Date } });
                        setBirtdate(date as Date);
                      }}
                    />
                  </FormGroupCustom>
                  <FormGroupCustom>
                    <LabelCustom id="forms.gender" required={true} />
                    <Select
                      isClearable
                      placeholder={<IntlMessages id="forms.select" />}
                      className="react-select"
                      classNamePrefix="react-select"
                      options={gendersList}
                      value={gender}
                      onChange={(selectedOption: any) => {
                        newUser.genderId = selectedOption?.key;
                        setValue('newUser', { ...newUser });
                        setGender(selectedOption);
                      }}
                    />
                    <RequiredMessagesCustom formState={formState} register={'gender'} />
                  </FormGroupCustom>
                  <FormGroupCustom>
                    <LabelCustom id="forms.documentType" required={true} />
                    <Select
                      isClearable
                      placeholder={<IntlMessages id="forms.select" />}
                      className="react-select"
                      classNamePrefix="react-select"
                      options={documentTypesList}
                      value={documentType}
                      onChange={(selectedOption: any) => {
                        newUser.documentTypeId = selectedOption?.key;
                        setValue('newUser', { ...newUser });
                        setDocumentType(selectedOption);
                      }}
                    />
                    <RequiredMessagesCustom formState={formState} register={'documentType'} />
                  </FormGroupCustom>
                  <FormGroupCustom>
                    <LabelCustom id="forms.documentNumber" required={true} />
                    <Input
                      name="documentNumber"
                      defaultValue={newUser.documentNumber}
                      onChange={(data) => {
                        setValue('newUser', {
                          ...newUser,
                          ...{ documentNumber: data.target.value },
                        });
                        setNewUser({ ...newUser, ...{ documentNumber: data.target.value } });

                      }}
                    />
                    <RequiredMessagesCustom formState={formState} register={'documentNumber'} />
                  </FormGroupCustom>
                  <Button
                    color="primary"
                    className={`mb-5 mt-5 btn-primary btn-shadow`}
                    size="lg"
                    type="submit"
                    onClick={updateUser}
                  >
                    {' '}
                    Actualizar
                  </Button>
                </CardBody>
              </Card>
            </Colxx>
            {user?.role?.name && user.role.name === "DOCENTE" ?
              <Colxx xxs="12" lg="5" xl="4" className="col-left" style={{ marginTop: "-8vh" }}>
                <SingleLightbox
                  id="2"
                  thumb={user?.signaturePhoto ? urlImages + user?.signaturePhoto : ProfileImg}
                  large={user?.signaturePhoto ? urlImages + user?.signaturePhoto : ProfileImg}
                  className="img-thumbnail card-img social-profile-img"
                />
                <Card>
                  <CardBody className="pb-0">
                    <div className="text-center pt-4 mb-4 mt-4">
                      <Badge color="primary font-0-8rem" pill>
                        {'Firma Docente'}
                      </Badge>
                    </div>
                    <InputGroup className="mb-3">
                      <Input
                        type="file"
                        id="exampleCustomFileBrowser2"
                        name="customFile"
                        onChange={(e) => uploadImgSignature(e.target.files[0])}
                      />
                    </InputGroup>
                    <small>
                      *La firma se cargará automaticamente una vez sea seleccionada*
                    </small>
                    <hr />
                  </CardBody>
                </Card>
              </Colxx> :
              <></>
            }
          </Row>
        </>
      )}
    </>
  );
};

const mapDispatchToProps = { ...userActions, ...loginActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
