import React, { useEffect } from "react";
import Lottie from "lottie-web";
import animationData from "./emptyTodo.json";

const TodoLoader = () => {
  useEffect(() => {
    const container = document.getElementById("animation-containe");
    Lottie.loadAnimation({
      container,
      animationData,
      renderer: "svg", //or 'canvas'
      loop: true,
      autoplay: true,
    });
  }, []);

  return (
    <>
      <div style={{position: "relative", zIndex: "10", width: "100%", display: "flex", justifyContent: "center"}}>
        <div id="animation-containe" className="overflow-hidden" style={{ height: "288px", width: "300px" }}></div>
      </div>
    </>
  );
};

export default TodoLoader;