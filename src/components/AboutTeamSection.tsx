import type { FC } from "react";
import { useTranslation } from "react-i18next";
import TeamMemberCard from "./TeamMemberCard";

const AboutTeamSection: FC = () => {
  const { t } = useTranslation();

  const teamMembers = [
    {
      name: "Sarah",
      role: t("components.aboutTeamSection.roles.sarah"),
      image: "/sarah.jpg",
    },
    {
      name: "David",
      role: t("components.aboutTeamSection.roles.david"),
      image: "/sarah.jpg",
    },
    {
      name: "Elena",
      role: t("components.aboutTeamSection.roles.elena"),
      image: "/sarah.jpg",
    },
    {
      name: "Marcus",
      role: t("components.aboutTeamSection.roles.marcus"),
      image: "/sarah.jpg",
    },
  ];

  return (
    <section className="w-full py-12">
      <h2 className="text-2xl font-bold text-center mb-8 text-primary-900">
        {t("components.aboutTeamSection.title")}
      </h2>
      
      {/* Grid responsivo: 1 col (mobile), 2 cols (tablet), 4 cols (desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.map((member) => (
          <TeamMemberCard
            key={member.name}
            name={member.name}
            role={member.role}
            image={member.image}
          />
        ))}
      </div>
    </section>
  );
};

export default AboutTeamSection;