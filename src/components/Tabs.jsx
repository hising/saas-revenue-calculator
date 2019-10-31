import React from "react";

export const Tabs = ({items = [], active = null, onChange = null}) => {
  const clickCallback = (key) => {
    if (onChange) {
      onChange(key);
    }
  };

  let tabs = items.map((item) => {
    let linkClass = "nav-link" + ((active === item.key) ? " active" : "");
    return <li key={item.key} onClick={(event) => {
      event.preventDefault();
      clickCallback(item.key);
    }} className={"nav-item"}><a className={linkClass} href={`#${item.key}`}>{item.label}</a></li>
  });
  return <ul className={"nav nav-tabs"}>{tabs}</ul>;
};
