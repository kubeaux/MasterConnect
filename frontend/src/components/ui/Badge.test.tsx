import { render, screen } from "@testing-library/react";
import Badge from "./Badge";

describe("Composant Badge", () => {
  it("rend le badge avec le texte enfant", () => {
    render(<Badge>Nouveau</Badge>);
    expect(screen.getByText("Nouveau")).toBeInTheDocument();
  });

  it("applique le variant par défaut", () => {
    render(<Badge>Défaut</Badge>);
    const badge = screen.getByText("Défaut");
    expect(badge).toBeInTheDocument();
  });

  it("gère les props additionnelles (className custom)", () => {
    render(<Badge className="test-custom-class">Custom</Badge>);
    expect(screen.getByText("Custom")).toHaveClass("test-custom-class");
  });
});