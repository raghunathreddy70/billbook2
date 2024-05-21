const useReportFilters = ({ filters, setFilteredDataState, filterVars, setFilterVars, setTotalAmt }) => {

    function getFiltersState(dataSource, filtersKeys) {
        let updateState = dataSource;
        let updatedFilters = filterVars;
        // let updateState = JSON.parse(JSON.stringify(dataSource));
        // let updatedFilters = JSON.parse(JSON.stringify(filterVars));
        filtersKeys?.map((key) => {
            let arrStrToObj;
            let keyName = key?.name;
            if (key?.all) {
                let allName = key?.all;
                arrStrToObj = getFiltersKeyValues(updateState, keyName, allName)
            } else {
                arrStrToObj = getFiltersKeyValues(updateState, keyName)
            }
            updatedFilters = { ...updatedFilters, [keyName]: arrStrToObj };
        })
        setFilterVars(updatedFilters)
    }

    function getFiltersKeyValues(updateState, key, all) {
        let allPartyNames = updateState?.map((party) => party[key]);
        let filteredPartyNames = Array.from(new Set(allPartyNames))
        if (all) {
            filteredPartyNames.unshift(`${all}`)
        }
        let arrStrToObj = filteredPartyNames?.map((item, i) => {
            return {
                label: item,
                key: i + 1
            }
        })
        return arrStrToObj
    }

    function GetTotalAmt(datasource) {
        let totalAmt = datasource?.reduce((total, num) => {
            return Number(total) + Number(num?.amt || 0)
        }, 0)
        setTotalAmt(totalAmt)
    }

    function DataSourceFilter({ data }) {
        let found = filteredData(data);
        GetTotalAmt(found)
        return found
    }

    function filteredData(data) {
        let filtered = data.filter((record) => {
            let matchesAllFilters = true;
            for (const filterKey in filters) {
                if (filters[filterKey]?.substring(0, 3).toLowerCase() !== "all") {
                    if (record[filterKey] !== filters[filterKey]) {
                        matchesAllFilters = false;
                        break;
                    }
                }
            }
            setFilteredDataState(matchesAllFilters)
            return matchesAllFilters;
        });
        return filtered
    }


    function addFilters(filterState, newFilter, name, setFilters) {
        let updatedFilters = JSON.parse(JSON.stringify(filterState));
        updatedFilters = { ...updatedFilters, [name]: newFilter }
        setFilters(updatedFilters)
    }

    function filterDataByDateRange(data, startDate, endDate) {
        return data.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
        });
    }
    return { filterDataByDateRange, addFilters, filteredData, DataSourceFilter, GetTotalAmt, getFiltersKeyValues, getFiltersState }
}

export default useReportFilters