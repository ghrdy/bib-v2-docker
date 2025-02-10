import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { API_URL } from "@/lib/api/config";
import { Label } from "@/components/ui/label";

export default function RequestAcess() {
  const navigate = useNavigate();
  const [nom, setNom] = useState<string>("");
  const [prenom, setPrenom] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/request-access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom, prenom, email, password, note }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Échec de la demande d'accès");
      }

      toast.success("Demande d'accès envoyée avec succès");
      navigate("/login");
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex overflow-hidden flex-col items-center px-4 pt-11 pb-5 w-full bg-white"
    >
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/843e94badbe37ea228d302851b473ed9c4666e05bbab1b7775efa0a2208a4334?placeholderIfAbsent=true&apiKey=00033926861842f2a59f2f6802cccc90"
        alt=""
        className="object-contain w-24 aspect-square"
      />
      <h1 className="mt-8 text-2xl font-semibold text-center text-slate-950">
        Demandez un accès
      </h1>
      <div className="flex flex-col items-end mt-8 w-80 max-w-full text-base text-slate-500">
        <Label htmlFor="nom" className="mt-4">Nom</Label>
        <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} className="mt-1 mb-4" />
        <Label htmlFor="prenom" className="mt-4">Prénom</Label>
        <Input id="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} className="mt-1 mb-4" />
        <Label htmlFor="email" className="mt-4">Email</Label>
        <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 mb-4" />
        <Label htmlFor="password" className="mt-4">Mot de passe</Label>
        <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 mb-4" />
        <Label htmlFor="confirmPassword" className="mt-4">Confirmer le mot de passe</Label>
        <Input id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 mb-4" />
      </div>
      <div className="flex flex-col mt-8 w-80 max-w-full text-base">
        <label htmlFor="note" className="font-semibold text-slate-950">
          Note à l'admnistrateur (optionnel)
        </label>
        <input
          id="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="flex-1 shrink self-stretch px-3 py-2 mt-3 w-full whitespace-nowrap bg-white rounded-lg border border-solid border-slate-200 text-slate-500"
          placeholder="Note"
          aria-label="Note à l'admnistrateur (optionnel)"
        />
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      <div className="flex flex-col items-center mt-8 font-bold whitespace-nowrap">
        <Button type="submit">Demander</Button>
        <Button type="button" onClick={() => navigate("/")}>Annuler</Button>
      </div>
    </form>
  );
}