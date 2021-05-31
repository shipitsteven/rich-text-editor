import React from 'react';

const Leaf = ({ props }) => {
  const { leaf } = props;
  let { attributes, children } = props;

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.strikethrough) {
    children = <del>{children}</del>;
  }
  if (leaf.headingone) {
    if (leaf.colorText && leaf.highlight) {
      children = (
        <h1
          style={{
            color: `${leaf.textColor}`,
            backgroundColor: `${leaf.highlightColor}`,
          }}
        >
          {children}
        </h1>
      );
    } else if (leaf.highlight) {
      children = (
        <h1 style={{ backgroundColor: `${leaf.highlightColor}` }}>
          {children}
        </h1>
      );
    } else if (leaf.colorText) {
      children = <h1 style={{ color: `${leaf.textColor}` }}>{children}</h1>;
    } else {
      children = <h1>{children}</h1>;
    }
  }
  if (leaf.headingtwo) {
    if (leaf.colorText && leaf.highlight) {
      children = (
        <h3
          style={{
            color: `${leaf.textColor}`,
            backgroundColor: `${leaf.highlightColor}`,
          }}
        >
          {children}
        </h3>
      );
    } else if (leaf.highlight) {
      children = (
        <h3 style={{ backgroundColor: `${leaf.highlightColor}` }}>
          {children}
        </h3>
      );
    } else if (leaf.colorText) {
      children = <h3 style={{ color: `${leaf.textColor}` }}>{children}</h3>;
    } else {
      children = <h3>{children}</h3>;
    }
  }

  if (leaf.colorText && leaf.highlight) {
    attributes = {
      ...attributes,
      style: {
        color: `${leaf.textColor}`,
        backgroundColor: `${leaf.highlightColor}`,
      },
    };
  } else if (leaf.highlight) {
    attributes = {
      ...attributes,
      style: { backgroundColor: `${leaf.highlightColor}` },
    };
  } else if (leaf.colorText) {
    attributes = { ...attributes, style: { color: `${leaf.textColor}` } };
  }

  return <span {...attributes}>{children}</span>;
};

export default Leaf;
