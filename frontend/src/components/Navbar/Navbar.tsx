const Navbar = () => {
  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "Graphing", href: "/" },
    { name: "Modeling", href: "/" },
  ];

  return (
    <nav className="text-white font-bold text-xl shadow-lg fixed top-0 z-50 bg-gray-700 w-full">
      <div className="container mx-auto px-4 py-4 md:flex md:justify-between md:items-center">
        {/*This is where the mobile buttons and log go*/}
        <div className="flex justify-between items-center">
          <a
            href="/"
            className="font-bold text-xl text-white hover:text-blue-300 transition-colors duration-300"
          >
            Options Alpha
          </a>
        </div>
        {/* Desktop and Mobile Menu Links */}
        <div
          id="mobile-menu"
          className={
            "flex-col md:flex md:flex-row md:items-center md:space-x-8 mt-4"
          }
        >
          {navigationLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="py-2 px-4 rounded-md text-white hover:text-blue-300 hover:bg-gray-700 transition-colors duration-300"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
