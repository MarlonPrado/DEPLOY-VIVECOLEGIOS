import classnames from 'classnames';
import React, { createRef, useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Collapse, Nav, NavItem } from 'reactstrap';

// import menuItems from '../../../../constants/menu';
import IntlMessages from '../../../../helpers/IntlMessages';
import * as MenuActions from '../../../../stores/actions/MenuActions';
import { adminRoot } from '../../../../constants/defaultValues';

const Sidebar = (props: any) => {
  const [sidebarState, setSidebarState] = useState({
    selectedParentMenu: '',
    viewingParentMenu: '',
    collapsedMenus: [],
  });

  const [onClickMenu, setOnclickMenu] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const wrapperRef = createRef();

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    handleWindowResize(event);
    setSelectedLiActive(setHasSubItemStatus);
    handleProps();
    let { roleMenus } = props.loginReducer;
    roleMenus = roleMenus.map((c: any) => {
      return {
        id: c.name,
        icon: c.icon,
        label: c.name,
        to: `${adminRoot}/${c.name}`,
        newWindow: false,
        subs: c.menuItemsLogin
          .filter((x: any) => {
            return x.isHidden !== true;
          })
          .map((x: any) => {
            return {
              icon: x.icon,
              label: x.name,
              to: x.module ? x.module.url : null,
            };
          }),
      };
    });
    setMenuItems(roleMenus);
    setSidebarState({
      ...sidebarState,
      selectedParentMenu: roleMenus[0] ? roleMenus[0].id : null,
    });
  }, []);

  useEffect(() => {
    if (onClickMenu) {
      setSelectedLiActive(setHasSubItemStatus);
      window.scrollTo(0, 0);
      setOnclickMenu(false);
    }
    handleProps();
  }, [onClickMenu]);

  const handleWindowResize = (event: any) => {
    if (event && !event.isTrusted) {
      return;
    }
    const { containerClassnames } = props.menuReducer;
    const nextClasses = getMenuClassesForResize(containerClassnames);
    props.setContainerClassnames(
      0,
      nextClasses.join(' '),
      props.menuReducer.selectedMenuHasSubItems,
    );
  };

  const handleDocumentClick = (e: any) => {
    const container = getContainer();
    let isMenuClick = false;
    if (
      e.target &&
      e.target.classList &&
      (e.target.classList.contains('menu-button') ||
        e.target.classList.contains('menu-button-mobile'))
    ) {
      isMenuClick = true;
    } else if (
      e.target.parentElement &&
      e.target.parentElement.classList &&
      (e.target.parentElement.classList.contains('menu-button') ||
        e.target.parentElement.classList.contains('menu-button-mobile'))
    ) {
      isMenuClick = true;
    } else if (
      e.target.parentElement &&
      e.target.parentElement.parentElement &&
      e.target.parentElement.parentElement.classList &&
      (e.target.parentElement.parentElement.classList.contains('menu-button') ||
        e.target.parentElement.parentElement.classList.contains('menu-button-mobile'))
    ) {
      isMenuClick = true;
    }
  };

  const getMenuClassesForResize = (classes: any) => {
    const { menuHiddenBreakpoint, subHiddenBreakpoint } = props.menuReducer;
    let nextClasses = classes.split(' ').filter((x: any) => {
      return x !== '';
    });
    const windowWidth = window.innerWidth;
    if (windowWidth < menuHiddenBreakpoint) {
      nextClasses.push('menu-mobile');
    } else if (windowWidth < subHiddenBreakpoint) {
      nextClasses = nextClasses.filter((x: any) => {
        return x !== 'menu-mobile';
      });
      if (nextClasses.includes('menu-default') && !nextClasses.includes('menu-sub-hidden')) {
        nextClasses.push('menu-sub-hidden');
      }
    } else {
      nextClasses = nextClasses.filter((x: any) => {
        return x !== 'menu-mobile';
      });
      if (nextClasses.includes('menu-default') && nextClasses.includes('menu-sub-hidden')) {
        nextClasses = nextClasses.filter((x: any) => {
          return x !== 'menu-sub-hidden';
        });
      }
    }
    return nextClasses;
  };

  const getContainer = () => {
    return wrapperRef;
  };

  const toggle = () => {
    const hasSubItems = getIsHasSubItem();
    props.changeSelectedMenuHasSubItems(hasSubItems);
    const { containerClassnames, menuClickCount } = props.menuReducer;
    const currentClasses = containerClassnames
      ? containerClassnames.split(' ').filter((x: any) => {
          return x !== '';
        })
      : '';
    let clickIndex = -1;
    if (!hasSubItems) {
      if (
        currentClasses.includes('menu-default') &&
        (menuClickCount % 4 === 0 || menuClickCount % 4 === 3)
      ) {
        clickIndex = 1;
      } else if (
        currentClasses.includes('menu-sub-hidden') &&
        (menuClickCount === 2 || menuClickCount === 3)
      ) {
        clickIndex = 0;
      } else if (currentClasses.includes('menu-hidden') || currentClasses.includes('menu-mobile')) {
        clickIndex = 0;
      }
    } else if (currentClasses.includes('menu-sub-hidden') && menuClickCount === 3) {
      clickIndex = 2;
    } else if (currentClasses.includes('menu-hidden') || currentClasses.includes('menu-mobile')) {
      clickIndex = 0;
    }
    if (clickIndex >= 0) {
      props.setContainerClassnames(clickIndex, containerClassnames, hasSubItems);
    }
  };

  const handleProps = () => {
    addEvents();
  };

  const addEvents = () => {
    ['click', 'touchstart', 'touchend'].forEach((event) => {
      return document.addEventListener(event, handleDocumentClick, true);
    });
  };

  const removeEvents = () => {
    ['click', 'touchstart', 'touchend'].forEach((event) => {
      return document.removeEventListener(event, handleDocumentClick, true);
    });
  };

  const setSelectedLiActive = (callback: any) => {
    const oldli = document.querySelector('.sub-menu  li.active');
    if (oldli != null) {
      oldli.classList.remove('active');
    }
    const oldliSub = document.querySelector('.third-level-menu  li.active');
    if (oldliSub != null) {
      oldliSub.classList.remove('active');
    }
    /* set selected parent menu */
    const selectedSublink = document.querySelector('.third-level-menu  a.active');
    if (selectedSublink != null) {
      selectedSublink.parentElement.classList.add('active');
    }
    const selectedlink = document.querySelector('.sub-menu  a.active');
    if (selectedlink != null) {
      selectedlink.parentElement.classList.add('active');
      setSidebarState({
        ...sidebarState,
        selectedParentMenu: selectedlink.parentElement.parentElement.getAttribute('data-parent'),
      });
      callback;
    } else {
      const selectedParentNoSubItem = document.querySelector('.main-menu  li a.active');
      if (selectedParentNoSubItem != null) {
        setSidebarState({
          ...sidebarState,
          selectedParentMenu: selectedParentNoSubItem.getAttribute('data-flag'),
        });
        callback;
      } else if (sidebarState.selectedParentMenu === '') {
        setSidebarState({
          ...sidebarState,
          selectedParentMenu: menuItems[0] ? menuItems[0].id : null,
        });
        callback;
      }
    }
  };

  const setHasSubItemStatus = () => {
    const hasSubmenu = getIsHasSubItem();
    props.changeSelectedMenuHasSubItems(hasSubmenu);
    toggle();
  };

  const getIsHasSubItem = () => {
    const { selectedParentMenu } = sidebarState;
    const menuItem = menuItems.find((x) => {
      return x.id === selectedParentMenu;
    });
    if (menuItem) return !!(menuItem && menuItem.subs && menuItem.subs.length > 0);
    return false;
  };

  const openSubMenu = (e: any, menuItem: any) => {
    const selectedParent = menuItem.id;
    const hasSubMenu = menuItem.subs && menuItem.subs.length > 0;
    props.changeSelectedMenuHasSubItems(hasSubMenu);
    if (!hasSubMenu) {
      setSidebarState({
        ...sidebarState,
        viewingParentMenu: selectedParent,
        selectedParentMenu: selectedParent,
      });
      toggle();
    } else {
      e.preventDefault();
      const { containerClassnames, menuClickCount } = props.menuReducer;
      const currentClasses = containerClassnames
        ? containerClassnames.split(' ').filter((x: any) => {
            return x !== '';
          })
        : '';

      if (!currentClasses.includes('menu-mobile')) {
        if (
          currentClasses.includes('menu-sub-hidden') &&
          (menuClickCount === 2 || menuClickCount === 0)
        ) {
          props.setContainerClassnames(3, containerClassnames, hasSubMenu);
        } else if (
          currentClasses.includes('menu-hidden') &&
          (menuClickCount === 1 || menuClickCount === 3)
        ) {
          props.setContainerClassnames(2, containerClassnames, hasSubMenu);
        } else if (
          currentClasses.includes('menu-default') &&
          !currentClasses.includes('menu-sub-hidden') &&
          (menuClickCount === 1 || menuClickCount === 3)
        ) {
          props.setContainerClassnames(0, containerClassnames, hasSubMenu);
        }
      } else {
        props.addContainerClassname('sub-show-temporary', containerClassnames);
      }
      setSidebarState({
        ...sidebarState,
        viewingParentMenu: selectedParent,
      });
    }
  };

  const toggleMenuCollapse = (e: any, menuKey: any) => {
    const { collapsedMenus } = sidebarState;
    if (collapsedMenus.indexOf(menuKey) > -1) {
      setSidebarState({
        ...sidebarState,
        collapsedMenus: collapsedMenus.filter((x) => {
          return x !== menuKey;
        }),
      });
    } else {
      collapsedMenus.push(menuKey);
      setSidebarState({
        ...sidebarState,
        collapsedMenus,
      });
    }
    return false;
  };

  return (
    <>
      <div className="sidebar">
        <div className="main-menu">
          <div className="scroll">
            <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
              <Nav vertical className="list-unstyled">
                {menuItems &&
                  menuItems.map((item) => {
                    return (
                      <NavItem
                        key={item.id}
                        className={classnames({
                          active:
                            (sidebarState.selectedParentMenu === item.id &&
                              sidebarState.viewingParentMenu === '') ||
                            sidebarState.viewingParentMenu === item.id,
                        })}
                      >
                        {item.newWindow ? (
                          <a href={item.to} rel="noopener noreferrer" target="_blank">
                            <i className={item.icon} /> {/* <IntlMessages id={item.label} /> */}
                            {item.label}
                          </a>
                        ) : (
                          <NavLink
                            to={item.to}
                            onClick={(e) => {
                              return openSubMenu(e, item);
                            }}
                            data-flag={item.id}
                          >
                            <i className={item.icon} /> {item.label}
                            {/* <IntlMessages id={item.label} /> */}
                          </NavLink>
                        )}
                      </NavItem>
                    );
                  })}
              </Nav>
            </PerfectScrollbar>
          </div>
        </div>

        <div className="sub-menu">
          <div className="scroll">
            <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
              {menuItems &&
                menuItems.map((item) => {
                  return (
                    <Nav
                      key={item.id}
                      className={classnames({
                        'd-block':
                          (sidebarState.selectedParentMenu === item.id &&
                            sidebarState.viewingParentMenu === '') ||
                          sidebarState.viewingParentMenu === item.id,
                      })}
                      data-parent={item.id}
                    >
                      {item.subs &&
                        (item.subs as any).map((sub: any, index: any) => {
                          return (
                            <NavItem
                              key={`${item.id}_${index}`}
                              className={`${sub.subs && sub.subs.length > 0 ? 'has-sub-item' : ''}`}
                            >
                              {sub.newWindow ? (
                                <a href={sub.to} rel="noopener noreferrer" target="_blank">
                                  <i className={sub.icon} /> {/* <IntlMessages id={sub.label} /> */}
                                  {sub.label}
                                </a>
                              ) : sub.subs && sub.subs.length > 0 ? (
                                <>
                                  <NavLink
                                    className={`rotate-arrow-icon opacity-50 ${
                                      sidebarState.collapsedMenus.indexOf(`${item.id}_${index}`) ===
                                      -1
                                        ? ''
                                        : 'collapsed'
                                    }`}
                                    to={sub.to}
                                    id={`${item.id}_${index}`}
                                    onClick={(e) => {
                                      return toggleMenuCollapse(e, `${item.id}_${index}`);
                                    }}
                                  >
                                    <i className="simple-icon-arrow-down" />{' '}
                                    {/* <IntlMessages id={sub.label} /> */}
                                    {sub.label}
                                  </NavLink>

                                  <Collapse
                                    isOpen={
                                      sidebarState.collapsedMenus.indexOf(`${item.id}_${index}`) ===
                                      -1
                                    }
                                  >
                                    <Nav className="third-level-menu">
                                      {sub.subs.map((thirdSub: any, thirdIndex: any) => {
                                        return (
                                          <NavItem key={`${item.id}_${index}_${thirdIndex}`}>
                                            {thirdSub.newWindow ? (
                                              <a
                                                href={thirdSub.to}
                                                rel="noopener noreferrer"
                                                target="_blank"
                                              >
                                                <i className={thirdSub.icon} />{' '}
                                                <IntlMessages id={thirdSub.label} />
                                              </a>
                                            ) : (
                                              <NavLink to={thirdSub.to}>
                                                <i className={thirdSub.icon} />{' '}
                                                <IntlMessages id={thirdSub.label} />
                                              </NavLink>
                                            )}
                                          </NavItem>
                                        );
                                      })}
                                    </Nav>
                                  </Collapse>
                                </>
                              ) : (
                                <NavLink
                                  to={sub.to}
                                  onClick={() => {
                                    return setOnclickMenu(!onClickMenu);
                                  }}
                                >
                                  <i className={sub.icon} /> {/* <IntlMessages id={sub.label} /> */}
                                  {sub.label}
                                </NavLink>
                              )}
                            </NavItem>
                          );
                        })}
                    </Nav>
                  );
                })}
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </>
  );
};

const mapDispatchToProps = {
  ...MenuActions,
};

const mapStateToProps = ({ menuReducer, loginReducer }: any) => {
  return { menuReducer, loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
