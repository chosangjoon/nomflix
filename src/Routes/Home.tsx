import { useState } from "react";
import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../Utils";
import { AnimatePresence, motion } from "framer-motion";
import useWindowDimensions from "../useWindowDimesions";
import { off } from "process";

const Wrapper = styled.div`
  background-color: black;
  overflow-x: hidden;
  height: 200vh;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 55px;
  margin-bottom: 10px;
`;
const OverView = styled.p`
  font-size: 20px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-position: center;
  background-size: cover;
  height: 130px;
  color: red;
  font-size: 24px;
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

function Home() {
  // useQuery hook을 사용하여 영화 데이터를 가져옴
  // "movies"와 "nowPlaying"을 쿼리 키로 사용하고, getMovies 함수를 통해 데이터를 가져옴
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const [index, setIndex] = useState(0);
  const offset = 6;
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setLeaving(true);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
    console.log(index);
  };

  const width = useWindowDimensions();

  const [leaving, setLeaving] = useState(false);

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  return (
    <>
      <Wrapper>
        {isLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <Banner
              onClick={increaseIndex}
              bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
            >
              <Title>{data?.results[0].title}</Title>
              <OverView>{data?.results[0].overview}</OverView>
            </Banner>
            <Slider>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                  // variants={rowVariants}
                  initial={{ x: width + 10 }}
                  animate={{ x: 0 }}
                  exit={{ x: -width - 10 }}
                  transition={{ type: "tween", duration: 1 }}
                  key={index}
                  /* key만 바꿀뿐이지만 react는 새로운 Row컴포넌트로 인식 */
                >
                  {data?.results
                    .slice(1)
                    .slice(offset * index, offset * index + offset)
                    .map((movie) => (
                      <Box
                        variants={boxvar}
                        initial="normal"
                        whileHover="hovering"
                        transition={{ type: "tween" }}
                        key={movie.id}
                        bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <Info variants={InfoVar}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
          </>
        )}
      </Wrapper>
    </>
  );
}
export default Home;
