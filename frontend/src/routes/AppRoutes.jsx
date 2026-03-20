import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "@/layout/AppLayout.jsx";
import { Dashboard, Predict, NLPClassify, Forecast, Hotspot } from "@/pages";

const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "predict",
          element: <Predict />,
        },
        {
          path: "nlp",
          element: <NLPClassify />,
        },
        {
          path: "forecast",
          element: <Forecast />,
        },
        {
          path: "hotspot",
          element: <Hotspot />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
