import Wrapper from '../assets/wrappers/PageBtnContainer.js';
import { useAppContext } from '../context/appContext';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';

const PageButtonContainer = () => {
    const { numOfPages, page, changePage } = useAppContext();

    // button array
    // items = number of pages
    const pages = Array.from({ length: numOfPages }, (_, index) => {
        return index + 1;
    });

    // previous page
    const prevPage = () => {
        let newPage = page - 1;
        if (newPage < 1) {
            newPage = numOfPages;
        }
        changePage(newPage);
    }

    // next page
    const nextPage = () => {
        let newPage = page + 1;
        if (newPage > numOfPages) {
            newPage = 1;
        }
        changePage(newPage);
    }

    return ( 
        <Wrapper>
            <button className='prev-btn' onClick={prevPage}>
                <HiChevronDoubleLeft />
                Prev
            </button>

            <div className="btn-container">
                {pages.map((pageNum) => {
                    return <button
                        type='button'
                        className={pageNum === page ? 'pageBtn active' : 'pageBtn'}
                        key={pageNum}
                        onClick={() => changePage(pageNum)}
                    >
                        {pageNum}
                    </button>
                })}
            </div>

            <button className='next-btn' onClick={nextPage}>
                Next
                <HiChevronDoubleRight />
            </button>
        </Wrapper>
    );
}
 
export default PageButtonContainer;