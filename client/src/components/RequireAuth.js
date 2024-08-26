import { useRef } from 'react';
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Layout from "./layout";
import { toast } from 'react-toastify'; 

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const toastDisplayed = useRef(false); 

    if (!auth?.token) {
        if (!toastDisplayed.current) {
            toast.error('You must log in first', {
                toastId: 'auth-error', 
            });
            toastDisplayed.current = true;
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <Layout>
            <Outlet />
        </Layout>
    );
};

export default RequireAuth;
