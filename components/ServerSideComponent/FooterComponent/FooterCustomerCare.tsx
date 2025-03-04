import Link from "next/link";

type CustomerCareLink = {
  label: string;
  href: string;
};

const customerCareLinks: CustomerCareLink[] = [
  { label: "Health Blogs", href: "/blogs"},
  // { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact"},
  { label: "Terms & Condition", href: "/" },
  { label: "Privacy Policy", href: "/" },
] as CustomerCareLink[];

const FooterCustomerCare = () => {
  return (
    <div>
      <h4 className="text-lg font-semibold text-[--textColor] h-[40px] mb-[10px] flex items-center">
        Quick Links
      </h4>
      <ul className="text-sm">
        {customerCareLinks.map((links, index) => (
          <li key={index} className="mb-[15px]">
            <Link
              href={links.href}
              className="text-[--textColor] hover:text-[--mainColor] text-[16px]"
            >
              {links.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterCustomerCare;
