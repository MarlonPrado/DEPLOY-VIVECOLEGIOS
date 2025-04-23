/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { injectIntl, useIntl } from 'react-intl';
import {
  Button,
  ButtonDropdown,
  Card,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Row,
  UncontrolledDropdown,
} from 'reactstrap';

import IntlMessages from '../../../helpers/IntlMessages';
import { Colxx, Separator } from '../CustomBootstrap';
import BreadcrumbContainer from '../navs/Breadcrumb';
import DataListIcon from './Icon/DataListIcon';
import ImageListIcon from './Icon/ImageListIcon';
import ThumbListIcon from './Icon/ThumbListIcon';

const ExcelJS = require('exceljs');

const ListPageHeading = ({
  items,
  intl,
  displayMode,
  changeDisplayMode,
  handleChangeSelectAll,
  changeOrderBy,
  changePageSize,
  selectedPageSize,
  totalItemCount,
  selectedOrderOption,
  match,
  startIndex,
  endIndex,
  selectedItemsLength,
  itemsLength,
  onSearchKey,
  orderOptions,
  pageSizes,
  toggleModal,
  heading,
  columns,
  deleteAll,
  changeActiveDataAll,
  currentMenu,
  withChildren,
  header,
  createActionDisabled,
  showOptionsTypeView,
  onSort,
  sortColumn,
  sortOrderColumn,
  refreshDataTable,
  childrenButtons,
}: any) => {
  const [dropdownSplitOpen, setDropdownSplitOpen] = useState(false);
  const [displayOptionsIsOpen, setDisplayOptionsIsOpen] = useState(false);
  const { messages } = intl;
  const [data, setData] = useState({ products: [] });

  const dataSet1 = [
    {
      name: 'Johson',
      amount: 30000,
      sex: 'M',
      is_married: true,
    },
    {
      name: 'Monika',
      amount: 355000,
      sex: 'F',
      is_married: false,
    },
    {
      name: 'John',
      amount: 250000,
      sex: 'M',
      is_married: false,
    },
    {
      name: 'Josef',
      amount: 450500,
      sex: 'M',
      is_married: true,
    },
  ];

  var dataSet2 = [
    {
      name: 'Johnson',
      total: 25,
      remainig: 16,
    },
    {
      name: 'Josef',
      total: 25,
      remainig: 7,
    },
  ];

  const exportExcelFile = () => {
    const workbook = new ExcelJS.Workbook();
    var sheet = workbook.addWorksheet('sheet', {
      headerFooter: { firstHeader: 'Hello Exceljs', firstFooter: 'Hello World' },
    });
    //sheet.properties.defaultRowHeight = 80;
    // merge by start row, start column, end row, end column
    sheet.mergeCells(1, 1, 1, columns?.length);
    sheet.getCell('A1').value = 'Vive Colegios 3.0';
    sheet.getCell('A2').value = 'IE: ';
    sheet.mergeCells(2, 2, 2, columns?.length);
    sheet.getCell('B2').value = '--------------------------------------------';

    sheet.mergeCells(1, 1, 1, columns?.length);

    sheet.columns = [];
    let sheetColumns: any[] = [];
    // columns
    //   ?.filter((c: any) => {
    //     return c.column?.length > 0;
    //   })
    //   .map((column: any) => {
    //     sheetColumns.push({
    //       header: messages[column?.label],
    //       key: column?.label,
    //     });
    //   });

    // sheet.columns = [...sheetColumns];

    const promise = Promise.all(
      data?.products?.map(
        async (
          product: {
            id: any;
            title: any;
            brand: any;
            category: any;
            price: any;
            rating: any;
            thumbnail: string;
          },
          index: number,
        ) => {
          const rowNumber = index + 1;
          sheet.addRow({
            id: product?.id,
            title: product?.title,
            brand: product?.brand,
            category: product?.category,
            price: product?.price,
            rating: product?.rating,
          });
          console.log(product?.thumbnail);
        },
      ),
    );

    workbook.xlsx.writeBuffer().then(function (data: any) {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'download.xlsx';
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const toDataURL = (url: any) => {
    const promise = new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        var reader = new FileReader();
        reader.readAsDataURL(xhr.response);
        reader.onloadend = function () {
          resolve({ base64Url: reader.result });
        };
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });

    return promise;
  };

  return (
    <Row>
      <Colxx xxs="12">
        <div className="mb-2">
          {/* <h1>
            <IntlMessages id={heading} />
          </h1> */}

          <div className="text-zero top-right-button-container">
            <Button
              //onClick={download}
              key={'download'}
            >
              <i className="iconsminds-download"></i> {'XLS'}
            </Button>
            <button className="btn btn-primary float-end mt-2 mb-2" onClick={exportExcelFile}>
              Export
            </button>

            <Button
              className="top-right-button mr-1"
              onClick={() => {
                return refreshDataTable();
              }}
            >
              <i className="simple-icon-refresh" />
            </Button>
            {currentMenu.createAction && !createActionDisabled ? (
              <Button
                color="primary"
                size="lg"
                className="top-right-button"
                onClick={() => {
                  return toggleModal();
                }}
              >
                <i className="iconsminds-add" />
                <IntlMessages id="pages.add-new" />
              </Button>
            ) : (
              ''
            )}
            {'  '}
            {currentMenu.deleteAction ||
            currentMenu.activateAction ||
            currentMenu.inactiveAction ? (
              <>
                <ButtonDropdown
                  isOpen={dropdownSplitOpen}
                  toggle={() => {
                    return setDropdownSplitOpen(!dropdownSplitOpen);
                  }}
                >
                  <div className="btn btn-primary btn-lg pl-4 pr-0 check-button check-all">
                    <Input
                      className="custom-checkbox custom-control checkAll mb-0 mr-2 d-inline-block"
                      type="checkbox"
                      id="checkAll"
                      checked={selectedItemsLength >= itemsLength}
                      onChange={() => {
                        return handleChangeSelectAll(true);
                      }}
                      label={
                        <span
                          className={`custom-control-label ${
                            selectedItemsLength > 0 && selectedItemsLength < itemsLength
                              ? 'indeterminate'
                              : ''
                          }`}
                        />
                      }
                    />
                  </div>
                  <DropdownToggle caret color="primary" className="dropdown-toggle-split btn-lg" />
                  <DropdownMenu end>
                    {currentMenu.deleteAction ? (
                      <DropdownItem
                        onClick={() => {
                          return deleteAll();
                        }}
                      >
                        <IntlMessages id="pages.delete" />
                      </DropdownItem>
                    ) : (
                      ''
                    )}
                    {currentMenu.activateAction || currentMenu.inactiveAction ? (
                      <DropdownItem
                        onClick={() => {
                          return changeActiveDataAll();
                        }}
                      >
                        <IntlMessages id="pages.activateInactivate" />
                      </DropdownItem>
                    ) : (
                      ''
                    )}
                  </DropdownMenu>
                </ButtonDropdown>
              </>
            ) : (
              ''
            )}
          </div>
          <BreadcrumbContainer
            currentMenu={currentMenu}
            match={match}
            heading={match.replace('/', '')}
          />
        </div>

        <div className="mb-2">
          <Button
            color="empty"
            className="pt-0 pl-0 d-inline-block d-md-none"
            onClick={() => {
              return setDisplayOptionsIsOpen(!displayOptionsIsOpen);
            }}
          >
            <IntlMessages id="pages.display-options" />{' '}
            <i className="simple-icon-arrow-down align-middle" />
          </Button>
          <Collapse isOpen={displayOptionsIsOpen} className="d-md-block" id="displayOptions">
            {showOptionsTypeView ? (
              <>
                <span className="mr-3 d-inline-block float-md-left">
                  <a
                    className={`mr-2 view-icon ${displayMode === 'list' ? 'active' : ''}`}
                    onClick={() => {
                      return changeDisplayMode('list');
                    }}
                  >
                    <DataListIcon />
                  </a>
                  <a
                    className={`mr-2 view-icon ${displayMode === 'thumblist' ? 'active' : ''}`}
                    onClick={() => {
                      return changeDisplayMode('thumblist');
                    }}
                  >
                    <ThumbListIcon />
                  </a>
                  <a
                    className={`mr-2 view-icon ${displayMode === 'imagelist' ? 'active' : ''}`}
                    onClick={() => {
                      return changeDisplayMode('imagelist');
                    }}
                  >
                    <ImageListIcon />
                  </a>
                </span>
              </>
            ) : (
              ''
            )}

            <div className="d-block d-md-inline-block pt-1">
              <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                <input
                  type="text"
                  name="keyword"
                  id="search"
                  placeholder={messages['menu.search']}
                  onChange={(e: any) => {
                    return onSearchKey(e.target?.value);
                  }}
                />
              </div>
            </div>
            <div className="float-md-right pt-1">
              <span className="text-muted text-small mr-1">{`${startIndex}-${endIndex} de ${totalItemCount} `}</span>
              <UncontrolledDropdown className="d-inline-block">
                <DropdownToggle caret color="outline-dark" size="xs">
                  {selectedPageSize}
                </DropdownToggle>
                <DropdownMenu end>
                  {pageSizes.map((size: any, index: any) => {
                    return (
                      <DropdownItem
                        key={index}
                        onClick={() => {
                          return changePageSize(size);
                        }}
                      >
                        {size}
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </Collapse>
        </div>
        {header}
        {displayMode === 'list' ? (
          <>
            <Separator className="pt-2 mb-2" />
            <Card>
              <div className="pl-2 d-flex flex-grow-1 min-width-zero">
                <div className="p-3 card-body align-self-center d-flex flex-colum flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                  {columns
                    ?.filter((c: any) => {
                      return c.column?.length > 0;
                    })
                    .map((item: any) => {
                      return (
                        <p
                          key={item.label}
                          className="mb-1 text-muted text-small"
                          style={{ width: item.width }}
                        >
                          <i
                            className={`glyph-icon text-one cursor-pointer ${sortColumn === item?.column ? (sortOrderColumn ? 'iconsminds-up-1' : 'iconsminds-down-1') : 'iconsminds-down-1'}`}
                            onClick={(e: any) => {
                              //console.log(sortColumn)
                              return onSort(item);
                            }}
                          />
                          <IntlMessages id={item.label} />
                        </p>
                      );
                    })}
                  {columns
                    ?.filter((c: any) => {
                      return (
                        (c.column?.length == 0 || c.column == undefined) &&
                        (currentMenu?.activateAction ||
                          currentMenu?.deleteAction ||
                          currentMenu?.inactiveAction ||
                          currentMenu?.updateAction ||
                          childrenButtons?.length > 0)
                      );
                    })
                    .map((item: any) => {
                      return (
                        <p
                          key={item.label}
                          className={'mb-1 text-muted text-small text-center'}
                          style={{ width: item.width }}
                        >
                          <IntlMessages id={item.label ? item.label : 'pages.actions'} />
                        </p>
                      );
                    })}
                  <div className="custom-control custom-checkbox pl-1 align-self-center pr-2 pl-4">
                    <Input
                      className="item-check mb-0"
                      type="checkbox"
                      id={`check_`}
                      onChange={() => {}}
                      label=""
                    />
                  </div>
                </div>
              </div>
            </Card>
            <Separator className="pt-2 mb-3" />
          </>
        ) : (
          ''
        )}
      </Colxx>
    </Row>
  );
};

export default injectIntl(ListPageHeading);
