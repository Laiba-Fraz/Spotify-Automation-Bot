import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Components/LogIn/LogIn";
import "./App.css";
import SignUp from "./Components/SignUp/SignUp";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home.jsx";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword.jsx";
import { AuthContextProvider } from "./Components/context/AuthContext.jsx";
import ResetPassword from "./Components/ForgotPassword/ResetPassword.jsx";
import Getstarted from "./Components/Getstarted/Getstarted.jsx";
import Store from "./Components/AppilotStore/Store.jsx";
import Devices from "./Components/Devices/Devices.jsx";
import Bot from "./Components/Bots/Bot.jsx";
import SimpleLayout from "./Components/Layout/SimpleLayout.jsx";
import Readme from "./Components/Bots/Readme/Readme.jsx";
import Features from "./Components/Bots/Features/Features.jsx";
import Demos from "./Components/Bots/Demo/Demos.jsx";
import Documentation from "./Components/Bots/Documentation/Documentation.jsx";
import Faqs from "./Components/Bots/FAQ/Faqs.jsx";
import Issues from "./Components/Bots/Issues/Issues.jsx";
import NewBot from "./Components/NewBot/NewBot.jsx";
import AddNew from "./Components/Tasks/AddNew/AddNew.jsx";
import Running from "./Components/Tasks/Running/Running.jsx";
import Tasks from "./Components/Tasks/Tasks.jsx";
import Task from "./Components/Tasks/Task/Task.jsx";
import { ThemeProvider } from "./Components/context/ThemeContext.jsx";
import ConfirmEmail from "./Components/ConfirmEmail/ConfirmEmail.jsx";
import { BotsDataProvider } from "./Components/context/botsContext.jsx";
import ScheduleTasks from "./Components/Tasks/Schedule/ScheduleTasks.jsx";
import { AddToPhoneOverlayProvider } from "./Components/context/AddToPhone.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
          children: [
            {
              path: "get-started",
              element: <Getstarted />,
            },
            {
              path: "store",
              element: <SimpleLayout />,
              children: [
                {
                  path: "",
                  element: <Store />,
                },
                {
                  path: ":id",
                  element: <Bot />,
                  children: [
                    {
                      path: "",
                      element: <Readme />,
                    },
                    {
                      path: "features",
                      element: <Features />,
                    },
                    {
                      path: "demos",
                      element: <Demos />,
                    },
                    {
                      path: "documentation",
                      element: <Documentation />,
                    },
                    {
                      path: "faqs",
                      element: <Faqs />,
                    },
                    {
                      path: "issues",
                      element: <Issues />,
                    },
                  ],
                },
              ],
            },
            {
              path: "devices",
              element: <SimpleLayout />,
              children: [
                { path: "", element: <Devices /> },
                { path: "new", element: <NewBot /> },
              ],
            },

            {
              path: "tasks",
              element: <SimpleLayout />,
              children: [
                {
                  path: "",
                  element: <Tasks />,
                },
                {
                  path: "add-new",
                  element: <NewBot />,
                },
                {
                  path: ":id",
                  element: <Task />,
                },
                // {
                //   path: "add-new",
                //   element: <AddNew />,
                // },
                {
                  path: "schedule",
                  element: <ScheduleTasks />,
                },
                {
                  path: "running",
                  element: <Running />,
                },
              ],
            },
          ],
        },
        {
          path: "log-in",
          element: <Login />,
        },
        {
          path: "sign-up",
          element: <SignUp />,
        },
        {
          path: "verify-email/:token",
          element: <ConfirmEmail />,
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "reset-password/:token",
          element: <ResetPassword />,
        },
      ],
    },
  ]);

  return (
    <ThemeProvider>
        <AuthContextProvider>
          <BotsDataProvider>
            <AddToPhoneOverlayProvider>
            <RouterProvider router={router} />
            </AddToPhoneOverlayProvider>
          </BotsDataProvider>
        </AuthContextProvider>
    </ThemeProvider>
  );
}

export default App;
