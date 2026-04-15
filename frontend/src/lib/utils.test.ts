import { cn } from "./utils";

describe("Fonction utilitaire cn()", () => {
  it("fusionne des classes CSS simples", () => {
    expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
  });

  it("gère les classes conditionnelles", () => {
    expect(cn("p-4", { "bg-blue-500": true, "hidden": false })).toBe("p-4 bg-blue-500");
  });

  it("résout les conflits Tailwind correctement (fusion)", () => {
    expect(cn("px-2 py-1", "p-4")).toBe("p-4");
  });

  it("ignore les valeurs nulles ou indéfinies", () => {
    expect(cn("flex", null, undefined, false, "items-center")).toBe("flex items-center");
  });
});