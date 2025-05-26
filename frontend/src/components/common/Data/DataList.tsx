import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

import { createNotification } from '../../../helpers/Notification';
import useMousetrap from '../../../hooks/use-mousetrap';
import { Loader } from '../Loader';
import ListPageHeading from './ListPageHeading';
import ListPageListing from './ListPageListing';

const getIndex = (value: any, arr: any, prop: any) => {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][prop] === value) {
      return i;
    }
  }
  return -1;
};

const pageSizes = [5, 10, 15, 20];

const DataList = (props: any) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayMode, setDisplayMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageSize, setSelectedPageSize] = useState(5);
  const [selectedOrderOption, setSelectedOrderOption] = useState(props?.columns[0]);
  const [orderOptions, setOrderOptions] = useState(props?.columns);
  const [columns, setColumns] = useState(props?.columns);
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrderColumn, setSortOrderColumn] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [itemsDefault, setItemsDefault] = useState([]);
  const [lastChecked, setLastChecked] = useState(null);
  const [currentMenu, setCurrentMenu] = useState({
    createAction: false,
    deleteAction: false,
    updateAction: false,
    readAction: false,
    fullAccess: false,
    activateAction: false,
    inactiveAction: false,
  });

  const location = useLocation();
  const { pathname } = useLocation();
  const history = useNavigate();
  const currentUrl = location.pathname;

  useEffect(() => {
    setItemsDefault(props?.data);
  }, props?.data)

  useEffect(() => {
    setCurrentPage(1);
    let { roleMenus } = props.loginReducer;
    let submenus: any = [];
    roleMenus.map((c: any) => {
      return submenus = submenus.concat(c.menuItemsLogin);
    });
    //console.log(submenus)
    let cm = submenus.find((c: any) => { return (currentUrl === c?.module?.url) });
    // console.log(currentUrl)
    // console.log(submenus)
    if (cm && cm.readAction) {
      setCurrentMenu(cm);
    } else {
      history(`/home`);
      createNotification('warning', 'notPermissions', '');
    }
    //console.log(cm)
  }, [selectedPageSize, selectedOrderOption]);

  useEffect(() => {
    if (props?.data != null) {
      setTotalPage(Math.ceil(props?.data?.length / selectedPageSize));
      // setItems(
      //   props?.data?.map((x: any) => {
      //     return { ...x, img: x.img.replace('img/', 'img/products/') };
      //   }),
      // );
      const itemsSlice = props?.data?.slice((currentPage - 1) * selectedPageSize, currentPage * selectedPageSize);
      setItems(itemsSlice);
      setSelectedItems([]);
      setTotalItemCount(props?.data?.length);
      setIsLoaded(true);
    }
  }, [selectedPageSize, currentPage, selectedOrderOption]);

  const onCheckItem = (event: any, item: any) => {
    if (
      event.target.tagName === 'A' ||
      (event.target.parentElement && event.target.parentElement.tagName === 'A')
    ) {
      return true;
    }
    if (lastChecked === null) {
      setLastChecked(item.id);
    }

    let selectedList = [...selectedItems];
    if (selectedItems.find((c: any) => { return (c.id === item.id) })) {
      selectedList = selectedList.filter((x) => {
        return x.id !== item.id;
      });
    } else {
      selectedList.push(item);
    }
    setSelectedItems(selectedList);

    if (event.shiftKey) {
      let newItems = [...items];
      const start = getIndex(item.id, newItems, 'id');
      const end = getIndex(lastChecked, newItems, 'id');
      newItems = newItems.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedItems.push(
        ...newItems.map((data) => {
          return data.id;
        }),
      );
      selectedList = Array.from(new Set(selectedItems));
      setSelectedItems(selectedList);
    }
    // document.activeElement.blur();
    return false;
  };

  const handleChangeSelectAll = (isToggle: any) => {
    if (selectedItems.length >= items.length) {
      if (isToggle) {
        setSelectedItems([]);
      }
    } else {
      setSelectedItems(
        items.map((x) => {
          return x.node;
        }),
      );
    }
    // document.activeElement.blur();
    return false;
  };

  const onContextMenuClick = (e: any, data: any) => {
    //console.log('onContextMenuClick - selected items', selectedItems);
    //console.log('onContextMenuClick - action : ', data.action);
  };

  const onContextMenu = (e: any, data: any) => {
    //console.log(data);
    const clickedProductId = data.data;
    if (!selectedItems.includes(clickedProductId)) {
      setSelectedItems([clickedProductId]);
    }
    return true;
  };

  useMousetrap(['ctrl+a', 'command+a'], () => {
    handleChangeSelectAll(false);
  });

  useMousetrap(['ctrl+d', 'command+d'], () => {
    setSelectedItems([]);
    return false;
  });

  const matches = (dato: any, term: any) => {
    let array = Object.entries(dato.node);
    return array.find(c => { return (c[0] != "id" && c[0] != "__typename" && c[1]?.toString()?.toLocaleLowerCase()?.includes(term)) });
  };

  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;

  return <>
    <div className="disable-text-selection">
      <ListPageHeading
        items={items}
        itemsTotal={itemsDefault}
        header={props?.header}
        heading="menu.data-list"
        displayMode={displayMode}
        changeDisplayMode={setDisplayMode}
        handleChangeSelectAll={handleChangeSelectAll}
        changeOrderBy={(column: any) => {
          setSelectedOrderOption(
            orderOptions.find((x: any) => {
              return x.column === column;
            }),
          );
        }}
        changePageSize={setSelectedPageSize}
        selectedPageSize={selectedPageSize}
        createActionDisabled={props?.createActionDisabled}
        totalItemCount={totalItemCount}
        selectedOrderOption={selectedOrderOption}
        match={pathname}
        startIndex={startIndex}
        endIndex={endIndex}
        selectedItemsLength={selectedItems ? selectedItems.length : 0}
        itemsLength={items ? items.length : 0}
        currentMenu={currentMenu}
        onSearchKey={(e: any) => {
          setItems(itemsDefault.filter(dato => { return matches(dato, e?.toString()?.toLocaleLowerCase()) }));
        }}
        orderOptions={orderOptions}
        pageSizes={pageSizes}
        toggleModal={() => {
          return props?.setModalOpen(!props?.modalOpen);
        }}
        columns={columns}
        deleteAll={() => {
          return props?.deleteAll(selectedItems);
        }}
        changeActiveDataAll={() => {
          return props?.changeActiveDataAll(selectedItems);
        }}
        withChildren={props?.withChildren}
        onSort={(e: any) => {
          let sortOrderColumnAux = sortOrderColumn;
          if (e.column === sortColumn) {
            sortOrderColumnAux = !sortOrderColumnAux;
            setSortOrderColumn(sortOrderColumnAux);
          } else {
            setSortColumn(e.column);
            sortOrderColumnAux = true;
            setSortOrderColumn(sortOrderColumnAux);
          }
          setItems(items.sort((a, b) => {
            const fieldA = a['node'][e.column].toString().toUpperCase();
            const fieldB = b['node'][e.column].toString().toUpperCase();
            return sortOrderColumnAux
              ? fieldA.localeCompare(fieldB)
              : fieldB.localeCompare(fieldA);
          }));
        }}
        sortColumn={sortColumn}
        sortOrderColumn={sortOrderColumn}
        refreshDataTable={props?.refreshDataTable}
        childrenButtons={props?.childrenButtons}
      />
      <ListPageListing
        type={props?.type}
        items={items}
        displayMode={displayMode}
        selectedItems={selectedItems}
        onCheckItem={onCheckItem}
        currentPage={currentPage}
        totalPage={totalPage}
        onContextMenuClick={onContextMenuClick}
        onContextMenu={onContextMenu}
        onChangePage={setCurrentPage}
        columns={columns}
        viewEditData={props?.viewEditData}
        changeActiveData={props?.changeActiveData}
        deleteData={props?.deleteData}
        withChildren={props?.withChildren}
        filterChildren={props?.filterChildren}
        childrenButtons={props?.childrenButtons}
        currentMenu={currentMenu}
        additionalFunction={props?.additionalFunction}
      />
    </div>
  </>
};

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps)(DataList);

// export default DataList;
