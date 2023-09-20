import Layout from "../components/Layout";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import MarkedEditView from "../components/marked/MarkedEditView";
import AddSOP from "../components/AddSOP";
import Notfound from "../components/Notfound";
import QmCRUD from "../components/QmCRUD";
import ProdCRUD from "../components/ProdCRUD";
import TemplateCRUD from "../components/TemplateCRUD";
import HTMLViewer from "../components/HTMLViewer";
import SOPs from "../components/Pages/SOPs";
import Products from "../components/Pages/Products";

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
        path: "/qmshub.html/sops",
        element: <SOPs></SOPs>,
      },
      {
        path: "/qmshub.html/products",
        element: <Products />,
      },
      {
        path: "/qmshub.html/marked",
        element: (
          <MarkedEditView
            inputText={""}
            setInputText={() => {}}
            objectId=""
            relativePath=""
            type=""
            branchName=" "
          ></MarkedEditView>
        ),
      },
      // {
      //   path: "/qmshub.html/addsop",
      //   element: <AddSOP></AddSOP>,
      // },
      {
        path: "/qmshub.html/addqm",
        element: <QmCRUD></QmCRUD>,
      },
      // {
      //   path: "/qmshub.html/addprod",
      //   element: <ProdCRUD />,
      // },
      // {
      //   path: "/qmshub.html/addtemp",
      //   element: <TemplateCRUD></TemplateCRUD>,
      // },
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
