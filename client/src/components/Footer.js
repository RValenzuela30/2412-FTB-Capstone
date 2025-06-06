import react from "react";

function Footer() {
  return (
    <footer className="bg-info text-center py-3">
      <div className="container">
        <small>
          {" "}
          &copy; {new Date().getFullYear()} Pup 'N Suds — Not a real company.
        </small>
      </div>
    </footer>
  );
}
export default Footer;
