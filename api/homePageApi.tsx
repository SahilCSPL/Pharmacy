import { APICore } from "./APICore";

export interface Banner {
  id: number;
  sequence_number: number;
  image: string;
  heading: string;
  description: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

export const getBanners = async () => {
  const data = await APICore<{ results: Banner[] }>("/frontend/banner", "GET");
  return data;
};
