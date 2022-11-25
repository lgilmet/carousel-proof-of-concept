/* eslint-disable @next/next/no-img-element */
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { useEffect, useState } from "react";

// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export default function Home(props) {
  const [visibleSlides, setVisibleSlides] = useState(1);
  const data = Object.values(props);
  const size = useWindowSize();

  useEffect(() => {
    // set visible slides to 3 if window width is less than 1280px
    if (size.width < 1280) {
      console.log("less than 1280px");
      setVisibleSlides(4);
    }
    // set visible slides to 2 if window width is less than 1024px
    if (size.width < 1024) {
      setVisibleSlides(2);
    }
    // set visible slides to 1 if window width is less than 768px
    if (size.width < 768) {
      console.log("less than 768px");
      setVisibleSlides(1);
    }
  }, [size.width]);

  return (
    <div>
      <CarouselProvider
        naturalSlideWidth={1}
        naturalSlideHeight={1}
        totalSlides={30}
        step={visibleSlides} // step is the amount the slides move when you click next or back
        visibleSlides={visibleSlides}>
        <Slider>
          {/* map through the props posts */}
          {data.map((post) => (
            <Slide key={post.id} index={post.id}>
              {post.author}
            </Slide>
          ))}
          ``
        </Slider>
        <ButtonBack>Back</ButtonBack>
        <ButtonNext>Next</ButtonNext>
      </CarouselProvider>
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch("https://picsum.photos/v2/list");
  const posts = await res.json();

  return {
    props: { ...posts },
  };
}
