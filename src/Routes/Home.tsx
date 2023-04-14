import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../Utils";
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

function Home() {
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
            <MovieSlider data={nowData} kind="now" />
            <MovieSlider data={popularData} kind="popular" />
            <MovieSlider data={topData} kind="top_rated" />
            <MovieSlider data={upcomingData} kind="upcoming" />
          </>
        )}
      </Wrapper>
    </>
  );
}
export default Home;
