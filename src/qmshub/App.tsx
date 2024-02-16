import Layout from "../components/Layout";

import {
  createBrowserRouter,
  RouterProvider,
  HashRouter as Router,
  Route,
  Link,
  Routes  
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
import Product from "../components/Pages/Product";
import ProcessFlow from "../components/ProcessFlow";

// const router = createBrowserRouter([
//   {
//     path: "/qmshub.html/",
//     element: <Layout></Layout>,
//     errorElement: <Notfound></Notfound>,
//     children: [
//       {
//         path: "/qmshub.html/",
//         element: <h1>Home</h1>,
//       },

//       {
//         path: "/qmshub.html/processflow",
//         element: <ProcessFlow></ProcessFlow>,
//       },

//       {
//         path: "/qmshub.html/sops",
//         element: <SOPs></SOPs>,
//       },
//       {
//         path: "/qmshub.html/products",
//         element: <Products />,
//       },
//       {
//         path: "/qmshub.html/product",
//         element: <Product />,
//       },
//       {
//         path: "/qmshub.html/marked",
//         element: (
//           <MarkedEditView
//             inputText={""}
//             setInputText={() => {}}
//             objectId=""
//             relativePath=""
//             type=""
//             branchName=" "
//           ></MarkedEditView>
//         ),
//       },
//       // {
//       //   path: "/qmshub.html/addsop",
//       //   element: <AddSOP></AddSOP>,
//       // },
//       {
//         path: "/qmshub.html/addqm",
//         element: <QmCRUD></QmCRUD>,
//       },
//       // {
//       //   path: "/qmshub.html/addprod",
//       //   element: <ProdCRUD />,
//       // },
//       // {
//       //   path: "/qmshub.html/addtemp",
//       //   element: <TemplateCRUD></TemplateCRUD>,
//       // },
//       {
//         path: "/qmshub.html/content",
//         element: <HTMLViewer></HTMLViewer>,
//       },
//     ],
//   },
//   {
//     path: "about",
//     element: <div>About</div>,
//   },
// ]);

// function App() {
//   //return   <ProcessFlow></ProcessFlow>

//    return <RouterProvider router={router}></RouterProvider>;
// }



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><h1>Home</h1></Layout>} />
        <Route path="/qmshub.html/processflow" element={<ProcessFlow />} />
        <Route path="/qmshub.html/sops" element={<Layout> <SOPs /> </Layout>} />
        <Route path="/qmshub.html/products" element={<Layout><Products /></Layout>} />
        <Route path="/qmshub.html/product" element={<Layout><Product /></Layout>} />
        <Route path="/qmshub.html/marked" element={<MarkedEditView inputText="" setInputText={() => {}} objectId="" relativePath="" type="" branchName=" " />} />
        <Route path="/qmshub.html/addqm" element={<QmCRUD />} />
        <Route path="/qmshub.html/content" element={<Layout><HTMLViewer /></Layout>} />
        <Route path="about" element={<div>About</div>} />
        {/* other routes... */}
      </Routes>
    </Router>
  );
}

export default App;
