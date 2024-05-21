const useFiltersSales = () => {
    function SearchData({ data, selectedVar, searchValue }) {
        if (searchValue === null || searchValue === '') {
            return data
        } else {
            let filteredData;
            console.log(data, "filet")
            if (selectedVar.includes("?.")) {
                let splited = selectedVar.split("?.")
                filteredData = data.filter((item) => item?.[splited[0]]?.[splited[1]].toString().toLowerCase().includes(searchValue.toLowerCase()))
            } else {
                filteredData =
                    data.filter((item) => item?.[selectedVar].toString().toLowerCase().includes(searchValue.toLowerCase())
                    )
            }
            return filteredData
        }
    }
    return { SearchData }
}

export default useFiltersSales