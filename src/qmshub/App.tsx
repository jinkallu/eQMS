import Layout from "../components/Layout";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import MarkedEditView from "../components/marked/MarkedEditView";
import SOPCRUD from "../components/SOPCRUD";
import Notfound from "../components/Notfound";
import QmCRUD from "../components/QmCRUD";
import ProdCRUD from "../components/ProdCRUD";
import TemplateCRUD from "../components/TemplateCRUD";
import HTMLViewer from "../components/HTMLViewer";

const router = createBrowserRouter([
  {
    path: "/qmshub.html",
    element: <Layout></Layout>,
    errorElement: <Notfound></Notfound>,
    children: [
      {
        path: "/qmshub.html/",
        element: <h1>Home</h1>,
      },
      {
        path: "/qmshub.html/marked",
        element: <MarkedEditView></MarkedEditView>,
      },
      {
        path: "/qmshub.html/sopcrud",
        element: <SOPCRUD></SOPCRUD>,
      },
      {
        path: "/qmshub.html/qmcrud",
        element: <QmCRUD></QmCRUD>,
      },
      {
        path: "/qmshub.html/prodcrud",
        element: <ProdCRUD />,
      },
      {
        path: "/qmshub.html/tempcrud",
        element: <TemplateCRUD></TemplateCRUD>,
      },
      {
        path: "/qmshub.html/content",
        element: <HTMLViewer></HTMLViewer>,
      },
    ],
  },
  {
    path: "about",
    element: <div>About</div>,
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
