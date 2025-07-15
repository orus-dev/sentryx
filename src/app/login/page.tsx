import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="h-max w-[25rem] px-8 pb-10">
        <h1 className="text-4xl font-bold text-center mt-5">Login</h1>
        <Label>Username</Label>
        <Input placeholder="Enter your username" />
        <Label>Password</Label>
        <Input placeholder="Enter your password" type="password" />
        <Button>Login</Button>
      </Card>
    </div>
  );
}
