import React, { useState, useRef, useEffect } from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import {
  getCurrentColor,
  setCurrentColor,
  getCurrentRadius,
  setCurrentRadius,
} from '../../helpers/Utils';
import { colors } from '../../constants/defaultValues';

const ColorSwitcher = () => {
  const containerRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor] = useState(getCurrentColor());
  const [radius, setRadius] = useState(getCurrentRadius());

  useEffect(() => {
    if (radius === 'flat') {
      document.body.classList.remove('rounded');
    } else {
      document.body.classList.add('rounded');
    }
    setCurrentRadius(radius);
    if (isOpen) setIsOpen(false);
  }, [radius]);

  const handleDocumentClick = (e:any) => {
    if (isOpen) {
      // const container = containerRef.current;
      // if(container !== undefined) {
      //   if (container?.contains(e.target) || container === e.target) {
      //     return;
      //   }
      // }
      setIsOpen(false);
    }
  };

  useEffect(() => {
    ['click', 'touchstart'].forEach((event) =>
      {return document.addEventListener(event, handleDocumentClick, false)},
    );

    return () => {
      ['click', 'touchstart'].forEach((event) =>
        {return document.removeEventListener(event, handleDocumentClick, false)},
      );
    };
  }, [isOpen]);

  const changeThemeColor = (e: any, color:any) => {
    e.preventDefault();
    setCurrentColor(color);
    setIsOpen(false);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div ref={containerRef} className={`theme-colors ${isOpen ? 'shown' : ''}`}>
      <div className="p-4">
        <p className="text-muted mb-2">Light Theme</p>
        <div className="d-flex flex-row justify-content-between mb-3">
          {colors.slice(0, 5).map((color) => {return (
            <a
              key={`light.${color}`}
              href={`#light.${color}`}
              className={`theme-color theme-color-${color} ${
                selectedColor === `light.${color}` ? 'active' : ''
              }`}
              onClick={(e) => {return changeThemeColor(e, `light.${color}`)}}
            >
              <span>{` `}</span>
            </a>
          )})}
        </div>
        <div className="d-flex flex-row justify-content-between mb-4">
          {colors.slice(5, 10).map((color) => {return (
            <a
              key={`light.${color}`}
              href={`#light.${color}`}
              className={`theme-color theme-color-${color} ${
                selectedColor === `light.${color}` ? 'active' : ''
              }`}
              onClick={(e) => {return changeThemeColor(e, `light.${color}`)}}
            >
              <span>{` `}</span>
            </a>
          )})}
        </div>
        <p className="text-muted mb-2">Dark Theme</p>
        <div className="d-flex flex-row justify-content-between mb-3">
          {colors.slice(0, 5).map((color) => {return (
            <a
              key={`dark.${color}`}
              href={`#dark.${color}`}
              className={`theme-color theme-color-${color} ${
                selectedColor === `dark.${color}` ? 'active' : ''
              }`}
              onClick={(e) => {return changeThemeColor(e, `dark.${color}`)}}
            >
              <span>{` `}</span>
            </a>
          )})}
        </div>
        <div className="d-flex flex-row justify-content-between">
          {colors.slice(5, 10).map((color) => {return (
            <a
              key={`dark.${color}`}
              href={`#dark.${color}`}
              className={`theme-color theme-color-${color} ${
                selectedColor === `dark.${color}` ? 'active' : ''
              }`}
              onClick={(e) => {return changeThemeColor(e, `dark.${color}`)}}
            >
              <span>{` `}</span>
            </a>
          )})}
        </div>
      </div>
      <div className=" pb-0 pl-4 pt-4">
        <FormGroup>
          <Label for="radiusRadio">Border Radius </Label>
          <div>
            <Input
              type="radio"
              name="radiusRadio"
              id="rounded"
              label="Rounded"
              inline="true"
              defaultChecked={radius === 'rounded'}
              onChange={() => {return setRadius('rounded')}}
            />
            <Input
              type="radio"
              name="radiusRadio"
              id="flat"
              label="Flat"
              inline="true"
              defaultChecked={radius === 'flat'}
              onChange={() => {return setRadius('flat')}}
            />
          </div>
        </FormGroup>
      </div>

      <a
        href="#section"
        className="theme-button"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        {' '}
        <i className="simple-icon-magic-wand" />{' '}
      </a>
    </div>
  );
};

export default ColorSwitcher;
