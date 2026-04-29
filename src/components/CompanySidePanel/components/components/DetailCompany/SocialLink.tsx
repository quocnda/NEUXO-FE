const SocialLink = ({
  icon: Icon,
  link,
  name,
}: {
  icon: React.ComponentType<{ size?: number; color: string; width?: number; height?: number }>;
  link?: string;
  name?: string;
}) => {
  if (!link) return null;
  return (
    <div className="flex flex-nowrap items-center gap-1">
      <div>
        <Icon width={14} height={14} color="#9A9FA5" />
      </div>
      <a href={link || undefined} target="_blank" className="text-neutral-40 truncate text-sm font-semibold">
        {name}
      </a>
    </div>
  );
};

export default SocialLink;
