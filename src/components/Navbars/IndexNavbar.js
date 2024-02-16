import React from "react";
import { useRecoilState } from "recoil";
import { metaMaskLogin, klaytnLogin } from "../../web3/index.js";
import { addrState } from "../../recoil/recoil";

// reactstrap components
import {
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  UncontrolledTooltip,
  Button,
  Modal,
  ModalBody,
} from "reactstrap";

function IndexNavbar() {
  const [navbarColor, setNavbarColor] = React.useState("navbar-transparent");
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [loginModal, setLoginModal] = React.useState(false);
  const [userAddr, setUserAddr] = useRecoilState(addrState);
  React.useEffect(() => {
    const updateNavbarColor = () => {
      if (
        document.documentElement.scrollTop > 399 ||
        document.body.scrollTop > 399
      ) {
        setNavbarColor("");
      } else if (
        document.documentElement.scrollTop < 400 ||
        document.body.scrollTop < 400
      ) {
        setNavbarColor("navbar-transparent");
      }
    };
    window.addEventListener("scroll", updateNavbarColor);
    return function cleanup() {
      window.removeEventListener("scroll", updateNavbarColor);
    };
  });
  return (
    <>
      {collapseOpen ? (
        <div
          id="bodyClick"
          onClick={() => {
            document.documentElement.classList.toggle("nav-open");
            setCollapseOpen(false);
          }}
        />
      ) : null}
      <Navbar className={"fixed-top " + navbarColor} expand="lg" color="info">
        <Container>
          <div className="navbar-translate">
            <NavbarBrand
              href="https://demos.creative-tim.com/now-ui-kit-react/#/index?ref=nukr-index-navbar"
              target="_blank"
              id="navbar-brand"
            >
              Mean Token Site
            </NavbarBrand>
            <UncontrolledTooltip target="#navbar-brand">
              Wellcome to Mean Token Site
            </UncontrolledTooltip>
            <button
              className="navbar-toggler navbar-toggler"
              onClick={() => {
                document.documentElement.classList.toggle("nav-open");
                setCollapseOpen(!collapseOpen);
              }}
              aria-expanded={collapseOpen}
              type="button"
            >
              <span className="navbar-toggler-bar top-bar"></span>
              <span className="navbar-toggler-bar middle-bar"></span>
              <span className="navbar-toggler-bar bottom-bar"></span>
            </button>
          </div>
          <Collapse
            className="justify-content-end"
            isOpen={collapseOpen}
            navbar
          >
            <Nav navbar>
              <NavItem>
                <NavLink
                  href="https://klaytnscope.com/token/0x7be624e054d5b232e02dca0576af8a089e12340b?tabId=tokenTransfer"
                  target="_blank"
                  id="klayScope-tooltip"
                >
                  <i className="fab now-ui-icons business_globe"></i>
                  <p>Klaytn Scope</p>
                </NavLink>
                <UncontrolledTooltip target="#klayScope-tooltip">
                  View Mean Token History
                </UncontrolledTooltip>
              </NavItem>

              <NavItem>
                <NavLink
                  target="_blank"
                  id="meta-mask-tooltip"
                  onClick={async () => {
                    const address = await metaMaskLogin();
                    setUserAddr(
                      `${address.substring(0, 6)}...${address.substring(
                        address.length - 4
                      )}`
                    );
                    console.log(userAddr);
                    setLoginModal(false);
                  }}
                  å
                >
                  <i className="fab now-ui-icons users_single-02"></i>
                  <p className="d-lg-none d-xl-none">MetaMask</p>
                  <p>{userAddr}</p>
                </NavLink>
                <UncontrolledTooltip target="#meta-mask-tooltip">
                  user use wallet MetaMask
                </UncontrolledTooltip>
              </NavItem>

              <Modal isOpen={loginModal} toggle={() => setLoginModal(false)}>
                <ModalBody>
                  <div>
                    <Button
                      color="primary"
                      type="button"
                      style={{ width: "100%" }}
                      onClick={async () => {
                        const address = await metaMaskLogin();
                        setUserAddr(
                          `${address.substring(0, 6)}...${address.substring(
                            address.length - 4
                          )}`
                        );
                        console.log(userAddr);
                        setLoginModal(false);
                      }}
                    >
                      MetaMask
                    </Button>
                  </div>
                  <div>
                    <Button
                      color="info"
                      type="button"
                      style={{ width: "100%" }}
                      onClick={async () => {
                        const address = await klaytnLogin();
                        setUserAddr(
                          `${address.substring(0, 6)}...${address.substring(
                            address.length - 4
                          )}`
                        );
                        console.log(userAddr);
                        setLoginModal(false);
                      }}
                    >
                      KaiKas
                    </Button>
                  </div>
                </ModalBody>
              </Modal>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default IndexNavbar;
