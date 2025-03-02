import Link from "next/link";
import { FiFacebook, FiLinkedin, FiTwitter, FiYoutube } from "react-icons/fi";

const socialLinks = [
  { icon: FiFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: FiTwitter, href: "https://twitter.com",label: "Twitter" },
  { icon: FiLinkedin, href: "https://linkedin.com", label: "Linkedin" },
  { icon: FiYoutube, href: "https://youtube.com",label: "Youtube" },
];

const FooterSocialMediaLink = () => {
  return (
    <div className="flex space-x-3">
      {socialLinks.map(({ icon: Icon, href, label }, index) => (
        <Link key={index} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
          <Icon className="text-[--textColor] hover:text-[--mainColor] transition duration-300" size={20} />
        </Link>
      ))}
    </div>
  );
};

export default FooterSocialMediaLink;
