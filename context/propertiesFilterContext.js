import { useReducer, createContext } from "react";

export const PropertiesFilterContext = createContext();

const initialState = {
    pcsNbr: "",
    priceMin: "",
    priceMax: "",
    surface: "",
    sortBy: "price",
    scrollTop: 0,
    fromHistoryBack: false
};

const propertiesFilterReducer = (state, action) => {
    switch (action.type) {
        case "SETFILTER":
            return {
                ...state,
                [action.name]: action.value
            };
        case "RESETFILTER":
            return initialState;
        default: return state;
    }
};

export const PropertiesFilterContextProvider = props => {
    const [state, dispatch] = useReducer(propertiesFilterReducer, initialState);

    return (
        <PropertiesFilterContext.Provider value={[state, dispatch]}>
            {props.children}
        </PropertiesFilterContext.Provider>
    );
};
