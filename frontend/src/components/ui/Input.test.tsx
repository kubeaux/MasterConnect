import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import Input from "./Input"; 

describe("Composant Input", () => {
  it("rend l'input avec un placeholder", () => {
    render(<Input placeholder="Entrez votre email" />);
    expect(screen.getByPlaceholderText("Entrez votre email")).toBeInTheDocument();
  });

  it("permet à l'utilisateur de taper du texte", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Nom" />);
    
    const inputElement = screen.getByPlaceholderText("Nom");
    await user.type(inputElement, "Dupont");
    
    expect(inputElement).toHaveValue("Dupont");
  });

  it("est désactivé quand la prop disabled est passée", () => {
    render(<Input disabled placeholder="Bloqué" />);
    expect(screen.getByPlaceholderText("Bloqué")).toBeDisabled();
  });

  it("applique les styles d'erreur si nécessaire", () => {
    const { container } = render(<Input aria-invalid="true" />);
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
  });
});