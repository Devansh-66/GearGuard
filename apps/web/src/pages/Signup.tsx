import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function Signup() {
    const navigate = useNavigate();
    const { login } = useAuth(); // We might auto-login after signup
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSignup = async () => {
        setError('');
        const { name, email, password, confirmPassword } = formData;

        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 4) {
             setError("Password must be at least 4 characters.");
             return;
        }

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role: 'Technician' })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Signup failed");
                return;
            }

            // Auto-login after signup
            await login(email, password);
            navigate('/');
        } catch (e) {
            setError("Network error during signup");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center text-foreground">
                        Create an account
                    </CardTitle>
                    <CardDescription className="text-center text-muted-foreground">
                        Enter your details below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="name">
                            Name
                        </label>
                        <Input 
                            id="name" 
                            name="name" 
                            placeholder="John Doe" 
                            value={formData.name}
                            onChange={handleChange}
                            className="bg-background/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                            Email
                        </label>
                        <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder="m@example.com" 
                            value={formData.email}
                            onChange={handleChange}
                            className="bg-background/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                            Password
                        </label>
                        <Input 
                            id="password" 
                            name="password" 
                            type="password" 
                            value={formData.password}
                            onChange={handleChange}
                            className="bg-background/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="confirmPassword">
                            Re-Enter Password
                        </label>
                        <Input 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            type="password" 
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="bg-background/50"
                        />
                    </div>
                    
                    {error && (
                        <div className="text-sm text-destructive font-medium text-center">
                            {error}
                        </div>
                    )}

                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" onClick={handleSignup}>
                        Sign Up
                    </Button>

                    <div className="text-center text-sm text-muted-foreground mt-4">
                        Already have an account?{" "}
                        <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                            Sign In
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
