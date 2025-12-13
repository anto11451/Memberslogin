import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Dumbbell, Calendar, Lock } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Iamadmincap' && password === 'Capfitness@2025') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="w-full max-w-md p-8 bg-card/40 border-white/5 backdrop-blur-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-display font-bold text-white">ADMIN ACCESS</h1>
              <p className="text-muted-foreground">Restricted area.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="bg-black/20 border-white/10" 
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="bg-black/20 border-white/10" 
                />
              </div>
              
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 font-bold">
                LOGIN
              </Button>
            </form>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-white">ADMIN <span className="text-red-500">PANEL</span></h1>
          <p className="text-muted-foreground">Content management system.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card/40 border-white/5 p-6 hover:border-red-500/50 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Upload Exercise</h3>
            <p className="text-muted-foreground text-sm mt-2">Add new exercises to the global repository via Google Sheets.</p>
          </Card>

          <Card className="bg-card/40 border-white/5 p-6 hover:border-red-500/50 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Upload Plan</h3>
            <p className="text-muted-foreground text-sm mt-2">Push new training blocks and weekly schedules.</p>
          </Card>

          <Card className="bg-card/40 border-white/5 p-6 hover:border-red-500/50 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Manage Content</h3>
            <p className="text-muted-foreground text-sm mt-2">Edit or delete existing content from the database.</p>
          </Card>
        </div>

        <Card className="bg-card/40 border-white/5 p-8">
          <h3 className="text-xl font-bold text-white mb-6">Quick Upload</h3>
          <div className="border-2 border-dashed border-white/10 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:border-red-500/50 transition-colors cursor-pointer bg-black/20">
            <Upload className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-white font-medium">Drag & Drop files here</p>
            <p className="text-muted-foreground text-sm mt-1">Supported formats: CSV, JSON, PDF</p>
            <Button variant="secondary" className="mt-6">BROWSE FILES</Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
