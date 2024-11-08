const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full bg-white py-6 text-gray-400">
      <div className="container mx-auto flex flex-col items-center">
        <div className="mb-4 flex space-x-4">
          <a href="/" className="hover:text-gray-400">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-gray-400">
            Terms of Service
          </a>
          <a href="/contact" className="hover:text-gray-400">
            Contact Us
          </a>
        </div>
        <p className="text-sm">
          &copy; 2024 Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
export default Footer;
