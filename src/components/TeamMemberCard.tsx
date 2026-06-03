import type { FC } from "react";

interface TeamMemberCardProps {
  image: string;
  name: string;
  role: string;
}

const TeamMemberCard: FC<TeamMemberCardProps> = ({ image, name, role }) => {
  return (
    <article className="flex flex-col items-center">
      {/* Container da imagem com aspect-ratio 1:1 e full-width */}
      <div className="w-full aspect-square overflow-hidden rounded-lg bg-muted-100 mb-4">
        <img
          src={image}
          alt={name} // Acessibilidade: O nome serve de descrição para o avatar
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Nome e Cargo centralizados */}
      <h3 className="font-bold text-lg text-center text-primary-900">{name}</h3>
      <p className="text-sm text-muted-600 text-center mt-1">{role}</p>
    </article>
  );
};

export default TeamMemberCard;