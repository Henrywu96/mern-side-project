import { useEffect } from "react";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/JobsContainer.js";
import Job from "./Job.js";
import Alert from "./Alert.js";
import Loading from "./Loading.js";
import PageButtonContainer from "./PageButtonContainer.js";

const JobsContainer = () => {
    const {
        getJobs,
        jobs,
        isLoading,
        page,
        totalJobs,
        search,
        searchStatus,
        searchType,
        sort,
        numOfPages,
        showAlert
    } = useAppContext();

    useEffect(() => {
        getJobs();
        // eslint-disable-next-line
    }, [search, searchStatus, searchType, sort, page]);

    if (isLoading) {
        return <Loading center />;
    }

    // if jobs' length is 0, return message
    if (jobs.length === 0) {
        return (
            <Wrapper>
                <h2>No jobs to display...</h2>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            {showAlert && <Alert />}
            
            <h5>{totalJobs} job{jobs.length > 1 && 's'} found</h5>
            <div className="jobs">
                {jobs.map((job) => {
                    return <Job key={job._id} {...job} />
                })}
            </div>

            {/* Pagination buttons */}
            { numOfPages > 1 && <PageButtonContainer />}
        </Wrapper>
    );
}

export default JobsContainer;