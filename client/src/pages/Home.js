import React from "react";
import petsImage from "../assets/petlogo.png";

function Home() {
  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        <div className="col-md-6 mb-4 mb-md-0">
          <img
            src={petsImage}
            alt="Happy pets"
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6">
          <h2 className="mb-3">Welcome to the Pet Store</h2>
          <p className="lead">
            At Pet Store, we’re passionate about your furry friends. We offer a
            wide selection of pet supplies, from toys to beds, to keep your
            companions happy and healthy.
          </p>
          <p className="mb-1">
            📞 <strong>Phone:</strong> (123) 456-7891
          </p>
          <p>
            📧 <strong>Email:</strong> contact@petstore.com
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
