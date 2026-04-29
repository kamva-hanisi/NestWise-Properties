import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="section container page-section empty-page">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>The page you opened does not exist in the React router.</p>
      <Link className="button button-primary" to="/">
        Go Home
      </Link>
    </section>
  );
}

export default NotFound;
