import Link from "next/link";

type ServiceLink = {
  label: string;
  href: string;
};

const serviceLinks: ServiceLink[] = [
  { label: "My Profile", href: "/profile/?tab=accountInfo" },
  { label: "My Addresses", href: "/profile/?tab=manageAddress" },
  { label: "Wishlist", href: "/profile/?tab=wishlistInfo" },
  { label: "Order info", href: "/profile/?tab=orderInfo" },
  {label: "Reset password", href: "/profile/?tab=changePassword"}
] as ServiceLink[];

const FooterServices = () => {
  return (
    <div>
      <h4 className="text-lg font-semibold text-[--textColor] h-[40px] mb-[10px] flex items-center">
        Account
      </h4>
      <ul className="text-sm">
        {serviceLinks.map(({ label, href }) => (
          <li key={href} className="mb-[15px]">
            <Link
              href={href}
              className="text-[--textColor] hover:text-[--mainColor] text-[16px]"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterServices;
