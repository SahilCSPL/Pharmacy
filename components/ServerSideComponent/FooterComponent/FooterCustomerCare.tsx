import Link from "next/link";

type CustomerCareLink = {
  label: string;
  href: string;
};

const customerCareLinks: CustomerCareLink[] = [
  { label: "Login", href: "/login" },
  { label: "My account", href: "/my-account" },
  { label: "Wish List", href: "/wish-list" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact us", href: "/contact-us" },
] as CustomerCareLink[];

const FooterCustomerCare = () => {
  return (
    <div>
      <h4 className="text-lg font-semibold text-[--textColor] h-[40px] mb-[10px] flex items-center">
        Customer Care
      </h4>
      <ul className="text-sm">
        {customerCareLinks.map(({ label, href }) => (
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

export default FooterCustomerCare;
