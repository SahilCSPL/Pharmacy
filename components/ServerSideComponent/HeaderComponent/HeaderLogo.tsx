import Image from "next/image";
import Link from "next/link";
import SiteLogo from "../../../public/logo-2.png";

export default function HeaderLogo() {
  return (
    <Link href="/">
      <Image src={SiteLogo} alt="MyBrand Logo" className="mx-auto md:ms-0"/>
    </Link>
  );
}
