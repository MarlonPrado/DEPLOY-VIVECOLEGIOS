/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import IntlMessages from '../../../../helpers/IntlMessages';
import { Colxx } from '../../CustomBootstrap';
import { iconsmind } from './iconsJson';

const IconsComponent = ({ modalOpen, toggleModal, iconToSet, setIcon }: any) => {
  return (
    <>
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
        <ModalHeader
          toggle={toggleModal}
          close={
            <button type="button" className="close" onClick={toggleModal} aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          }
        >
          <strong>
            <IntlMessages id="forms.icons" />
          </strong>
          <br />
          <small>
            <IntlMessages id="forms.clickToSelect" />
          </small>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Colxx xxs="12">
              <div className="mind-icons">
                {iconsmind.map((iconSet, setIndex) => {
                  return (
                    <div key={setIndex} className="mb-5 cursor-pointer">
                      <h6 className="mb-4">
                        {' '}
                        <strong>
                          <IntlMessages id={iconSet.title} />
                        </strong>
                      </h6>
                      {iconSet.icons.map((icon: any, index: any) => {
                        return (
                          <div
                            className="glyph"
                            key={setIndex + index}
                            onClick={() => {
                              return setIcon(icon);
                            }}
                          >
                            <div className={`glyph-icon ${icon}`} />
                            <div className="class-name">{icon}</div>
                          </div>
                        );
                      })}
                      <div className="clearfix" />
                    </div>
                  );
                })}
              </div>
            </Colxx>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            <IntlMessages id="pages.cancel" />
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

const mapDispatchToProps = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(IconsComponent);
