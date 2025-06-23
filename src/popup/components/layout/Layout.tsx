import Header from "./Header";
import Footer from "./Footer";
import { useOutlet } from "react-router-dom";
import "./Layout.scss";

const Layout = () => {
  const outlet = useOutlet();

  return (
    <>
      <Header />
      <main>{outlet}</main>
      <Footer />
    </>
  );
};

export default Layout;
