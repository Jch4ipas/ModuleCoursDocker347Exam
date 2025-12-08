import Clock from "@/components/Clock";

export const registry = {
  Clock,
  "": () => <></>,
  iframe: (props) => <iframe {...props} />,
};

export const reverseRegistry = Object.fromEntries(
  Object.entries(registry).map(([key, value]) => [value, key])
);