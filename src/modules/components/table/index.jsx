import { lazy } from "react";

const Basic = lazy(() => import("./Basic"));

export const tableComponentConfigs = [
  {
    path: "/components/table/basic-table",
    element: <Basic />,
  },
];
