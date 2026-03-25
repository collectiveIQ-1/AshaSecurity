import { useParams } from "react-router-dom";
import Wizard from "./Wizard.jsx";

export default function WizardRoute() {
  const { region, type } = useParams();

  // ✅ key forces full remount whenever region/type changes
  return <Wizard key={`${region}-${type}`} />;
}
