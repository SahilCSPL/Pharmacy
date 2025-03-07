import { APICore } from "./APICore";

export interface Blog {
  id: number;
  sequence_number: number;
  title: string;
  slug: string;
  content: string;
  image: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

export const getAllBlogs = async () => {
  const data = await APICore<{ results: Blog[] }>("/frontend/blog/?is_active=True", "GET");
  return data;
};
