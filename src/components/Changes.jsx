import React from "react";

export const Changes = ({data}) => <>
  {data.total.toLocaleString()} - Diff: {data.diff.toLocaleString()} (
  {data.percentageStr})
</>;
