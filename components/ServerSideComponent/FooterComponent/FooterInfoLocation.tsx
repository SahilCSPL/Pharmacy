import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa6";
const contactInfo = [
  {
    icon: <FaMapMarkerAlt />,
    text: "Sacred World, Office #: 707, South Block, Wanwadi, Pune, Maharashtra",
    href: "https://www.google.com/maps/search/?api=1&query=123+Business+Street,+NY",
  },
  { icon: <FaPhoneAlt />, text: "+91 900 499 1455", href: "tel:+919004991455" },
  {
    icon: <FaEnvelope />,
    text: "sales@consociatesolutions.com",
    href: "mailto:sales@consociatesolutions.com",
  },
];

const FooterInfoLocation = () => {
  return (
    <div>
      <h4 className="text-lg font-semibold text-[--textColor] h-[40px] mb-[10px] flex items-center">
        Contact Us
      </h4>
      <ul className="text-sm space-y-2 mb-[10px]">
        {contactInfo.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="text-lg text-[--blackPrimary]">{item.icon}</span>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[--textColor] hover:text-[--mainColor] transition duration-300 text-[16px]"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterInfoLocation;
