import Layout from "../components/Layout";

import { HashRouter as Router, Route, Routes } from "react-router-dom";
import MarkedEditView from "../components/marked/MarkedEditView";
import QmCRUD from "../components/QmCRUD";
import HTMLViewer from "../components/HTMLViewer";
import SOPs from "../components/Pages/SOPs";
import Products from "../components/Pages/Products";
import Product from "../components/Pages/Product";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <h1>Home</h1>
            </Layout>
          }
        />
        <Route
          path="/qmshub.html/sops"
          element={
            <Layout>
              <SOPs />
            </Layout>
          }
        />
        <Route
          path="/qmshub.html/products"
          element={
            <Layout>
              <Products />
            </Layout>
          }
        />
        <Route
          path="/qmshub.html/product"
          element={
            <Layout>
              <Product />
            </Layout>
          }
        />

        <Route path="/qmshub.html/addqm" element={<QmCRUD />} />
        <Route
          path="/qmshub.html/content"
          element={
            <Layout>
              <HTMLViewer />
            </Layout>
          }
        />
        <Route path="about" element={<div>About</div>} />
      </Routes>
    </Router>
  );
}

export default App;
