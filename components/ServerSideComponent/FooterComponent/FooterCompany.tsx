import Link from "next/link";

type CompanyLink = {
  label: string;
  href: string;
};

const companyLinks: CompanyLink[] = [
  { label: "Blog", href: "/blog" },
  { label: "All Products", href: "/products" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
] as CompanyLink[];

const FooterCompany = () => {
  return (
    <div>
      <h4 className="text-lg font-semibold text-[--textColor] h-[40px] mb-[10px] flex items-center">
        Company
      </h4>
      <ul className="text-sm">
        {companyLinks.map(({ label, href }) => (
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

export default FooterCompany;
