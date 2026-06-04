import type { ReactNode } from "react";

interface AboutValueCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function AboutValueCard({
  icon,
  title,
  description,
}: AboutValueCardProps) {
  return (
    <article className="flex flex-col items-center gap-3 rounded-xl bg-white p-6 text-center shadow-sm">
      <span className="text-primary-700" aria-hidden="true">
        {icon}
      </span>
      <h3 className="text-lg font-semibold text-muted-950">{title}</h3>
      <p className="text-sm text-muted-700">{description}</p>
    </article>
  );
}