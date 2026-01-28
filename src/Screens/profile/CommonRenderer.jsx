export default function CommonRenderer({ config, active }) {
  const current = config
    .flatMap((section) => section.items)
    .find((item) => item.key === active);
  if (!current) return null;

  const Component = current.component;
  return <Component />;
}
