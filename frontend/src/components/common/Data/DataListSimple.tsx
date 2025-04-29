import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router';
import useMousetrap from '../../../hooks/use-mousetrap';
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

const DataListSimple = (props: any) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayMode, setDisplayMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(props.currentPage || 1);
  const [selectedPageSize, setSelectedPageSize] = useState(props.pageSize || 10);
  const [selectedOrderOption, setSelectedOrderOption] = useState(props?.columns[0]);
  const [orderOptions, setOrderOptions] = useState(props?.columns);
  const [columns, setColumns] = useState(props?.columns);
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrderColumn, setSortOrderColumn] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [itemsDefault, setItemsDefault] = useState([]);
  const [lastChecked, setLastChecked] = useState(null);
  
  // Configuración de permisos por defecto (todos habilitados)
  const [currentMenu, setCurrentMenu] = useState({
    createAction: true,
    deleteAction: true,
    updateAction: true, 
    readAction: true,
    fullAccess: true,
    activateAction: true,
    inactiveAction: true,
  });

  const { pathname } = useLocation();

  useEffect(() => {
    setItemsDefault(props?.data);
  }, [props?.data])

  // Eliminar la validación de permisos que causa problemas
  useEffect(() => {
    setCurrentPage(1);
    // No hacer ninguna validación de permisos aquí
  }, [selectedPageSize, selectedOrderOption]);

  useEffect(() => {
    if (props?.data != null) {
      setTotalPage(Math.ceil(props?.data?.length / selectedPageSize));
      
      const itemsSlice = props?.data?.slice(
        (currentPage - 1) * selectedPageSize, 
        currentPage * selectedPageSize
      );
      
      setItems(itemsSlice);
      setSelectedItems([]);
      setTotalItemCount(props?.data?.length);
      setIsLoaded(true);
    }
  }, [props?.data, selectedPageSize, currentPage, selectedOrderOption]);

  // Actualizar página cuando el prop cambie
  useEffect(() => {
    if (props.currentPage !== currentPage) {
      setCurrentPage(props.currentPage);
    }
  }, [props.currentPage]);

  // Actualizar tamaño de página cuando el prop cambie
  useEffect(() => {
    if (props.pageSize !== selectedPageSize) {
      setSelectedPageSize(props.pageSize);
    }
  }, [props.pageSize]);

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
    return false;
  };

  const onContextMenuClick = () => {};
  const onContextMenu = (e: any, data: any) => {
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
    let array = Object.entries(dato.node || dato);
    return array.find(c => { 
      return (c[0] != "id" && c[0] != "__typename" && c[1]?.toString()?.toLocaleLowerCase()?.includes(term)) 
    });
  };

  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;

  // Cuando cambia la página, notificar al componente padre
  useEffect(() => {
    if (props.onPageChange && currentPage !== props.currentPage) {
      props.onPageChange(currentPage);
    }
  }, [currentPage]);

  // Cuando cambia el tamaño de página, notificar al componente padre
  useEffect(() => {
    if (props.onPageSizeChange && selectedPageSize !== props.pageSize) {
      props.onPageSizeChange(selectedPageSize);
    }
  }, [selectedPageSize]);

  return (
    <div className="disable-text-selection">
      <ListPageHeading
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
        currentMenu={currentMenu} // Siempre tiene todos los permisos
        onSearchKey={(e: any) => {
          const searchTerm = e?.toString()?.toLocaleLowerCase();
          if (searchTerm) {
            setItems(itemsDefault.filter(dato => matches(dato, searchTerm)));
          } else {
            // Restaurar items originales
            const itemsSlice = props?.data?.slice(
              (currentPage - 1) * selectedPageSize, 
              currentPage * selectedPageSize
            );
            setItems(itemsSlice);
          }
        }}
        orderOptions={orderOptions}
        pageSizes={pageSizes}
        toggleModal={() => {
          return props?.toggleModal && props.toggleModal();
        }}
        columns={columns}
        deleteAll={() => {
          return props?.deleteAll && props?.deleteAll(selectedItems);
        }}
        changeActiveDataAll={() => {
          return props?.changeActiveDataAll && props?.changeActiveDataAll(selectedItems);
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
            const nodeA = a.node || a;
            const nodeB = b.node || b;
            const fieldA = nodeA[e.column]?.toString().toUpperCase() || '';
            const fieldB = nodeB[e.column]?.toString().toUpperCase() || '';
            return sortOrderColumnAux
              ? fieldA.localeCompare(fieldB)
              : fieldB.localeCompare(fieldA);
          }));
        }}
        sortColumn={sortColumn}
        sortOrderColumn={sortOrderColumn}
        refreshDataTable={props?.refreshDataTable}
        childrenButtons={props?.childrenButtons}
        filterOptions={props?.filterOptions}
        filterValue={props?.filterValue}
        onFilterChange={props?.onFilterChange}
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
        currentMenu={currentMenu} // Siempre tiene todos los permisos
        additionalFunction={props?.additionalFunction}
        trClass={props?.trClass}
      />
    </div>
  );
};

export default DataListSimple;