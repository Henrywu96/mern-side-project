import React, { useReducer, useContext, useEffect } from 'react';
import axios from 'axios';
import reducer from './reducers';
import {
    DISPLAY_ALERT,
    CLEAR_ALERT,
    REGISTER_USER_BEGIN,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,
    LOGIN_USER_BEGIN,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,
    TOGGLE_SIDEBAR,
    LOGOUT_USER,
    UPDATE_USER_BEGIN,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    HANDLE_CHANGE,
    CLEAR_VALUES,
    CREATE_JOB_BEGIN,
    CREATE_JOB_SUCCESS,
    CREATE_JOB_ERROR,
    GET_JOBS_BEGIN,
    GET_JOBS_SUCCESS,
    SET_EDIT_JOB,
    DELETE_JOB_BEGIN,
    DELETE_JOB_ERROR,
    EDIT_JOB_BEGIN,
    EDIT_JOB_SUCCESS,
    EDIT_JOB_ERROR,
    SHOW_STATS_BEGIN,
    SHOW_STATS_SUCCESS,
    CLEAR_FILTERS,
    CHANGE_PAGE,
    GET_CURRENT_USER_BEGIN,
    GET_CURRENT_USER_SUCCESS
} from "./actions";

//* get values from local storage, no need after using cookies. get those values directly from the server
// const user = localStorage.getItem('user');
// const token = localStorage.getItem('token');
// const userLocation = localStorage.getItem('location');

// setup initial state
const initialState = {
    userLoading: true,
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    // user: user ? JSON.parse(user) : null, //* before using cookies
    user: null, //* after using cookies
    // token: token, //* before using cookies
    // userLocation: userLocation || '', //* before using cookies
    userLocation: '', //* after using cookies
    showSidebar: false,
    isEditing: false,
    editJobId: '',
    position: '',
    company: '',
    // jobLocation: userLocation || '', //* before using cookies
    jobLocation: '', //* after using cookies
    jobTypeOptions: ['Full-time', 'Part-time', 'Remote', 'Internship'],
    jobType: 'full-time',
    statusOptions: ['Interview', 'Declined', 'Pending'],
    status: 'Pending',
    jobs: [],
    totalJobs: 0,
    numOfPages: 1,
    page: 1,
    stats: {},
    monthlyApplications: [],
    search: '',
    searchStatus: 'All',
    searchType: 'All',
    sort: 'Latest',
    sortOptions: ['Latest', 'Oldest', 'A-Z', 'Z-A']
}

const AppContext = React.createContext();

const AppProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // axios
    // Global setup
    // axios.defaults.headers['Authorization'] = `Bearer ${state.token}`; 

    // Custom instance setup
    const authFetch = axios.create({
        baseURL: '/api/v1',
    });

    //* Axios interceptors
    //* request, no need it after using cookies
    // authFetch.interceptors.request.use((config) => {
    //     config.headers['Authorization'] = `Bearer ${state.token}`;
    //     return config;
    // }, (err) => {
    //     return Promise.reject(err);
    // });

    // response
    authFetch.interceptors.response.use((response) => {
        return response;
    }, (err) => {
        console.log(err.response);

        if (err.response.status === 401) {
            logoutUser();
        }
        return Promise.reject(err);
    });

    //* Alert
    // display alert
    const displayAlert = () => {
        dispatch({type: DISPLAY_ALERT});
        clearAlert(); // clear alert after display alert
    }

    // clear alert
    const clearAlert = () => {
        setTimeout(() => {
            dispatch({type: CLEAR_ALERT});
        }, 3000);
    }

    //* Local storage
    //* no need it after using cookies
    // add user to local storage 
    // const addUserToLocalStorage = ({ user, token, location }) => {
    //     localStorage.setItem('user', JSON.stringify(user));
    //     localStorage.setItem('token', token);
    //     localStorage.setItem('location', location);
    // }

    // remove user from local storage
    // const removeUserFromLocalStorage = () => {
    //     localStorage.removeItem('user');
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('location');
    // }

    // register user
    const registerUser = async (currentUser) => {
        dispatch({ type: REGISTER_USER_BEGIN });

        // Add data to the server
        try {
            // Sending the current user object 
            const response = await axios.post('/api/v1/auth/register', currentUser);
            // console.log(response);
            
            //* no need after using cookies
            // Successful register the user
            // const { user, token, location } = response.data;
            // dispatch({ type: REGISTER_USER_SUCCESS, payload: { user, token, location } });

            //* using cookies
            const { user, location } = response.data;
            dispatch({ type: REGISTER_USER_SUCCESS, payload: { user, location } });

            // Local storage
            // addUserToLocalStorage({ user, token, location }); //* no need after using cookies
        } catch (err) {
            // console.log(err.response);
            dispatch({ type: REGISTER_USER_ERROR, payload: { msg: err.response.data.msg } });
        }
        clearAlert();
    }

    // login user
    const loginUser = async (currentUser) => {
        dispatch({ type: LOGIN_USER_BEGIN });

        try {
            // Sending the current user object 
            const { data } = await axios.post('/api/v1/auth/login', currentUser);
            
            //* no need after using cookies
            // Successful login the user
            // const { user, token, location } = data;
            // dispatch({ type: LOGIN_USER_SUCCESS, payload: { user, token, location } });

            const { user, location } = data;
            dispatch({ type: LOGIN_USER_SUCCESS, payload: { user, location } });

            // Local storage
            // addUserToLocalStorage({ user, token, location }); //* no need after using cookies
        } catch (err) {
            dispatch({ type: LOGIN_USER_ERROR, payload: { msg: err.response.data.msg } });
        }
        clearAlert();
    }

    // toggle sidebar
    const toggleSidebar = () => {
        dispatch({ type: TOGGLE_SIDEBAR });
    }

    // logout user
    const logoutUser = async () => {
        await authFetch.get('/auth/logout');
        dispatch({ type: LOGOUT_USER });
        // removeUserFromLocalStorage(); //* no need after using cookies
    }

    // update user
    const updateUser = async (currentUser) => {
        dispatch({ type: UPDATE_USER_BEGIN });

        try {
            const { data } = await authFetch.patch('/auth/updateUser', currentUser);
            
            // const { user, location, token } = data;
            const { user, location } = data; //* using cookies

            // dispatch and pass in to reducer
            // dispatch({ type: UPDATE_USER_SUCCESS, payload: { user, location, token } });
            dispatch({ type: UPDATE_USER_SUCCESS, payload: { user, location } });

            // addUserToLocalStorage({ user, location, token }); //* no need after using cookies
        } catch (err) {
            // console.log(err.response);
            if (err.response.status !== 401) {
                dispatch({ type: UPDATE_USER_ERROR, payload: {msg: err.response.data.msg} });
            } 
        }
        clearAlert();
    }

    // handle add job change
    const handleChange = ({ name, value }) => {
        dispatch({type: HANDLE_CHANGE, payload:{name, value}});
    }

    // clear add job values
    const clearValues = () => {
        dispatch({ type: CLEAR_VALUES });
    }

    // create job
    const createJob = async () => {
        dispatch({ type: CREATE_JOB_BEGIN });

        try {
            const { position, company, jobLocation, jobType, status } = state;
            await authFetch.post('/jobs', {
                position, company, jobLocation, jobType, status
            });

            dispatch({ type: CREATE_JOB_SUCCESS });
            // clear all values after created job
            dispatch({ type: CLEAR_VALUES });
        } catch (err) {
            if (err.response.status === 401) return;

            dispatch({
                type: CREATE_JOB_ERROR,
                payload: { msg: err.response.data.msg }
            });
        }
        clearAlert();
    }

    // get jobs
    const getJobs = async () => {
        // pull out values from the state
        const { search, searchStatus, searchType, sort, page } = state;
        let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;

        // if search is not empty
        if (search) {
            url = url + `&search=${search}`;
        }

        dispatch({ type: GET_JOBS_BEGIN });

        try {
            // fetch the data
            const { data } = await authFetch(url);
            const { jobs, totalJobs, numOfPages } = data;

            dispatch({
                type: GET_JOBS_SUCCESS,
                payload: { jobs, totalJobs, numOfPages }
            });
        } catch (err) {
            logoutUser();
        }
        clearAlert();
    }

    // set edit job
    const setEditJob = (id) => {
        dispatch({ type: SET_EDIT_JOB, payload: { id } });
    }

    // edit job
    const editJob = async () => {
        dispatch({ type: EDIT_JOB_BEGIN });

        try {
            const { position, company, jobLocation, jobType, status } = state;

            await authFetch.patch(`/jobs/${state.editJobId}`, {
                position, company, jobLocation, jobType, status
            });

            dispatch({ type: EDIT_JOB_SUCCESS });
            dispatch({ type: CLEAR_VALUES });
        } catch (err) {
            if (err.response.status === 401) return;
            dispatch({ type: EDIT_JOB_ERROR, payload: { msg: err.response.data.msg } });
        }
        clearAlert();
    }

    // delete job
    const deleteJob = async (jobId) => {
        dispatch({ type: DELETE_JOB_BEGIN });

        try {
            await authFetch.delete(`/jobs/${jobId}`);
            getJobs();
        } catch (err) {
            if (err.response.status === 401) return;
            dispatch({ type: DELETE_JOB_ERROR, payload: { msg: err.response.data.msg } });
        }
        clearAlert();
    }

    // show stats
    const showStats = async () => {
        dispatch({ type: SHOW_STATS_BEGIN });

        try {
            const { data } = await authFetch.get('/jobs/stats');

            dispatch({
                type: SHOW_STATS_SUCCESS,
                payload: { stats: data.defaultStats, monthlyApplications: data.monthlyApplications }
            });
        } catch (err) {
            logoutUser();
        }
        clearAlert();
    }

    // clear filters
    const clearFilters = () => {
        dispatch({ type: CLEAR_FILTERS });
    }

    // change page
    const changePage = (page) => {
        dispatch({ type: CHANGE_PAGE, payload: { page } });
    }
    
    // get current user
    const getCurrentUser = async () => {
        dispatch({ type: GET_CURRENT_USER_BEGIN });

        try {
            const { data } = await authFetch('/auth/getCurrentUser');
            const { user, location } = data;
            dispatch({
                type: GET_CURRENT_USER_SUCCESS,
                payload: {user, location}
            })
        } catch (err) {
            if (err.response.status === 401) return;
            logoutUser();
        }
    }
    useEffect(() => {
        getCurrentUser();
        // eslint-disable-next-line
    }, []);

    return (
        <AppContext.Provider value={{
            ...state,
            displayAlert,
            registerUser,
            loginUser,
            toggleSidebar,
            logoutUser,
            updateUser,
            handleChange,
            clearValues,
            createJob,
            getJobs,
            setEditJob,
            editJob,
            deleteJob,
            showStats,
            clearFilters,
            changePage,
            getCurrentUser
        }}>
            {children}
        </AppContext.Provider>
    );
}

const useAppContext = () => {
    return useContext(AppContext);
}


export {AppProvider, initialState, useAppContext}