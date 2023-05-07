import { initialState } from "./appContext";
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

const reducer = (state, action) => {
    if(action.type === DISPLAY_ALERT) {
        return {
            ...state, 
            showAlert: true, 
            alertType: 'danger', 
            alertText: 'Please enter all values!'
        }
    }

    if(action.type === CLEAR_ALERT) {
        return {
            ...state, 
            showAlert: false, 
            alertType: '', 
            alertText: ''
        }
    }

    // register user begin
    if (action.type === REGISTER_USER_BEGIN) {
        return { ...state, isLoading: true };
    }

    // register user success
    if (action.type === REGISTER_USER_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            // token: action.payload.token, //* removed after using cookies
            user: action.payload.user,
            userLocation: action.payload.location,
            jobLocation: action.payload.location,
            showAlert: true,
            alertType: 'success',
            alertText: 'User Created!'
        };
    }

    // register user error
    if (action.type === REGISTER_USER_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg
        };
    }

    // login user begin
    if (action.type === LOGIN_USER_BEGIN) {
        return { ...state, isLoading: true };
    }

    // login user success
    if (action.type === LOGIN_USER_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            // token: action.payload.token, //* removed after using cookies
            user: action.payload.user,
            userLocation: action.payload.location,
            jobLocation: action.payload.location,
            showAlert: true,
            alertType: 'success',
            alertText: 'Login Successful!'
        };
    }

    // login user error
    if (action.type === LOGIN_USER_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg
        };
    }

    // toggle sidebar
    if (action.type === TOGGLE_SIDEBAR) {
        return {
            ...state,
            showSidebar: !state.showSidebar
        };
    }

    // logout user
    if (action.type === LOGOUT_USER) {
        return {
            ...initialState,
            userLoading: false
            // user: null,
            // token: null, //* removed after using cookies
            // userLocation: '',
            // jobLocation: ''
        };
    }

    // update user begin
    if (action.type === UPDATE_USER_BEGIN) {
        return { ...state, isLoading: true };
    }

    // update user success
    if (action.type === UPDATE_USER_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            // token: action.payload.token, //* removed after using cookies
            user: action.payload.user,
            userLocation: action.payload.location,
            jobLocation: action.payload.location,
            showAlert: true,
            alertType: 'success',
            alertText: 'User Profile Updated!'
        };
    }

    // update user error
    if (action.type === UPDATE_USER_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg
        };
    }

    // handle add job change
    if (action.type === HANDLE_CHANGE) {
        return {
            ...state,
            page: 1,
            [action.payload.name]: action.payload.value
        };
    }

    // clear add job values
    if (action.type === CLEAR_VALUES) {
        const initialState = {
            isEditing: false,
            editJobId: '',
            position: '',
            company: '',
            jobLocation: state.userLocation,
            jobType: 'Full-time',
            status: 'Pending'
        }
        return {
            ...state,
            ...initialState
        };
    }

    // create job begin
    if (action.type === CREATE_JOB_BEGIN) {
        return { ...state, isLoading: true };
    }

    // create job success
    if (action.type === CREATE_JOB_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'success',
            alertText: 'New Job Created!'
        };
    }

    // create job error
    if (action.type === CREATE_JOB_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg
        };
    }

    // get jobs begin
    if (action.type === GET_JOBS_BEGIN) {
        return {
            ...state,
            isLoading: true,
            showAlert: false
        };
    }

    // get jobs success
    if (action.type === GET_JOBS_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            jobs: action.payload.jobs,
            totalJobs: action.payload.totalJobs,
            numOfPages: action.payload.numOfPages,
        };
    }

    // set edit job
    if (action.type === SET_EDIT_JOB) {
        const job = state.jobs.find((job) => job._id === action.payload.id);
        const { _id, position, company, jobLocation, jobType, status } = job;

        return {
            ...state,
            isEditing: true,
            editJobId: _id,
            position,
            company,
            jobLocation,
            jobType,
            status
        }
    }

    // delete job begin
    if (action.type === DELETE_JOB_BEGIN) {
        return {
            ...state,
            isLoading: true
        }
    }

    // delete job error
    if (action.type === DELETE_JOB_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg
        };
    }

    // edit job begin
    if (action.type === EDIT_JOB_BEGIN) {
        return {
            ...state,
            isLoading: true
        };
    }

    // edit job success
    if (action.type === EDIT_JOB_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'success',
            alertText: 'Job Updated!'
        };
    }

    // edit job error
    if (action.type === EDIT_JOB_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg
        };
    }

    // show stats begin
    if (action.type === SHOW_STATS_BEGIN) {
        return {
            ...state,
            isLoading: true,
            showAlert: false
        };
    }

    // show stats success
    if (action.type === SHOW_STATS_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            stats: action.payload.stats,
            monthlyApplications: action.payload.monthlyApplications
        };
    }

    // clear filters
    if (action.type === CLEAR_FILTERS) {
        return {
            ...state,
            search: '',
            searchStatus: 'All',
            searchType: 'All',
            sort: 'Latest'
        }
    }

    // change page
    if (action.type === CHANGE_PAGE) {
        return {
            ...state,
            page: action.payload.page
        }
    }

    // get current user begin
    if (action.type === GET_CURRENT_USER_BEGIN) {
        return {
            ...state,
            userLoading: true,
            showAlert: false
        }
    }

    // get current user success
    if (action.type === GET_CURRENT_USER_SUCCESS) {
        return {
            ...state,
            userLoading: false,
            user: action.payload.user,
            userLocation: action.payload.location,
            jobLocation: action.payload.location,
        }
    }

    throw new Error(`no such action: ${action.type}`);
}

export default reducer;