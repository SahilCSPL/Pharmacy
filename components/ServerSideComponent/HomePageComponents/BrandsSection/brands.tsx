import { BrandsClient } from "@/components/ClientSideComponent/HomePageComponents/BrandsSection/brands"

// Manually list the brands and their image filenames
const brandList = [
  { id: 1, name: "Mama earth", image: "/brands/mama-earth-1.avif" },
  { id: 2, name: "Dabar", image: "/brands/dabur-india-ltd-31.png" },
  { id: 3, name: "Lama", image: "/brands/lama-pharmaceuticals.png" },
  { id: 4, name: "Herbolab", image: "/brands/herbolab.avif" },
  { id: 5, name: "Schwabe", image: "/brands/schwabe.webp" },
  { id: 6, name: "Lord", image: "/brands/lord's-homeopathic.png" },
  { id: 7, name: "pankajakasthuri herbals", image: "/brands/pankajakasthuri-herbals.png" },
  { id: 8, name: "vlcc", image: "/brands/vlcc.svg" },
]

export default function Brands() {
  return <BrandsClient brandList={brandList} />
}

