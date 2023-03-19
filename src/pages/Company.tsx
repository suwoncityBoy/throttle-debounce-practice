import React, { useCallback, useEffect, useState } from "react";
import _ from "lodash";

type ControlDelay = (callback: (...args: any[]) => void, delay: number) => any;

export default function Company() {
  const [selected, setSelected] = useState("customThrottle"); // customThrottle, customDebounce, lodashThrottle, lodashDebounce
  const [searchText, setSearchText] = useState("");
  const [inputText, setInputText] = useState("");
  console.log("searchText:", searchText);

  const throttle: ControlDelay = (callback, delay) => {
    let timerId: NodeJS.Timeout | null = null;
    let latestArgs: any[] = [];
    return (...args: any[]) => {
      // For trailing edge
      latestArgs = args;
      if (timerId) return;
      // For Leading edge
      callback(...args);
      timerId = setTimeout(() => {
        if (!_.isEqual(latestArgs, args)) callback(...latestArgs);
        timerId = null;
      }, delay);
    };
  };

  const debounce: ControlDelay = (callback, delay) => {
    let timerId: NodeJS.Timeout | null = null;
    return (...args: any[]) => {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };

  const selectEventControl = (delay: number) => {
    switch (selected) {
      case "customThrottle":
        return throttle((text) => setSearchText(text), delay);
      case "customDebounce":
        return debounce((text) => setSearchText(text), delay);
      case "lodashThrottle":
        // _.throttle 의 기본 옵션은 leading & trailing edge
        return _.throttle((text) => setSearchText(text), delay, {
          leading: true,
          trailing: true,
        });
      case "lodashDebounce":
        // _.debounce 의 기본 옵션은 trailing edge
        return _.debounce((text) => setSearchText(text), delay, {
          leading: false,
          trailing: true,
        });
      default:
        break;
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchText = useCallback(selectEventControl(2000), [selected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearchText(e.target.value);
    setInputText(e.target.value);
  };

  // resize 이벤트 핸들러
  const handleResize = _.debounce(() => console.log("resize 완료"), 1000);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      handleResize.cancel(); // 현재 동작중인 스케쥴 동작 취소. 메모리 누수 방지.
      window.removeEventListener("resize", handleResize); // resize 이벤트리스너 제거
    };
  }, [handleResize]);

  return (
    <div style={{ paddingLeft: 20, paddingRight: 20 }}>
      <h1>Input Text 및 Resize 이벤트 예제</h1>
      <h2>원하는 Throttle, Debounce 함수를 선택하세요</h2>
      <label style={{ display: "block" }}>
        <input
          checked={selected === "customThrottle"}
          onChange={() => setSelected("customThrottle")}
          type={"radio"}
        />
        customThrottle
      </label>
      <label style={{ display: "block" }}>
        <input
          checked={selected === "customDebounce"}
          onChange={() => setSelected("customDebounce")}
          type={"radio"}
        />
        customDebounce
      </label>
      <label style={{ display: "block" }}>
        <input
          checked={selected === "lodashThrottle"}
          onChange={() => setSelected("lodashThrottle")}
          type={"radio"}
        />
        lodashThrottle
      </label>
      <label style={{ display: "block" }}>
        <input
          checked={selected === "lodashDebounce"}
          onChange={() => setSelected("lodashDebounce")}
          type={"radio"}
        />
        lodashDebounce
      </label>

      <br />
      <input
        placeholder="입력값을 넣고 쓰로틀링/디바운싱 테스트 해보세요"
        style={{ width: "100%" }}
        onChange={handleChange}
        type={"text"}
      />
      <p>Search Text: {searchText}</p>
      <p>Input Text: {inputText}</p>
    </div>
  );
}
