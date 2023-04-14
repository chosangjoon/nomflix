import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../Utils";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import MovieSlider from "./Components/MovieSlider";

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
const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
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

function Home() {
  // Importing hooks from the react-router-dom and react-use libraries
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");

  const { scrollY } = useScroll();
  // Fetching movie data using the useQuery hook from the react-query library
  const { data: popularData, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "popular"],
    () => getMovies("popular")
  );
  const { data: nowData } = useQuery<IGetMoviesResult>(
    ["movies", "nowplaying"],
    () => getMovies("now_playing")
  );
  const { data: upcomingData } = useQuery<IGetMoviesResult>(
    ["movies", "upcoming"],
    () => getMovies("upcoming")
  );
  const { data: topData } = useQuery<IGetMoviesResult>(
    ["movies", "top_rated"],
    () => getMovies("top_rated")
  );

  // Function to handle clicking on the overlay
  const onOverlayClick = () => {
    navigate("/");
  };

  // Finding the clicked movie based on the movieId parameter in the URL
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    popularData?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );
  return (
    <>
      <Wrapper>
        {isLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <Banner
              bgphoto={makeImagePath(
                popularData?.results[0].backdrop_path || ""
              )}
            >
              <Title>{popularData?.results[0].title}</Title>
              <OverView>{popularData?.results[0].overview}</OverView>
            </Banner>
            <MovieSlider data={popularData} kind="popular" />
            <MovieSlider data={nowData} kind="now" />
            <MovieSlider data={upcomingData} kind="upcoming" />
            <MovieSlider data={topData} kind="top_rated" />
            <AnimatePresence>
              {bigMovieMatch ? (
                <>
                  <Overlay
                    onClick={onOverlayClick}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  ></Overlay>
                  <Select
                    layoutId={bigMovieMatch.params.movieId}
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
        )}
      </Wrapper>
    </>
  );
}
export default Home;
