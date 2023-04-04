// |이 코드는 현재 상영 중인 영화 정보를 가져오는 API를 호출하는 함수를 구현한 것입니다.
// |
// |좋은 점:
// |- API 키와 기본 경로를 상수로 정의하여 코드의 가독성을 높였습니다.
// |- fetch 함수를 사용하여 비동기적으로 API를 호출하고, 응답을 JSON 형태로 변환하여 반환합니다. 이를 통해 코드가 간결해졌습니다.
// |
// |나쁜 점:
// |- API 키가 코드 내에 하드코딩되어 있어, 보안상 취약점이 될 수 있습니다. API 키를 외부에서 주입받도록 수정하는 것이 좋습니다.
// |- 에러 처리가 되어 있지 않아, API 호출이 실패할 경우에 대한 대응이 없습니다. try-catch 문을 사용하여 에러 처리를 추가하는 것이 좋습니다.

// API_KEY 상수에는 API 키가 저장되어 있습니다.
const API_KEY = "2249852c7ea60722466b6e69f3cc3849";
// BASE_PATH 상수에는 API의 기본 경로가 저장되어 있습니다.
const BASE_PATH = "https://api.themoviedb.org/3";

// 영화 객체의 구조를 정의합니다
interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

// API에서 영화 목록을 가져올 때 반환되는 응답 객체의 구조를 정의합니다
export interface IGetMoviesResult {
  dates: { maximum: string; minimum: string }; // 영화가 이용 가능한 최대 및 최소 날짜
  page: number; // 결과의 현재 페이지 번호
  results: IMovie[]; // 영화 객체의 배열
  total_pages: number; // 사용 가능한 전체 결과 페이지 수
  total_results: number; // 사용 가능한 전체 결과 수
}

// getMovies 함수는 현재 상영 중인 영화 정보를 가져오는 API를 호출합니다.
export function getMovies() {
  // fetch 함수를 사용하여 API를 호출하고, 응답을 JSON 형태로 변환합니다.
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
