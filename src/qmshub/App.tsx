import Layout from "../components/Layout";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/qmshub.html",
    element: <Layout></Layout>,
    children: [
      {
        path: "/qmshub.html/",
        element: <h1>Home</h1>,
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
