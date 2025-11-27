import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {api} from "../../component/services/api";

export const searchByImage = createAsyncThunk(
  "search/searchByImage",
  async (imageFile) => {
    const formData = new FormData();
    formData.append("image",imageFile);

    const response = await api.post("/products/search-by-image", formData);

    return response.data;
  }

)

export const describeImage = createAsyncThunk(
  "search/describeImage",
  async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await api.post("/images/describe-image", formData);
    return response.data;
  }
);



const initialState = {
  searchQuery: "",
  selectedCategory: "all",
  imageSearch : null,
  imageSearchResults : [],
  imageDescription: "",
  imageDescriptionLoading: false,
};

const searchSlice = createSlice({
  name: "search",

  initialState,

  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },

    setImageSearch: (state, action) => {
      state.imageSearch = action.payload;
    }
    ,
    clearFilters: (state) => {
      state.searchQuery = "";
      state.selectedCategory = "all";
      state.imageSearch = null;
      state.imageSearchResults = [];
      state.imageDescription = "";
      state.imageDescriptionLoading = false;
    },
    clearImageDescription: (state) => {
      state.imageDescription = "";
      state.imageDescriptionLoading = false;
    },
    setInitialSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) =>{
    builder
    .addCase(searchByImage.fulfilled, (state, action) => {
      // console.log(`action.payload.data = ${action.payload.data}`)
      state.imageSearchResults = action.payload.data;
    })
    .addCase(describeImage.pending, (state) => {
      state.imageDescriptionLoading = true;
    })
    .addCase(describeImage.fulfilled, (state, action) => {
      state.imageDescriptionLoading = false;
      state.imageDescription = action.payload?.data || "";
    })
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  clearFilters,
  setImageSearch,
  clearImageDescription,
  setInitialSearchQuery,
} = searchSlice.actions;

export default searchSlice.reducer;
