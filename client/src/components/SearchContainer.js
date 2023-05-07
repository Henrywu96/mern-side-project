import Wrapper from '../assets/wrappers/SearchContainer.js';
import { useAppContext } from '../context/appContext';
import { FormRow, FormRowSelect } from '.';
import { useState, useMemo } from 'react';

const SearchContainer = () => {
    const [localSearch, setLocalSearch] = useState('');

    const {
        isLoading,
        // search,
        searchStatus,
        searchType,
        sort,
        sortOptions,
        statusOptions,
        jobTypeOptions,
        handleChange,
        clearFilters
    } = useAppContext();

    // handle search
    const handleSearch = (e) => {
        // if (isLoading) return;
        handleChange({ name: e.target.name, value: e.target.value });
    }

    // handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        // set local search to be empty string before clear filters in handle submit
        setLocalSearch('');
        clearFilters();
    }

    // debounce, delay the execution by one sec after the last keystroke
    const debounce = () => {
        let timeoutID;

        return (e) => {
            setLocalSearch(e.target.value);
            clearTimeout(timeoutID);
            timeoutID = setTimeout(() => {
                handleChange({ name: e.target.name, value: e.target.value });
            }, 1000);
        }
    }

    // optimized debounce
    // eslint-disable-next-line
    const optimizedDebounce = useMemo(() => debounce(), []);

    return ( 
        <Wrapper>
            <form className='form'>
                <h4>Search Form</h4>
                <div className="form-center">
                    {/* search position */}
                    {/* switch from global search to local search */}
                    <FormRow type='text' name='search' value={localSearch} handleChange={optimizedDebounce} />

                    {/* search by status */}
                    <FormRowSelect labelText='status' name='searchStatus' value={searchStatus} handleChange={handleSearch} list={['All', ...statusOptions]} />

                    {/* search by type */}
                    <FormRowSelect labelText='type' name='searchType' value={searchType} handleChange={handleSearch} list={['All', ...jobTypeOptions]} />

                    {/* sort */}
                    <FormRowSelect name='sort' value={sort} handleChange={handleSearch} list={sortOptions} />

                    {/* clear filters */}
                    <button className='btn btn-block btn-danger' disabled={isLoading} onClick={handleSubmit}>
                        Clear Filters
                    </button>
                </div>
            </form>
        </Wrapper>
    );
}

export default SearchContainer;