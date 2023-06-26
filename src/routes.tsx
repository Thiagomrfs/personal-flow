import {
    createBrowserRouter,
    Navigate,
    useLocation,
} from "react-router-dom";

import { useSelector } from 'react-redux';
import { selectUser } from './app/slices/userSlice';
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { MainPage } from "./pages/MainPage/MainPage";
import { ProjectsPage } from "./pages/MainPage/pages/ProjectsPage/ProjectsPage";
import { ProjectPage } from "./pages/MainPage/pages/ProjectPage/ProjectPage";
import { TaskPage } from "./pages/MainPage/pages/TaskPage/TaskPage";


function RequireAuth({ children }: { children: JSX.Element }) {
    const user = useSelector(selectUser)
    let location = useLocation()

    if (!user.id) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/",
        element: <RequireAuth><MainPage /></RequireAuth>,
        children: [
            {
                path: "/",
                element: <ProjectsPage />,
            },
            {
                path: "/projects/:proj_pk",
                element: <ProjectPage />,
            },
            {
                path: "/tasks/:task_pk",
                element: <TaskPage />,
            },
        ]
    },
]);