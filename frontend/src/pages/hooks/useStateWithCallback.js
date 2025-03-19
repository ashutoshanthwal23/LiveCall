import { useEffect, useRef, useState } from "react"

export const useStateWithCallback = (initialState) => {
    const [state, setState] = useState(initialState);
    const cbRef = useRef(null);

    const updateState = (newState, cb) => {
        cbRef.current = cb;

        setState(prev => {
            return typeof newState === 'function' ? newState(prev) : newState
        })
    }

    useEffect(() => {
        if(cbRef.current){
            cbRef.current(state);
            cbRef.current = null
        }
    }, [state])

    return [state, updateState];
}