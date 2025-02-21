import Link from "next/link";

type ServiceLink = {
  label: string;
  href: string;
};

const serviceLinks: ServiceLink[] = [
  { label: "Wish List", href: "/wish-list" },
  { label: "Login", href: "/login" },
  { label: "My account", href: "/my-account" },
  { label: "Terms & Conditions", href: "/terms-and-condition" },
] as ServiceLink[];

const FooterServices = () => {
  return (
    <div>
      <h4 className="text-lg font-semibold text-[--textColor] h-[40px] mb-[10px] flex items-center">
        Services
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
