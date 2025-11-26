import { Send, Youtube, Twitter, Instagram, Video,  AtSign } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: any;
}

export const navLinks: NavLink[] = [
  { label: "главная", href: "/" },
  { label: "наш стек", href: "/stack" },
  { label: "профиль", href: "/profile" },
];

export const socialLinks: SocialLink[] = [
  { label: "Telegram", href: "https://t.me", icon: Send },
  { label: "VK", href: "https://vk.com", icon: AtSign }, // Placeholder for VK using AtSign
  { label: "YouTube", href: "https://youtube.com", icon: Youtube },
  { label: "X", href: "https://twitter.com", icon: Twitter },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "TikTok", href: "https://tiktok.com", icon: Video },
];
