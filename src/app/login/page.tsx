"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const login = () => {
    setError("");
    axios({
      method: "post",
      url: "/api/auth",
      data: {
        username,
        password,
      },
    })
      .then((r) => {
        Cookies.set("session_id", r.data.sessionId);
        router.replace("/dashboard");
      })
      .catch((e) => {
        setError(e.response.data.message);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="h-max w-[25rem] px-8 pb-8 gap-3">
        <h1 className="text-4xl font-bold text-center mt-5">Login</h1>
        <Label>Username</Label>
        <Input
          placeholder="Enter your username"
          onInput={(e) => {
            setUsername((e.target as any).value);
          }}
        />
        <Label className="mt-1">Password</Label>
        <Input
          placeholder="Enter your password"
          type="password"
          onInput={(e) => {
            setPassword((e.target as any).value);
          }}
          onKeyDown={(e) => {
            if (e.key == "Enter" && username != "" && password != "") {
              login();
            }
          }}
        />
        {error ? <Label className="text-destructive">{error}</Label> : ""}
        <Button
          className="w-max mx-auto mt-3"
          onClick={login}
          disabled={username == "" || password == ""}
        >
          Login
        </Button>
      </Card>
    </div>
  );
}
