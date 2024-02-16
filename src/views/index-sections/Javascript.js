import React from "react";
// reactstrap components
import { Button, Modal, ModalBody } from "reactstrap";

// core components

function Javascript() {
  const [modal1, setModal1] = React.useState(false);
  const [modal2, setModal2] = React.useState(false);
  return (
    <>
      <div className="section section-javascript" id="javascriptComponents">
        <Button
          color="primary"
          className="mr-1"
          onClick={() => setModal1(true)}
        >
          Launch Modal
        </Button>
        <Button color="info" onClick={() => setModal2(true)}>
          Launch Modal Mini
        </Button>
        <Modal isOpen={modal1} toggle={() => setModal1(false)}>
          <div className="modal-header justify-content-center">
            <button
              className="close"
              type="button"
              onClick={() => setModal1(false)}
            >
              <i className="now-ui-icons ui-1_simple-remove"></i>
            </button>
            <h4 className="title title-up">Modal title</h4>
          </div>
          <ModalBody>
            <p>
              Far far away, behind the word mountains, far from the countries
              Vokalia and Consonantia, there live the blind texts. Separated
              they live in Bookmarksgrove right at the coast of the Semantics, a
              large language ocean. A small river named Duden flows by their
              place and supplies it with the necessary regelialia. It is a
              paradisematic country, in which roasted parts of sentences fly
              into your mouth.
            </p>
          </ModalBody>
          <div className="modal-footer">
            <Button color="default" type="button">
              Nice Button
            </Button>
            <Button
              color="danger"
              type="button"
              onClick={() => setModal1(false)}
            >
              Close
            </Button>
          </div>
        </Modal>
        <Modal
          modalClassName="modal-mini modal-info"
          toggle={() => setModal2(false)}
          isOpen={modal2}
        >
          <div className="modal-header justify-content-center">
            <div className="modal-profile">
              <i className="now-ui-icons users_circle-08"></i>
            </div>
          </div>
          <ModalBody>
            <p>Always have an access to your profile</p>
          </ModalBody>
          <div className="modal-footer">
            <Button className="btn-neutral" color="link" type="button">
              Back
            </Button>
            <Button
              className="btn-neutral"
              color="link"
              type="button"
              onClick={() => setModal2(false)}
            >
              Close
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
}

export function SelectLogin() {
  const [loginModal, setLoginModal] = React.useState(false);
  return (
    <>
      <Button
        color="primary"
        className="mr-1"
        onClick={() => setLoginModal(true)}
      >
        Launch Modal
      </Button>
      <div className="section section-javascript" id="loginModal">
        <Modal isOpen={loginModal} toggle={() => setLoginModal(false)}>
          <div className="modal-header justify-content-center">
            <button
              className="close"
              type="button"
              onClick={() => setLoginModal(false)}
            >
              <i className="now-ui-icons ui-1_simple-remove"></i>
            </button>
            <h4 className="title title-up">Modal title</h4>
          </div>
          <ModalBody>
            <p>
              Far far away, behind the word mountains, far from the countries
              Vokalia and Consonantia, there live the blind texts. Separated
              they live in Bookmarksgrove right at the coast of the Semantics, a
              large language ocean. A small river named Duden flows by their
              place and supplies it with the necessary regelialia. It is a
              paradisematic country, in which roasted parts of sentences fly
              into your mouth.
            </p>
          </ModalBody>
          <div className="modal-footer">
            <Button color="default" type="button">
              Nice Button
            </Button>
            <Button
              color="danger"
              type="button"
              onClick={() => setLoginModal(false)}
            >
              Close
            </Button>
          </div>
        </Modal>
      </div>
      ;
    </>
  );
}

export default Javascript;
