import FooterNewsletter from "@/components/ClientSideComponent/FooterComponent/FooterNewsletter";
import FooterCompany from "./FooterCompany";
import FooterCustomerCare from "./FooterCustomerCare";
import FooterInfoDescription from "./FooterInfoDescription";
import FooterInfoLocation from "./FooterInfoLocation";
import FooterLogo from "./FooterLogo";
import FooterServices from "./FooterServices";
import FooterSocialMediaLink from "./FooterSocailMediaLink";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-row flex-wrap justify-between">
          <div className="footer-info w-full md:w-6/12 lg:w-4/12 pr-3 lg:pr-5">
            <FooterLogo />
            <FooterInfoDescription />

            <FooterSocialMediaLink />
          </div>
          
          <div className="footer-services w-full md:w-6/12 lg:w-2/12">
            <FooterServices />
          </div>
          <div className="customer-care w-full md:w-6/12 lg:w-2/12">
            <FooterCustomerCare />
          </div>
          <div className="footer-company-links w-full md:w-6/12 lg:w-4/12">
            <FooterInfoLocation />
          </div>
        </div>
      </div>
      {/* Copyright */}
    </footer>
  );
};

export default Footer;
