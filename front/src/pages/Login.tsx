import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { API_URL } from "@/lib/api/config";
import Logo from "../assets/Logo.svg?react";
import Eye from "../assets/Eye.svg?react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Connexion échouée");
      }

      const data = await response.json();

      // Extract user info from JWT token
      const tokenPayload = JSON.parse(atob(data.token.split(".")[1]));

      const user = {
        id: tokenPayload.id,
        nom: tokenPayload.nom,
        prenom: tokenPayload.prenom,
        role: tokenPayload.role,
      };

      login(user, data.token, data.reftoken);
      toast.success("Connexion réussie");
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
      toast.error("Connexion échouée!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-5xl font-bold tracking-tight relative">
        <Logo className="inline-block h-22 w-22 mb-2" />
      </h1>
      <div className="mb-4"></div>
      <h2 className="text-2xl font-semibold mb-4">Connectez vous</h2>
      <div className="mb-4"></div>
      <Card className="w-full max-w-md">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 mt-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Eye
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex justify-end">
              <a
                href="/reset-password"
                className="text-blue-500 hover:underline"
              >
                Mot de passe oublié ?
              </a>
            </div>
            <Button type="submit" variant="custom" className="w-full">
              Se connecter
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mb-4"></div>
      <h3 className="text-l">Vous n'avez pas d'acces ?</h3>
      <div className="flex justify-end">
        <a href="/askfor-acces" className="text-blue-500 hover:underline">
          Demander un accès
        </a>
      </div>
    </div>
  );
}
