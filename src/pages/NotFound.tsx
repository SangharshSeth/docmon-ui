
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-mono">
      <div className="text-center p-8 max-w-md">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-border mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-lg mb-6">The requested page was not found</p>
        <div className="inline-block border border-border rounded-md overflow-hidden">
          <a 
            href="/" 
            className="px-4 py-2 inline-block hover:bg-accent transition-colors"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
