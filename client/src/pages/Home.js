import React from "react";
import petsImage from "../assets/petlogo2.png";

function Home() {
  return (
    <div className="container mt-5">
      <div className="row text-center">
        <div className="col-12 mb-5">
          <img
            src={petsImage}
            alt="Happy pets"
            className="img-fluid rounded shadow"
            style={{ maxWidth: "500px" }}
          />
        </div>
        <div className="col-12">
          <h1 className="display-4 mb-3">Welcome to Pup 'N Suds </h1>
          <p className="fs-4">
            Here at Pup 'N Suds, we’re passionate about your furry friends. We
            offer a wide selection of pet supplies, toys, routine checkups,
            cleanings, and more! Dedicated to keeping your companions happy and
            healthy.
          </p>
          <p className="fs-5 mt-4">
            📞 <strong>Phone:</strong> (123) 456-7891 <br />
            📧 <strong>Email:</strong> contact@suds.com
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
