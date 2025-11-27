import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import bg1 from "../../assets/images/g13.jpg";
import bg2 from "../../assets/images/g14.jpg";
import bg3 from "../../assets/images/g9.jpg";
import bg5 from "../../assets/images/g11.jpg";

const images = [bg1, bg2, bg3, bg5];

const HeroSlider = (
  { hideDots = false }
) => {
  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 800,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    arrows: false,
    dots: !hideDots,
    adaptiveHeight: false,
  };

  return (
    <Slider {...settings} className='hero-slider'>
      {images.map((img, index) => (
        <div key={index} className='slide'>
          <img src={img} alt={`Slide ${index + 1}`} className='slide-image' />
        </div>
      ))}
    </Slider>
  );
};

export default HeroSlider;
