import {createContext, useContext, useState} from "react";

const FilterContext = createContext()

export default function FilterProvider({children}) {
    const [selectedTitle, setSelectedTitle] = useState(null)

    return (
        <FilterContext.Provider value={{selectedTitle, setSelectedTitle}}>
            {children}
        </FilterContext.Provider>
    )
}

export function useFilter() {
    return useContext(FilterContext)
}