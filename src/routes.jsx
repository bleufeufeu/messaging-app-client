import App from "./App";
import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Settings from "./pages/Settings/Settings";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
        {
            index: true,
            element: <Home />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/settings",
          element: <Settings />,
        }
    ],
  },
];

export default routes;