import {
  GraduationCap,
  Radar,
  FileSearch,
  Handshake,
  Trophy,
  BadgeCheck,
  type LucideIcon,
} from 'lucide-react';
import type { ServiceIcon as ServiceIconName } from '@/data/services';

const ICONS: Record<ServiceIconName, LucideIcon> = {
  GraduationCap,
  Radar,
  FileSearch,
  Handshake,
  Trophy,
  BadgeCheck,
};

export default function ServiceIcon({
  name,
  className = 'h-6 w-6',
}: {
  name: ServiceIconName;
  className?: string;
}) {
  const Icon = ICONS[name];
  return <Icon className={className} strokeWidth={1.5} />;
}
