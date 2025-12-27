import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    const err = await login(email, password);
    if (err) {
        setError(err);
    } else {
        navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-xl">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground">Enter your credentials to sign in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
             <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                Email
            </label>
            <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                    Password
                </label>
            </div>
            <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive font-medium text-center">
                {error}
            </div>
          )}

          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10" 
            onClick={handleLogin}
          >
            Sign in
          </Button>

          <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
             <Link to="/forgot-password" className="hover:text-primary underline underline-offset-4">
                Forgot Password?
             </Link>
             <Link to="/signup" className="hover:text-primary underline underline-offset-4">
                Sign Up
             </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
