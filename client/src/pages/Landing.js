import React from 'react';
import main from '../assets/images/main-alternative.svg';
import Wrapper from '../assets/wrappers/LandingPage';
import { Logo } from '../components';
import { Link, Navigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext';

const Landing = () => {
    const { user } = useAppContext();
    return ( 
        <React.Fragment>
            {user && <Navigate to='/' />}
            <Wrapper>
                <nav>
                    <Logo />
                </nav>
                <div className='container page'>
                    <div className='info'>
                        <h1>
                            job <span>tracking</span> app
                        </h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        <Link to='/register' className='btn btn-hero'>
                            Login / Register
                        </Link>
                    </div>
                    <img src={main} alt='job hunt' className='img main-img' />
                </div>
            </Wrapper>
        </React.Fragment>
    );
}


export default Landing;