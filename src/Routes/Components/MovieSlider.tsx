import { useEffect, useState } from "react";
import { IGetMoviesResult } from "../../api";
import styled from "styled-components";
import { makeImagePath } from "../../Utils";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";

const Slider = styled.div`
  padding: 0 20px;
  position: relative;
  height: 200px;
`;
const SliderTitle = styled.h2`
  font-size: 18px;
  font-weight: 1000;
  padding-bottom: 5px;
`;
const SliderIconLeft = styled.svg`
  width: 70px;
  height: 70px;
  position: absolute;
  top: 55px;
  left: 10px;
`;
const SliderIconRight = styled.svg`
  width: 70px;
  height: 70px;
  position: absolute;
  top: 55px;
  right: 0px;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const rowVariants = {
  hidden: (isNext: boolean) => {
    return {
      x: isNext ? window.innerWidth : -window.innerWidth,
    };
  },
  visible: {
    x: 0,
  },
  exit: (isNext: boolean) => {
    return {
      x: isNext ? -window.innerWidth : window.innerWidth,
    };
  },
};
const Box = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-position: center center;
  background-size: cover;
  border-radius: 5px;
  height: 130px;
  color: red;
  font-size: 24px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const boxvar = {
  normal: {
    scale: 1,
  },
  hovering: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};
const Info = styled(motion.div)`
  padding: 8px;
  position: absolute;
  width: 100%;
  color: white;
  bottom: 0;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  h4 {
    text-align: center;
    font-size: 12px;
  }
`;
const InfoVar = {
  hovering: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};
const Select = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 70vh;
  background-color: ${(props) => props.theme.black.lighter};
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
`;
const SelectCover = styled(motion.div)`
  width: 100%;
  height: 250px;
  background-size: cover;
  background-position: center center;
`;

const SelectTitle = styled(motion.h3)`
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -28px;
  font-size: 22px;
`;
const SelectOverview = styled.p`
  font-size: 12px;
  color: ${(props) => props.theme.white.lighter};
  top: -28px;
  position: relative;
  padding: 20px;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

interface IMovieProps {
  data?: IGetMoviesResult;
  kind: string;
}

function MovieSlider({ data, kind }: IMovieProps) {
  // Setting the number of movies to display per page
  const offset = 6;

  // Initializing state variables
  const [leaving, setLeaving] = useState(false);
  const [isNext, setIsNext] = useState(true);

  // Initializing state variable for the current page index
  const [index, setIndex] = useState(0);

  const [slidertitle, setSliderTitle] = useState("");

  // Importing hooks from the react-router-dom and react-use libraries
  const navigate = useNavigate();
  const bigMovieMatch = useMatch(`/movies/:movieId`);

  const { scrollY } = useScroll();

  useEffect(() => {
    switch (kind) {
      case "popular":
        setSliderTitle("Popular");
        break;
      case "now":
        setSliderTitle("nowPlaying");
        break;
      case "upcoming":
        setSliderTitle("Upcoming");
        break;
      case "top_rated":
        setSliderTitle("Top_Rated");
        break;
    }
  }, [kind]);
  // Function to increase the current page index
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;

      // Setting the leaving state to true to trigger the animation
      setLeaving(true);

      // Updating the current page index and isNext state
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setIsNext(() => true);
    }
    console.log(index);
  };

  // Function to decrease the current page index
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;

      // Setting the leaving state to true to trigger the animation
      setLeaving(true);

      // Updating the current page index and isNext state
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      setIsNext(() => false);
    }
    console.log(index);
  };
  // Function to toggle the leaving state
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  // Function to handle clicking on a movie box
  const onBoxClick = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  // Function to handle clicking on the overlay
  const onOverlayClick = () => {
    navigate("/");
  };

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );
  console.log(clickedMovie);
  return (
    <>
      <Slider>
        <SliderTitle>{slidertitle}</SliderTitle>
        <AnimatePresence
          initial={false}
          onExitComplete={toggleLeaving}
          custom={isNext}
        >
          <Row
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={isNext}
            transition={{ type: "tween", duration: 1 }}
            key={index}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  layoutId={`${kind}` + movie.id}
                  variants={boxvar}
                  initial="normal"
                  whileHover="hovering"
                  transition={{ type: "tween" }}
                  key={movie.id}
                  bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                  onClick={() => onBoxClick(movie.id)}
                >
                  <Info variants={InfoVar}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
          <SliderIconLeft onClick={increaseIndex}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path
                fill="white"
                d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
              />
            </svg>
          </SliderIconLeft>
          <SliderIconRight onClick={decreaseIndex}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path
                fill="white"
                d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
              />
            </svg>
          </SliderIconRight>
        </AnimatePresence>
      </Slider>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
            ></Overlay>
            <Select
              layoutId={`${kind}` + bigMovieMatch.params.movieId}
              style={{ top: scrollY.get() + 100 }}
            >
              {clickedMovie && (
                <>
                  <SelectCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedMovie.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <SelectTitle>{clickedMovie.title}</SelectTitle>
                  <SelectOverview>{clickedMovie.overview}</SelectOverview>
                </>
              )}
            </Select>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default MovieSlider;
