import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="flex items-center justify-between px-6 h-20">
      {/* Espace vide pour équilibrer à gauche */}
      <div className="w-[88px] md:w-[150px] h-full flex items-center"></div>

      {/* Navigation centrée et bien alignée */}
      <ul className="hidden mt-4 z-10 md:flex gap-16 font-medium text-primary text-sm h-full items-center">
        {[
          { path: "/", label: "accueil" },
          { path: "/a-propos", label: "à propos" },
          { path: "/Categories", label: "categories" },
          { path: "/Carnet-de-Voyages", label: "carnets de voyages" },
          { path: "/Liens", label: "liens" },
          { path: "/Contact", label: "contact" },
        ].map(({ path, label }) => (
          <li key={path} className="flex items-center">
            <Link
              to={path}
              className={`uppercase pb-2 inline-block relative
                after:block after:h-[2px] after:mt-1 after:bg-primary after:origin-left after:scale-x-0 after:transition-transform after:duration-300
                ${location.pathname === path ? "after:scale-x-100" : "hover:after:scale-x-100"}
              `}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Icônes à droite, bien centrées verticalement */}
      <div className="flex relative z-10 items-center gap-x-10 text-primary text-2xl h-full">
        <i className="bi bi-bag cursor-pointer"></i>
        <i className="bi bi-person cursor-pointer"></i>
      </div>
    </nav>
  );
}

export default Navbar;
