import React from "react";
import { Link } from "react-router-dom";
import { MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="flex flex-col items-center text-center space-y-6 max-w-md px-4">
        <div className="relative">
          <MapPinOff className="w-24 h-24 text-muted-foreground animate-pulse" />
          <div className="absolute -bottom-2 -right-2 bg-destructive/10 text-destructive text-sm font-bold px-2 py-1 rounded-md">
            404
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight">
          Destination Unknown
        </h1>

        <p className="text-muted-foreground text-lg">
          It looks like this coordinate doesn't exist on our map. The page you
          are looking for might have been moved or deleted.
        </p>

        <div className="pt-4">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto">
              Return to Base
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
