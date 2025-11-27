import React, { useEffect, useState } from "react";
import Hero from "../hero/Hero";
import Paginator from "../common/Paginator";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductImage from "../utils/ProductImage";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { setTotalItems } from "../../store/features/paginationSlice";
import { getDistinctProductsByName } from "../../store/features/productSlice";
import LoadSpinner from "../common/LoadSpinner";
import StockStatus from "../utils/StockStatus";
import { clearImageDescription } from "../../store/features/searchSlice";

const Home = () => {
  const dispatch = useDispatch();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [typedDescription, setTypedDescription] = useState("");
  const products = useSelector((state) => state.product.distinctProducts);
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



  useEffect(() => {
    dispatch(getDistinctProductsByName());
  }, [dispatch]);

    useEffect(() => {
    return () => {
      dispatch(clearImageDescription());
    };
  }, [dispatch]);

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

          // const matchesImageSearch = imageSearchResults.length>0 ? imageSearchResults.some(
          //   (result) => product.name.toLowerCase().includes(result.name.toLowerCase()) 
          // ) : true;
  const matchesImageSearch = imageSearchResults.length > 0 ? 
    imageSearchResults.some((result) => {

      const isMatch =     product.name.toLowerCase().includes(result.name.toLowerCase()) ||
    result.name.toLowerCase().includes(product.name.toLowerCase());
      return isMatch;
    }) : true;

      return matchesQuery && matchesCategory && matchesImageSearch;
    });

    setFilteredProducts(results);
  }, [searchQuery, selectedCategory, products,imageSearchResults ]);

//  image description
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
  
  useEffect(() => {
    dispatch(setTotalItems(filteredProducts.length));
  }, [filteredProducts, dispatch]);

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
      {/* <Hero /> */}
        <div className='hero-with-description'>
        <div className='hero-main-column'>
        <Hero />
      </div>

      {(imageDescriptionLoading || typedDescription) && (
        <div className='hero-image-description-box'>
            <h5 className='hero-image-description-title'>Describing Image</h5>
            <div className='hero-image-description-text'>
        {imageDescriptionLoading && !typedDescription
              ? 'Analyzing...'
              : typedDescription}
          </div>
        </div>
      )}
    </div>

      <div className='d-flex flex-wrap justify-content-center p-5'>
        <ToastContainer />
        {currentProducts &&
          currentProducts.map((product) => (
            <Card key={product.id} className='home-product-card'>
              <Link to={`/products/${product.name}`} className='link'>
                <div className='image-container'>
                  {product.images.length > 0 && (
                    <ProductImage productId={product.images[0].id} />
                  )}
                </div>
              </Link>

              <Card.Body>
                <p className='product-description'>
                  {product.name} - {product.description}
                </p>
                <h4 className='price'>{product.price}</h4>

                <StockStatus inventory={product.inventory} />

                <Link
                  to={`/products/${product.name}`}
                  className='shop-now-button'>
                  {" "}
                  Shop now
                </Link>
              </Card.Body>
            </Card>
          ))}
      </div>

      <Paginator />
    </>
  );
};

export default Home;
