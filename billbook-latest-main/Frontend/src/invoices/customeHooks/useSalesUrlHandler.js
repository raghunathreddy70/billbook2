import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";

const useSalesUrlHandler = () => {
    const history = useHistory();
    const location = useLocation();


    const appendOrUpdateParameter = ({ paramKey, paramValue }) => {
        const currentPath = history.location.pathname;
        const currentSearch = history.location.search;
        const searchParams = new URLSearchParams(currentSearch);
        if (searchParams.has(paramKey)) {
            searchParams.set(paramKey, paramValue);
        } else {
            searchParams.append(paramKey, paramValue);
        }
        const newSearch = searchParams.toString();
        history.push(`${currentPath}?${newSearch}`);
    };


    const getParameter = (paramKey) => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get(paramKey);
    };

    return { appendOrUpdateParameter, getParameter }
}

export default useSalesUrlHandler