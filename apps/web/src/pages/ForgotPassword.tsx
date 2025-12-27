import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError("Please enter your email address.");
            return;
        }
        // Mock API call
        setTimeout(() => {
            setSubmitted(true);
            setError("");
        }, 1000);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-xl">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                        {submitted ? "Check your inbox" : "Forgot Password"}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {submitted 
                            ? "We've sent a password reset link to your email." 
                            : "Enter your email using which you created account"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {submitted ? (
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="rounded-full bg-primary/10 p-3 text-primary">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <Button asChild className="w-full mt-4">
                                <Link to="/login">Back to Login</Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                                    Email Address
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

                            {error && (
                                <div className="text-sm text-destructive font-medium text-center">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10">
                                Send Reset Link
                            </Button>

                            <div className="flex justify-center text-sm text-muted-foreground mt-4">
                                <Link to="/login" className="flex items-center gap-2 hover:text-primary transition-colors">
                                    <ArrowLeft className="h-4 w-4" /> Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
