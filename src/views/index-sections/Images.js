import React from "react";

function Images() {
  return (
    <div
      className="section section-images"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <div className="hero-images-container">
        <img alt="..." src={require("assets/img/swap.png")}></img>
      </div>
    </div>
  );
}

export default Images;
