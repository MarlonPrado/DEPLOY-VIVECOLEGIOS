import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Card, CardBody, Input, InputGroup, Row, Table, Pagination, PaginationItem, PaginationLink, Badge, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Colxx } from '../CustomBootstrap';

const DataListSimple = (props: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  
  // Permisos de usuario
  const userRole = props.loginReducer?.role?.name || '';
  const canCreate = !['ESTUDIANTE', 'ACUDIENTE'].includes(userRole);
  
  useEffect(() => {
    setData(props.data || []);
  }, [props.data]);
  
  // Filtrado
  useEffect(() => {
    if (searchTerm) {
      const filtered = props.data?.filter((item: any) => {
        const values = Object.values(item).join(' ').toLowerCase();
        return values.includes(searchTerm.toLowerCase());
      });
      setData(filtered || []);
    } else {
      setData(props.data || []);
    }
  }, [searchTerm, props.data]);
  
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
    if (window.confirm(`¿Está seguro que desea eliminar ${selectedItems.length} elementos?`)) {
      selectedItems.forEach(item => {
        props.deleteData && props.deleteData(item.id);
      });
      setSelectedItems([]);
    }
  };
  
  return (
    <Card className="mb-4">
      <CardBody>
        <Row className="mb-3 align-items-center">
          <Colxx xxs="6" sm="4" md="3" lg="2">
            <h6 className="mb-1 text-muted">
              Mostrando {startIndex + 1}-{endIndex} de {data.length}
            </h6>
          </Colxx>
          
          <Colxx xxs="6" sm="4" md="5" lg="5">
            <InputGroup>
              <Input 
                placeholder="Buscar..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Colxx>

          <Colxx xxs="12" sm="4" md="4" lg="5" className="d-flex justify-content-end mt-2 mt-sm-0">
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
            
            {selectedItems.length > 0 && (
              <Button 
                color="danger" 
                size="sm" 
                className="mr-2"
                onClick={handleDeleteSelected}
              >
                Eliminar ({selectedItems.length})
              </Button>
            )}
            
            <Button 
              color="primary" 
              size="sm" 
              className="mr-2" 
              onClick={() => props.refreshDataTable && props.refreshDataTable()}
            >
              <i className="simple-icon-refresh" /> Actualizar
            </Button>
            
            {canCreate && props.toggleModal && (
              <Button 
                color="primary" 
                size="sm" 
                onClick={props.toggleModal}
              >
                <i className="simple-icon-plus" /> Agregar Nuevo
              </Button>
            )}
          </Colxx>
        </Row>
        
        <Table hover responsive className="rounded">
          <thead>
            <tr>
              <th className="w-10">
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
              {props.columns.map((column: any, index: number) => (
                <th key={index} style={{width: column.width || 'auto'}}>
                  {column.label}
                </th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={props.columns.length + 2} className="text-center p-4">
                  No hay datos disponibles
                </td>
              </tr>
            ) : (
              currentData.map((row: any) => {
                // Aplicar clase personalizada a la fila si se proporciona
                const trClass = props.trClass ? props.trClass(row) : '';
                
                return (
                  <tr key={row.id} className={trClass}>
                    <td>
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
                    {props.columns.map((column: any, index: number) => (
                      <td key={index}>{renderCell(row, column)}</td>
                    ))}
                    <td>
                      {props.actions && props.actions.map((action: any) => {
                        // Verificar si la acción tiene una condición y si se cumple
                        if (action.condition && !action.condition(row)) {
                          return null;
                        }
                        
                        return (
                          <Button
                            key={action.id}
                            color={action.color || 'secondary'}
                            size="sm"
                            className="mr-1 mb-1"
                            onClick={() => action.action(row)}
                            title={action.label}
                          >
                            {action.icon && <i className={action.icon} />}
                            {!action.icon && action.label}
                          </Button>
                        );
                      })}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
        
        {totalPages > 1 && (
          <Row className="mt-3">
            <Colxx xxs="12">
              <Pagination className="justify-content-center" listClassName="justify-content-center">
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink first onClick={() => setCurrentPage(1)} />
                </PaginationItem>
                <PaginationItem disabled={currentPage === 1}>
                  <PaginationLink previous onClick={() => setCurrentPage(currentPage - 1)} />
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
                  <PaginationLink next onClick={() => setCurrentPage(currentPage + 1)} />
                </PaginationItem>
                <PaginationItem disabled={currentPage === totalPages}>
                  <PaginationLink last onClick={() => setCurrentPage(totalPages)} />
                </PaginationItem>
              </Pagination>
            </Colxx>
          </Row>
        )}
        
        <Row className="mt-3">
          <Colxx xxs="12" className="d-flex justify-content-center">
            <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
              <DropdownToggle caret color="outline-primary" size="sm">
                {pageSize} por página
              </DropdownToggle>
              <DropdownMenu>
                {[5, 10, 20, 50].map((size) => (
                  <DropdownItem 
                    key={size} 
                    onClick={() => {
                      setPageSize(size);
                      setCurrentPage(1);
                    }}
                    active={pageSize === size}
                  >
                    {size} por página
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </Colxx>
        </Row>
      </CardBody>
    </Card>
  );
};

const mapStateToProps = ({ loginReducer }: any) => ({ loginReducer });

export default connect(mapStateToProps)(DataListSimple);