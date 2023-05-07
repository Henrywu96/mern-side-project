import Wrapper from "../../assets/wrappers/DashboardFormPage.js";
import { FormRow, FormRowSelect, Alert } from '../../components';
import { useAppContext } from "../../context/appContext";

const AddJob = () => {
    const {
        showAlert,
        displayAlert,
        isEditing,
        isLoading,
        position,
        company,
        jobLocation,
        jobType,
        jobTypeOptions,
        status,
        statusOptions,
        handleChange,
        clearValues,
        createJob,
        editJob
    } = useAppContext();

    // handleChange
    const handleJobInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        handleChange({ name, value });
    }

    // handleSubmit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!position || !company || !jobLocation) {
            displayAlert();
            return;
        }

        if (isEditing) {
            editJob()
            return;
        }
        createJob();
    }

    return (
        <Wrapper>
            <form className="form">
                <h3>{isEditing ? 'Edit Job' : 'Add Job'}</h3>
                {showAlert && <Alert />}

                <div className="form-center">
                    {/* Position */}
                    <FormRow type="text" name="position" value={position} handleChange={handleJobInput} />

                    {/* Company */}
                    <FormRow type="text" name="company" value={company} handleChange={handleJobInput} />

                    {/* Job Location */}
                    <FormRow type="text" labelText="Job Location" name="jobLocation" value={jobLocation} handleChange={handleJobInput} />

                    {/* Job Type */}
                    <FormRowSelect name="jobType" labelText="Job Type" value={jobType} handleChange={handleJobInput} list={jobTypeOptions} />

                    {/* Job Status */}
                    <FormRowSelect name="status" value={status} handleChange={handleJobInput} list={statusOptions} />

                    {/* Button Container */}
                    <div className="btn-container">
                        <button type="submit" className="btn btn-block submit-btn" onClick={handleSubmit} disabled={isLoading}>
                            Submit
                        </button>
                        <button className="btn btn-block clear-btn" onClick={(e) => {
                            e.preventDefault();
                            clearValues();
                        }}>
                            Clear
                        </button>
                    </div>
                </div>
            </form>
        </Wrapper>
    )
}

export default AddJob;