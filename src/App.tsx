import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BasePathProvider } from "@/hooks/use-base-path";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import BlogsPage from "@/pages/blogs";
import TalksPage from "@/pages/talks";
import PublicationsPage from "@/pages/publications";
import BlogPostPage from "@/pages/blog-post";
import About from "@/pages/about";

function getBasePath() {
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);
  if (segments.length > 0 && !['about', 'blog', 'talks', 'publications'].includes(segments[0])) {
    return `/${segments[0]}`;
  }
  
  return '';
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/blog" component={BlogsPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/talks" component={TalksPage} />
      <Route path="/publications" component={PublicationsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const basePath = getBasePath();
  return (
    <BasePathProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router base={basePath}>
            <AppRouter />
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </BasePathProvider>
  );
}

export default App;
