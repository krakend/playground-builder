import Footer from "@/components/Footer";
import Header from "@/components/Header";

/**
 * Layout component that wraps the application with a header and footer.
 *
 * @param {Object} props - Component properties.
 * @param {ReactNode} props.children - The content to be displayed between the header and footer.
 * @returns {JSX.Element} The Layout component.
 */
const Layout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
