interface Props {
  firstName: string;
  lastName: string;
  title?: string;
  className?: string; // Allow custom overrides
}

export function FormattedName({ firstName, lastName, title, className }: Props) {
  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  return (
    <span className={className}>
      {title && (
        <span className="text-amber-500/80 mr-1">
          {title.endsWith('.') ? title : `${title}.`}
        </span>
      )}
      {capitalize(firstName)} {capitalize(lastName)}
    </span>
  );
}