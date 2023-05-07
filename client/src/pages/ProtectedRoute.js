import { useAppContext } from "../context/appContext";
import { Navigate } from "react-router-dom";
import Loading from '../components/Loading';

const ProtectedRoute = ({ children }) => {
    const { user, userLoading } = useAppContext();

    // if the user still loading
    if (userLoading) return <Loading />;

    // if the user doesn't exist, navigate away
    if (!user) {
        return <Navigate to="/landing" />
    }

    return children;
}
 
export default ProtectedRoute;