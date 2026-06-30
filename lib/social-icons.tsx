import type { ReactNode } from 'react'
import {
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaTiktok,
  FaYoutube,
  FaWhatsapp,
  FaSnapchat,
  FaPinterest,
  FaTwitch,
  FaDiscord,
  FaTelegram,
  FaMedium,
  FaGithub,
  FaDribbble,
  FaBehance,
  FaGlobe,
} from 'react-icons/fa'

const iconMap: Record<string, ReactNode> = {
  instagram: <FaInstagram />,
  linkedin: <FaLinkedin />,
  facebook: <FaFacebook />,
  twitter: <FaTwitter />,
  tiktok: <FaTiktok />,
  youtube: <FaYoutube />,
  whatsapp: <FaWhatsapp />,
  snapchat: <FaSnapchat />,
  pinterest: <FaPinterest />,
  twitch: <FaTwitch />,
  discord: <FaDiscord />,
  telegram: <FaTelegram />,
  medium: <FaMedium />,
  github: <FaGithub />,
  dribbble: <FaDribbble />,
  behance: <FaBehance />,
}

export function getSocialIcon(type: string, className?: string): ReactNode {
  const icon = iconMap[type.toLowerCase()]
  return icon ? <span className={className}>{icon}</span> : <FaGlobe className={className} />
}

export const SOCIAL_PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'snapchat', label: 'Snapchat' },
  { value: 'pinterest', label: 'Pinterest' },
  { value: 'twitch', label: 'Twitch' },
  { value: 'discord', label: 'Discord' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'medium', label: 'Medium' },
  { value: 'github', label: 'GitHub' },
  { value: 'dribbble', label: 'Dribbble' },
  { value: 'behance', label: 'Behance' },
]
