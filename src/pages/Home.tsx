import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type ControlDelay = (delay: number) => void;

export default function Home() {
  const [state, setState] = useState(false);
  const navigate = useNavigate();
  let timerId: NodeJS.Timeout | null = null;

  // Leading Edge Throttling
  const throttle: ControlDelay = (delay) => {
    if (timerId) {
      // null값은 false이기 때문에 무시됨.
      // timerId가 있으면 바로 함수 종료
      return;
    }

    // setState(!state);
    console.log(`API요청 실행! ${delay}ms 동안 추가요청 안받음`);
    timerId = setTimeout(() => {
      console.log(`${delay}ms 지남 추가요청 받음`);
      timerId = null;
    }, delay);
  };

  // Trailing Edge Debouncing
  const debounce: ControlDelay = (delay) => {
    if (timerId) {
      // 할당되어 있는 timerId에 해당하는 타이머 제거
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      // timerId에 새로운 타이머 할당
      console.log(`마지막 요청으로부터 ${delay}ms지났으므로 API요청 실행!`);
      timerId = null;
    }, delay);
  };

  useEffect(() => {
    return () => {
      // 페이지 이동 시 실행
      // console.log("asdf", timerId);
      if (timerId) {
        // 메모리 누수 방지
        clearTimeout(timerId);
        console.log("asdf", timerId);
      }
    };
  }, [timerId]);

  return (
    <div style={{ paddingLeft: 20, paddingRight: 20 }}>
      <h1>Button 이벤트 예제</h1>
      <button onClick={() => throttle(2000)}>쓰로틀링 버튼</button>
      <button onClick={() => debounce(2000)}>디바운싱 버튼</button>
      <div>
        <button onClick={() => navigate("/company")}>페이지 이동</button>
      </div>
    </div>
  );
}
