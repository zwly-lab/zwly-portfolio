import { capabilities } from "@/data/site";
export function TechStack() {
  return <div className="tech-stack">{capabilities.map(({ title, tools }) => <div className="tech-column" key={title}><h3>{title}</h3><p>{tools.join(" / ")}</p></div>)}</div>;
}