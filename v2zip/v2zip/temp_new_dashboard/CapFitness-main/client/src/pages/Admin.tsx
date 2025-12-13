import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Calendar, User, LogOut, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import PageWrapper from "@/components/PageWrapper";

const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbxIPA6NY5sx6bYco5LjpjDJ9RspDys-yXESJ851AUAPcnKQBtmihkJiGMGDVaMKOaC8GQ/exec";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn !== "true") setLocation("/admin-login");
  }, []);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Cap's FITNESS Team");
  const [category, setCategory] = useState("Fitness Tips");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBlogs = async () => {
    try {
      const res = await fetch(GOOGLE_API_URL);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        _secret: "CapSecret2025",
        _action: "add-blog",
        title,
        content,
        author,
        category,
      };

      await fetch(GOOGLE_API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast({ title: "Success", description: "Blog added successfully!" });

      setTitle("");
      setContent("");

      setTimeout(loadBlogs, 800);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add blog",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const deletePost = async (id: string) => {
    try {
      const payload = {
        _secret: "CapSecret2025",
        _action: "delete-blog",
        id,
      };

      await fetch(GOOGLE_API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast({ title: "Deleted", description: "Blog deleted!" });

      setTimeout(loadBlogs, 700);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: any) => new Date(date).toLocaleDateString();

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      "Fitness Tips": "bg-primary/20 text-primary border-primary/30",
      "Nutrition": "bg-green-500/20 text-green-400 border-green-500/30",
      "Workouts": "bg-accent/20 text-accent border-accent/30",
      "Motivation": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "Fat Loss": "bg-pink-500/20 text-pink-400 border-pink-500/30",
    };
    return colors[cat] || "bg-muted text-muted-foreground";
  };

  return (
    <PageWrapper showFooter={false}>
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => setLocation("/blog")}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Button>
            
            <Button
              variant="destructive"
              onClick={() => {
                localStorage.removeItem("adminLoggedIn");
                setLocation("/admin-login");
              }}
              className="hover:bg-destructive/90"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </motion.div>

          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Admin <span className="text-primary neon-text">Dashboard</span>
            </h1>
            <p className="text-lg text-muted-foreground">Create and manage blog posts</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card/80 backdrop-blur-sm border border-primary/30 neon-border overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2 font-display">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-primary" />
                    </div>
                    Create New Post
                  </CardTitle>
                  <CardDescription>Share your fitness knowledge</CardDescription>
                </CardHeader>

                <CardContent className="relative">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-foreground">Title</Label>
                      <Input 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="Enter post title..."
                        className="bg-background/50 border-border/50 focus:border-primary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Author</Label>
                      <Input 
                        value={author} 
                        onChange={(e) => setAuthor(e.target.value)}
                        className="bg-background/50 border-border/50 focus:border-primary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="Fitness Tips">Fitness Tips</SelectItem>
                          <SelectItem value="Nutrition">Nutrition</SelectItem>
                          <SelectItem value="Workouts">Workouts</SelectItem>
                          <SelectItem value="Motivation">Motivation</SelectItem>
                          <SelectItem value="Fat Loss">Fat Loss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Content</Label>
                      <Textarea
                        rows={8}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your post content..."
                        className="bg-background/50 border-border/50 focus:border-primary/50 resize-none"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full neon-glow bg-primary hover:bg-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      {isSubmitting ? "Creating..." : "Create Post"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <Card className="bg-card/80 backdrop-blur-sm border border-accent/30 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none" />
                <CardHeader className="relative">
                  <CardTitle className="font-display">Published Posts</CardTitle>
                  <CardDescription>Manage your blog posts</CardDescription>
                </CardHeader>

                <CardContent className="relative">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No posts yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {posts.map((post: any, index) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="p-4 bg-background/50 border border-border/30 hover:border-primary/30 transition-colors">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1 min-w-0">
                                <Badge 
                                  variant="outline" 
                                  className={`mb-2 ${getCategoryColor(post.category)}`}
                                >
                                  {post.category}
                                </Badge>
                                <h3 className="font-display font-semibold truncate">{post.title}</h3>
                                <div className="flex flex-col gap-1 mt-2 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" /> {post.author}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {formatDate(post.date)}
                                  </div>
                                </div>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deletePost(post.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
