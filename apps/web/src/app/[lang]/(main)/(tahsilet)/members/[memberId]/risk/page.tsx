import RiskScore from "./_components/risk-score";

export default function Page() {
  const score = Math.floor(Math.random() * 1900) + 1;
  return <RiskScore score={score} />;
}
