import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { 
  Button, Card, CardBody, Input, InputGroup, Row, Col, Table, 
  Pagination, PaginationItem, PaginationLink, Badge, 
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem 
} from 'reactstrap';
import { Colxx } from '../CustomBootstrap';
import { Loader } from '../Loader';

const DataListSimple = (props: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Permisos de usuario
  const userRole = props.loginReducer?.role?.name || '';
  const canCreate = props.canCreate !== undefined ? props.canCreate : !['ESTUDIANTE', 'ACUDIENTE'].includes(userRole);
  
  useEffect(() => {
    setData(props.data || []);
  }, [props.data]);
  
  // Filtrado
  useEffect(() => {
    if (searchTerm) {
      if (props.searchFields && props.searchFields.length > 0) {
        const filtered = props.data?.filter((item: any) => {
          return props.searchFields.some((field: string) => {
            const value = item[field];
            return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
          });
        });
        setData(filtered || []);
      } else {
        const filtered = props.data?.filter((item: any) => {
          const values = Object.values(item).join(' ').toLowerCase();
          return values.includes(searchTerm.toLowerCase());
        });
        setData(filtered || []);
      }
    } else {
      setData(props.data || []);
    }
    setCurrentPage(1);
  }, [searchTerm, props.data, props.searchFields]);
  
  // Ordenamiento
  const handleSort = (field: string) => {
    let direction = 'asc';
    
    if (sortField === field && sortDirection === 'asc') {
      direction = 'desc';
    }
    
    setSortField(field);
    setSortDirection(direction);
    
    // Ordenar los datos
    const sortedData = [...data].sort((a, b) => {
      const valueA = a[field] || '';
      const valueB = b[field] || '';
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      return direction === 'asc' 
        ? (valueA > valueB ? 1 : -1) 
        : (valueA < valueB ? 1 : -1);
    });
    
    setData(sortedData);
  };
  
  // Paginación
  const totalPages = Math.ceil((data?.length || 0) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data?.length || 0);
  const currentData = data?.slice(startIndex, endIndex) || [];
  
  // Renderizar celdas
  const renderCell = (row: any, column: any) => {
    if (column.render) {
      return column.render(row);
    }
    return row[column.column] || '';
  };
  
  // Selección múltiple
  const toggleItemSelection = (item: any) => {
    if (selectedItems.find(i => i.id === item.id)) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };
  
  // Seleccionar todos
  const toggleSelectAll = () => {
    if (selectedItems.length === currentData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...currentData]);
    }
  };
  
  // Eliminación masiva
  const handleDeleteSelected = () => {
    if (props.confirmMessage) {
      if (window.confirm(props.confirmMessage)) {
        handleDelete();
      }
    } else {
      if (window.confirm(`¿Está seguro que desea eliminar ${selectedItems.length} elementos?`)) {
        handleDelete();
      }
    }
  };
  
  const handleDelete = () => {
    selectedItems.forEach(item => {
      props.deleteData && props.deleteData(item.id);
    });
    setSelectedItems([]);
  };
  
  // Refrescar datos
  const handleRefresh = () => {
    setLoading(true);
    props.refreshData && props.refreshData().finally(() => {
      setLoading(false);
    });
  };

  return (
    <Card className="mb-4 shadow-sm">
      <CardBody>
        <div className="d-flex flex-wrap align-items-center mb-3">
          {/* Búsqueda */}
          <div className="search-container mr-auto mb-2 mb-md-0" style={{ maxWidth: '350px', width: '100%' }}>
            <InputGroup size="sm">
              <Input 
                placeholder={props.searchPlaceholder || "Buscar..."}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <div className="input-group-append">
                <Button 
                  color="secondary" 
                  outline
                  onClick={() => searchTerm ? setSearchTerm('') : null}
                >
                  <i className={searchTerm ? "simple-icon-close" : "simple-icon-magnifier"} />
                </Button>
              </div>
            </InputGroup>
          </div>

          {/* Filtros y botones */}
          <div className="d-flex flex-nowrap">
            {props.filterOptions && props.filterOptions.length > 0 && (
              <Dropdown 
                isOpen={filterDropdownOpen} 
                toggle={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className="mr-2"
              >
                <DropdownToggle caret color="outline-primary" size="sm">
                  {props.filterOptions.find((opt: any) => opt.value === props.filterValue)?.label || 'Filtrar'}
                </DropdownToggle>
                <DropdownMenu>
                  {props.filterOptions.map((option: any) => (
                    <DropdownItem 
                      key={option.value} 
                      onClick={() => props.onFilterChange(option.value)}
                      active={props.filterValue === option.value}
                    >
                      {option.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            )}
            
            {selectedItems.length > 0 && props.deleteData && (
              <Button 
                color="danger" 
                size="sm" 
                className="mr-2"
                onClick={handleDeleteSelected}
              >
                <i className="simple-icon-trash mr-1"></i>
                Eliminar ({selectedItems.length})
              </Button>
            )}
            
            {props.refreshData && (
              <Button 
                color="info" 
                size="sm" 
                className="mr-2" 
                onClick={handleRefresh}
                disabled={loading}
                title="Actualizar"
              >
                <i className={`${loading ? 'simple-icon-refresh spinning' : 'simple-icon-refresh'}`}></i>
              </Button>
            )}
            
            {canCreate && props.onAddNew && (
              <Button 
                color="primary" 
                size="sm"
                onClick={props.onAddNew}
              >
                <i className="simple-icon-plus mr-1"></i>
                {props.addButtonLabel || "Agregar Nuevo"}
              </Button>
            )}
          </div>
        </div>

        {/* Información de paginación */}
        {data.length > 0 && (
          <div className="text-muted small mb-3">
            Mostrando {startIndex + 1}-{endIndex} de {data.length} registros
          </div>
        )}
        
        {/* Contenido principal */}
        {loading ? (
          <div className="text-center py-5">
            <Loader size={50} />
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr className="bg-light">
                  {props.selectable !== false && (
                    <th style={{width: '40px'}}>
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="checkAll"
                          checked={currentData.length > 0 && selectedItems.length === currentData.length}
                          onChange={toggleSelectAll}
                        />
                        <label className="custom-control-label" htmlFor="checkAll"></label>
                      </div>
                    </th>
                  )}
                  {props.columns.map((column: any, index: number) => (
                    <th 
                      key={index} 
                      style={{width: column.width || 'auto'}}
                      className={column.sortable !== false ? "cursor-pointer" : ""}
                      onClick={() => column.sortable !== false && handleSort(column.column)}
                    >
                      <div className="d-flex align-items-center">
                        {column.label}
                        {column.sortable !== false && (
                          <div className="sort-icons ml-1">
                            <div className="d-flex flex-column">
                              <i className={`simple-icon-arrow-up ${sortField === column.column && sortDirection === 'asc' ? 'text-primary' : 'text-muted'}`} 
                                 style={{fontSize: '0.6rem', marginBottom: '-3px'}}></i>
                              <i className={`simple-icon-arrow-down ${sortField === column.column && sortDirection === 'desc' ? 'text-primary' : 'text-muted'}`} 
                                 style={{fontSize: '0.6rem'}}></i>
                            </div>
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                  {props.actions && props.actions.length > 0 && (
                    <th style={{width: props.actionsWidth || '150px'}} className="text-center">
                      {props.actionsLabel || "Acciones"}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={props.columns.length + (props.selectable !== false ? 1 : 0) + (props.actions && props.actions.length > 0 ? 1 : 0)} className="text-center p-5">
                      <div className="my-3">
                        <i className={props.emptyIcon || "iconsminds-file"} style={{fontSize: '3rem', opacity: 0.3}}></i>
                      </div>
                      <h5>{props.emptyMessage || "No hay datos disponibles"}</h5>
                      <p className="text-muted">{props.emptyDescription || ""}</p>
                    </td>
                  </tr>
                ) : (
                  currentData.map((row: any) => {
                    // Aplicar clase personalizada a la fila si se proporciona
                    const trClass = props.trClass ? props.trClass(row) : '';
                    const trStyle = props.trStyle ? props.trStyle(row) : {};
                    
                    return (
                      <tr 
                        key={row.id} 
                        className={trClass} 
                        style={{
                          ...trStyle, 
                          cursor: props.onRowClick ? 'pointer' : 'default'
                        }}
                      >
                        {props.selectable !== false && (
                          <td onClick={(e) => e.stopPropagation()}>
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={`check_${row.id}`}
                                checked={!!selectedItems.find(i => i.id === row.id)}
                                onChange={() => toggleItemSelection(row)}
                              />
                              <label className="custom-control-label" htmlFor={`check_${row.id}`}></label>
                            </div>
                          </td>
                        )}
                        {props.columns.map((column: any, index: number) => (
                          <td 
                            key={index} 
                            onClick={() => props.onRowClick && props.onRowClick(row)}
                            className="align-middle"
                          >
                            {renderCell(row, column)}
                          </td>
                        ))}
                        {props.actions && props.actions.length > 0 && (
                          <td className="text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="d-flex justify-content-center">
                              {props.actions.map((action: any, i: number) => {
                                // Verificar si la acción tiene una condición y si se cumple
                                if (action.condition && !action.condition(row)) {
                                  return null;
                                }
                                
                                return (
                                  <Button
                                    key={`${action.id || i}`}
                                    color={action.color || 'secondary'}
                                    size="sm"
                                    className="mx-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      action.action(row);
                                    }}
                                    title={action.tooltip || action.label}
                                  >
                                    <i className={`${action.icon}`} />
                                  </Button>
                                );
                              })}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>
        )}
        
        {/* Paginación */}
        {totalPages > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <select 
                className="form-control form-control-sm" 
                value={pageSize}
                style={{width: 'auto'}}
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="5">5 por página</option>
                <option value="10">10 por página</option>
                <option value="20">20 por página</option>
                <option value="50">50 por página</option>
              </select>
            </div>
            
            {totalPages > 1 && (
              <Pagination className="mb-0" size="sm">
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink first onClick={() => setCurrentPage(1)} />
                </PaginationItem>
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink previous onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
                </PaginationItem>
                
                {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                  let pageNum = currentPage;
                  if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  if (pageNum <= totalPages && pageNum > 0) {
                    return (
                      <PaginationItem active={currentPage === pageNum} key={pageNum}>
                        <PaginationLink onClick={() => setCurrentPage(pageNum)}>
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                
                <PaginationItem disabled={currentPage === totalPages}>
                  <PaginationLink next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
                </PaginationItem>
                <PaginationItem disabled={currentPage === totalPages}>
                  <PaginationLink last onClick={() => setCurrentPage(totalPages)} />
                </PaginationItem>
              </Pagination>
            )}
          </div>
        )}
      </CardBody>
      
      <style>
        {`
          .spinning {
            animation: spin 1s infinite linear;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .cursor-pointer {
            cursor: pointer;
          }

          .sort-icons {
            width: 10px;
            margin-left: 5px;
          }
          
          @media (max-width: 576px) {
            .search-container {
              max-width: 100% !important;
              margin-bottom: 0.5rem !important;
            }
          }
          
          /* Desactivar hover default */
          .table-hover tbody tr:hover {
            background-color: initial;
          }
          
          /* Aplicar hover personalizado solo para filas con cursor pointer */
          .table-hover tbody tr[style*="cursor: pointer"]:hover {
            background-color: rgba(0,0,0,0.03);
          }
        `}
      </style>
    </Card>
  );
};

const mapStateToProps = ({ loginReducer }: any) => ({ loginReducer });

export default connect(mapStateToProps)(DataListSimple);