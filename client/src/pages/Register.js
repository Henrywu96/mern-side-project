import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo, FormRow, Alert } from "../components";
import Wrapper from "../assets/wrappers/RegisterPage";
import { useAppContext } from "../context/appContext";


// setup initial state
const initialState = {
    name: "",
    email: "",
    password: "",
    isMember: true
}

const Register = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState(initialState);
    const { user, isLoading, showAlert, displayAlert, registerUser, loginUser } = useAppContext();
    
    const toggleMember = () => {
        setValues({...values, isMember: !values.isMember});
    }

    const handleChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const {name, email, password, isMember} = values;

        if (!email || !password || (!isMember && !name)) {
            displayAlert();
            return;
        }
        const currentUser = { name, email, password };
        // check if the user is already a member
        if (isMember) {
            loginUser(currentUser);
        } else {
            registerUser(currentUser);
        }

        // console.log(values);
    }

    useEffect(() => {
        if (user) {
            setTimeout(() => { 
                navigate('/');
            }, 2000);
        }
    }, [user, navigate]);

    return ( 
        <Wrapper className="full-page">
            <form className="form" onSubmit={handleSubmit}>
                <Logo />
                
                {/* change the text based on user's membership */}
                <h3>{values.isMember ? "Login" : "Register"}</h3>
                {showAlert && <Alert />}

                {/* name input */}
                {!values.isMember && (
                    <FormRow type='text' name='name' value={values.name} handleChange={handleChange} />
                )}

                {/* email input */}
                <FormRow type='email' name='email' value={values.email} handleChange={handleChange} />

                {/* password input */}
                <FormRow type='password' name='password' value={values.password} handleChange={handleChange} />

                <button type="submit" className="btn btn-block" disabled={isLoading}>
                    Submit
                </button>

                {/* button for demo app */}
                <button
                    type="button"
                    className="btn btn-block btn-hipster"
                    disabled={isLoading}
                    onClick={() => {
                        const currentUser = { email: 'testuser@test.com', password: '123123' };
                        loginUser(currentUser);
                    }}
                >
                    {isLoading ? 'loading...' : 'demo app'}
                </button>

                <p>   
                    {values.isMember ? "Not a member yet?" : "Already a member?"}
                    <button type="button" onClick={toggleMember} className='member-btn'>
                        {values.isMember ? "Register" : "Login"}
                    </button>
                </p>
            </form>
        </Wrapper>
    );
}

export default Register;