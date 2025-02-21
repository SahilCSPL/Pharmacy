import Image from "next/image";
import Link from "next/link";
import FooterSiteLogo from "../../../public/logo-2.png"
const FooterLogo = () => {
  return (
    <div className="site-logo flex justify-center md:justify-start mb-[10px]">
      <Link href="/">
        <Image src={FooterSiteLogo} alt="MyBrand Logo" width={150} height={50} />
      </Link>
    </div>
  );
};

export default FooterLogo;
