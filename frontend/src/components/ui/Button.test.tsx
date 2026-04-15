import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe("Composant Button", () => {
  it("rend le bouton avec son texte enfant", () => {
    render(<Button>Valider</Button>);
    expect(screen.getByRole("button", { name: "Valider" })).toBeInTheDocument();
  });

  it("applique les classes par défaut (primary, md)", () => {
    render(<Button>Défaut</Button>);
    const button = screen.getByRole("button", { name: "Défaut" });
    expect(button).toHaveClass("bg-primary-700");
    expect(button).toHaveClass("px-5");
  });

  it("applique correctement la variante 'danger'", () => {
    render(<Button variant="danger">Supprimer</Button>);
    const button = screen.getByRole("button", { name: "Supprimer" });
    expect(button).toHaveClass("bg-accent-500");
  });

  it("applique correctement la taille 'sm'", () => {
    render(<Button size="sm">Petit</Button>);
    expect(screen.getByRole("button", { name: "Petit" })).toHaveClass("px-3 py-1.5");
  });

  it("réagit au clic de l'utilisateur", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Cliquer</Button>);
    
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Cliquer" }));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("se désactive et affiche un loader quand isLoading est true", () => {
    const { container } = render(<Button isLoading>Chargement</Button>);
    const button = screen.getByRole("button", { name: "Chargement" });
    
    expect(button).toBeDisabled();
    expect(container.querySelector(".animate-spin")).toBeInTheDocument(); 
  });

  it("est désactivé quand la prop disabled est passée", () => {
    render(<Button disabled>Inactif</Button>);
    expect(screen.getByRole("button", { name: "Inactif" })).toBeDisabled();
  });
});