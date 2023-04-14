// |좋은 점:
// |- 이 코드는 useWindowDimensions라는 커스텀 훅을 정의하여 창의 너비를 반환합니다.
// |- 이 훅은 React의 useState와 useEffect 훅을 사용하여 창 크기의 상태를 관리하고 창 크기가 조정될 때 업데이트합니다.
// |- 이 훅은 재사용 가능하며 창의 너비를 알아야 하는 모든 컴포넌트에서 사용할 수 있습니다.
// |
// |나쁜 점:
// |- 이 코드는 윈도우의 너비만 중요하다고 가정합니다. 이 훅을 더 유연하게 만들어서 창의 너비와 높이를 모두 반환할 수 있도록 하는 것이 좋습니다.
// |- 이 코드는 창이 닫히거나 크기가 음수인 경우와 같은 오류나 예외 상황을 처리하지 않습니다. 이 훅을 더 견고하게 만들기 위해 오류 처리를 추가하는 것이 좋습니다.
import React, { useEffect, useState } from "react";

function getWindowDimensions() {
  const { innerWidth: width } = window;
  return width;
}
function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowDimensions;
}

export default useWindowDimensions;

export enum Types {
  "now_playing" = "now_playing",
  "popular" = "popular",
  "top_rated" = "top_rated",
  "upcoming" = "upcoming",
}
