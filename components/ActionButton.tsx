import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  href?: string;
  colorClass?: string; // Kept for API compatibility but used subtly
  onClick?: () => void;
}

export function ActionButton({ icon: Icon, label, href, colorClass, onClick }: ActionButtonProps) {
  // Extract color for the icon only, using Tailwind arbitrary values or simple text classes if possible.
  // For V2, we enforce a consistent style: White card, subtle border, colored icon.

  const content = (
    <div className="group flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer h-full">
      <div className={`p-3 rounded-lg bg-slate-50 group-hover:bg-indigo-50 transition-colors mb-3`}>
        <Icon className="w-6 h-6 text-slate-500 group-hover:text-indigo-600 transition-colors" strokeWidth={1.5} />
      </div>
      <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 text-center leading-tight">
        {label}
      </span>
    </div>
  );

  if (href) {
    return <Link href={href} className="block h-full">{content}</Link>;
  }

  return <div onClick={onClick} className="h-full">{content}</div>;
}
