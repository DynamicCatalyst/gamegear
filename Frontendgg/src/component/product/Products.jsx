import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import SearchBar from "../search/SearchBar";
import {
  getAllProducts,
  getProductsByCategory,
} from "../../store/features/productSlice";
import { useDispatch, useSelector } from "react-redux";
import Paginator from "../common/Paginator";
import { setTotalItems } from "../../store/features/paginationSlice";
import SideBar from "../common/SideBar";
import { setInitialSearchQuery, clearImageDescription } from "../../store/features/searchSlice";
import { useLocation, useParams } from "react-router-dom";
import LoadSpinner from "../common/LoadSpinner";

const Products = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const dispatch = useDispatch();
  const { products, selectedBrands } = useSelector((state) => state.product);
  const [typedDescription, setTypedDescription] = useState("");
  const {
    searchQuery,
    selectedCategory,
    imageSearchResults,
    imageDescription,
    imageDescriptionLoading,
  } = useSelector((state) => state.search);
  const { itemsPerPage, currentPage } = useSelector(
    (state) => state.pagination
  );
  const isLoading = useSelector((state) => state.product.isLoading);

  const { name } = useParams();
  const { categoryId } = useParams();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchQuery = queryParams.get("search") || name || "";
  

  useEffect(() => {
    if (categoryId) {
      dispatch(getProductsByCategory(categoryId));
    } else {
      dispatch(getAllProducts());
    }
  }, [dispatch, categoryId]);

    useEffect(() => {
    return () => {
      dispatch(clearImageDescription());
    };
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(setInitialSearchQuery(initialSearchQuery));
  }, [initialSearchQuery, dispatch]);

  useEffect(() => {
    const results = products.filter((product) => {
      const matchesQuery = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        product.category.name
          .toLowerCase()
          .includes(selectedCategory.toLowerCase());

      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.some((selectedBrand) =>
          product.brand.toLowerCase().includes(selectedBrand.toLowerCase())
        );

        const matchesImageSearch = imageSearchResults.length>0 ? imageSearchResults.some((result) => product.name.toLowerCase().includes(result.name.toLowerCase()) ) : true;

      return matchesQuery && matchesCategory && matchesBrand && matchesImageSearch;
    });
    setFilteredProducts(results);
  }, [searchQuery, selectedCategory, selectedBrands, products , imageSearchResults, ]);

  useEffect(() => {
    dispatch(setTotalItems(filteredProducts.length));
  }, [filteredProducts, dispatch]);


    // Typing effect
  useEffect(() => {
    if (!imageDescription) {
      setTypedDescription("");
      return;
    }

    let index = 0;
    setTypedDescription("");

    const intervalId = setInterval(() => {
      index += 1;
      setTypedDescription(imageDescription.slice(0, index));
      if (index >= imageDescription.length) {
        clearInterval(intervalId);
      }
    }, 25);

    return () => clearInterval(intervalId);
  }, [imageDescription]);

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  if (isLoading) {
    return (
      <div>
        <LoadSpinner />
      </div>
    );
  }

  return (
    <>
      <div className='d-flex justify-content-center'>
        <div className='col-md-6 mt-2'>
          <div className='search-bar input-group'>
            <SearchBar />
          </div>
        </div>
      </div>


      {(imageDescriptionLoading || typedDescription) && (
        <div className='d-flex justify-content-center mt-3'>
          <div className='hero-image-description-box'>
            <h5 className='hero-image-description-title'>Describing Image</h5>
            <div className='hero-image-description-text'>
              {imageDescriptionLoading && !typedDescription
                ? "Analyzing..."
                : typedDescription}
            </div>
          </div>
        </div>
      )}

      <div className='d-flex'>
        <aside className='sidebar' style={{ width: "250px", padding: "1rem" }}>
          <SideBar />
        </aside>

        <section style={{ flex: 1 }}>
          <ProductCard products={currentProducts} />
        </section>
      </div>
      <Paginator />
    </>
  );
};

export default Products;
