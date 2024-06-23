import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Layout from "./layout";

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.token
            ? <Layout>
                <Outlet />
            </Layout>
            : <Navigate to="/login" state={{ from: location }} replace />

    );
};

export default RequireAuth;