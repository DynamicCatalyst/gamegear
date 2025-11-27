import React, { useState, useEffect } from "react";
import { api } from "../../component/services/api";

const ProductImage = ({ productId }) => {
  const [productImg, setProductImg] = useState(null);

  useEffect(() => {
    const fetchProductImage = async (id) => {
      try {

        // const baseUrl = import.meta.env.VITE_API_BASE_URL;
        // const baseUrl = "http://localhost:5000/api/v1";
       const baseUrl= "https://api.gamegear.one:8443/api/v1";
        const response = await fetch(
          `${baseUrl}/images/image/download/${id}`
        );
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductImg(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    if (productId) {
      fetchProductImage(productId);
    }
  }, [productId]);

  if (!productImg) return null;

  return (
    <div>
      <img src={productImg} alt='Product Image' loading="lazy"/>
    </div>
  );
};

export default ProductImage;
