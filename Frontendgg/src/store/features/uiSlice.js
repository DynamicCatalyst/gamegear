import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isImgSearchActive: false,
}

const uiSlice = createSlice(
{
    name: "ui",
    initialState,
    reducers: {
        setImgSearchActive: (state, action) => {
            state.isImgSearchActive = action.payload;
        },
    },
});

export const {setImgSearchActive} = uiSlice.actions;
export default uiSlice.reducer;