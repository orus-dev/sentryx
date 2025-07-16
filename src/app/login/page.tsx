"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function Login() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const router = useRouter();

  const login = () => {
    setError("");

    const form = formRef.current;
    if (!form) return;

    const username = (form.elements.namedItem("username") as HTMLInputElement)
      ?.value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      ?.value;

    if (!username || !password) return;

    axios
      .post("/api/auth", { username, password })
      .then((r) => {
        Cookies.set("session_id", r.data.sessionId);
        router.replace("/dashboard");
      })
      .catch((e) => {
        setError(e.response?.data?.message || "Login failed");
      });
  };

  const handleInput = () => {
    const form = formRef.current;
    if (!form) return;

    const username = (form.elements.namedItem("username") as HTMLInputElement)
      ?.value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      ?.value;

    setCanSubmit(!!username && !!password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="h-max w-[25rem] px-8 pb-8">
        <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-center mt-5">Login</h1>

          <Label>Username</Label>
          <Input
            name="username"
            autoComplete="username"
            placeholder="Enter your username"
            onInput={handleInput}
          />

          <Label className="mt-2">Password</Label>
          <Input
            name="password"
            autoComplete="current-password"
            type="password"
            placeholder="Enter your password"
            onInput={handleInput}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSubmit) {
                login();
              }
            }}
          />

          {error && <Label className="text-destructive">{error}</Label>}

          <Button
            className="w-max mx-auto mt-3"
            onClick={login}
            disabled={!canSubmit}
          >
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
}
