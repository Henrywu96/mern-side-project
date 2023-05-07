import { useAppContext } from "../context/appContext";

const Alert = () => {
    // dynamic alert type and text
    const {alertType, alertText} = useAppContext();

    return ( 
        <div className={`alert alert-${alertType}`}>{alertText}</div>
    );
}

export default Alert;