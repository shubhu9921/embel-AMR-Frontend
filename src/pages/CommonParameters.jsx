import { ParameterCard } from "../components/ParameterCard";

export function CommonParameters({ parameters }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {parameters.map((param, index) => (
        <ParameterCard key={index} param={param} />
      ))}
    </div>
  );
}
