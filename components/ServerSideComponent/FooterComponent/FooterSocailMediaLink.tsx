import Link from "next/link";
import { FiFacebook, FiLinkedin, FiTwitter, FiYoutube } from "react-icons/fi";

const socialLinks = [
  { icon: FiFacebook, href: "https://facebook.com" },
  { icon: FiTwitter, href: "https://twitter.com" },
  { icon: FiLinkedin, href: "https://linkedin.com" },
  { icon: FiYoutube, href: "https://youtube.com" },
];

const FooterSocialMediaLink = () => {
  return (
    <div className="flex space-x-3">
      {socialLinks.map(({ icon: Icon, href }, index) => (
        <Link key={index} href={href} target="_blank" rel="noopener noreferrer">
          <Icon className="text-[--textColor] hover:text-[--mainColor] transition duration-300" size={20} />
        </Link>
      ))}
    </div>
  );
};

export default FooterSocialMediaLink;
