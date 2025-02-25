import Link from "next/link";

type CustomerCareLink = {
  label: string;
  href: string;
};

const customerCareLinks: CustomerCareLink[] = [
  { label: "Login", href: "/user-login" },
  { label: "Register", href: "/user-register" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact_us"},
  { label: "Terms & Condition", href: "/terms_and_conditon" },
  { label: "Privacy Policy", href: "/privacy_policy" },
] as CustomerCareLink[];

const FooterCustomerCare = () => {
  return (
    <div>
      <h4 className="text-lg font-semibold text-[--textColor] h-[40px] mb-[10px] flex items-center">
        Links
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
