import React from "react";
import HeroSlider from "./HeroSlider";
import SearchBar from "../search/SearchBar";
import { useSelector } from "react-redux";


const Hero = () => {
  const isImgSearchActive = useSelector(
    (state) => state.ui.isImgSearchActive
  );

  return (
    <section className='hero'>
      <HeroSlider hideDots={isImgSearchActive} />
      <div className='hero-content'>
        <h1 className='hero-heading'>
          Welcome to <span className='hero-highlight'>GameGear</span>.com
          </h1>
                <p className='hero-subtitle'>Find the best gaming gear, from headsets to high‑end rigs.</p>
        <SearchBar />
        {!isImgSearchActive && (
          <div className='home-button-container'>
            <a href='#' className='home-shop-button link'>
              Shop Now
            </a>
            <button className='deals-button'>Today's Deals</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
