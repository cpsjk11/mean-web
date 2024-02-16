/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container } from "reactstrap";
// core components

function IndexHeader() {
  let pageHeader = React.createRef();

  React.useEffect(() => {
    if (window.innerWidth > 991) {
      const updateScroll = () => {
        let windowScrollTop = window.pageYOffset / 3;
        pageHeader.current.style.transform =
          "translate3d(0," + windowScrollTop + "px,0)";
      };
      window.addEventListener("scroll", updateScroll);
      return function cleanup() {
        window.removeEventListener("scroll", updateScroll);
      };
    }
  });

  return (
    <>
      <div
        className="page-header clear-filter"
        filter-color="blue"
        style={{ display: "flex" }}
      >
        <div
          className="page-header-image"
          style={{
            backgroundImage:
              "url(" + require("assets/img/bitcoin-removebg.jpg") + ")",
            width: "80%",
            position: "absolute",
            right: "-10%",
          }}
          ref={pageHeader}
        ></div>
        <Container>
          <div className="content-center brand">
            <img
              alt="..."
              className="n-logo"
              src={require("assets/img/Mlogo.png")}
            ></img>
            <h1 className="h1-seo">Mean Token Site</h1>
            <h3>
              Try swapping Mean Token for Klay, Freely deposit Mean Token and
              earn additional fees!
            </h3>
          </div>
        </Container>
      </div>
    </>
  );
}

export default IndexHeader;
