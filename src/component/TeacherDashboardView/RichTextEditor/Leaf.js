import React from "react";

// Leaf = HTML inline elements
const Leaf = ({ attributes, children, leaf }) => {
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
    attributes = { ...attributes, style: { textDecoration: "underline" } };
  }

  if (leaf.highlight) {
    children = <mark>{children}</mark>;
  }

  if (leaf.strikethrough) {
    attributes = { ...attributes, style: { textDecoration: "line-through" } };
  }

  return <span {...attributes}>{children}</span>;
};

export default Leaf;
