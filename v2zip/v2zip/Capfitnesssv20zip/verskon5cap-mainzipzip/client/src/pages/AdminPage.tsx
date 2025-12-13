import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Dumbbell, Calendar, Lock, Users, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminAuth, adminGetAllUsers, adminCreateUser, adminUpdateUser, UserProfile } from '@/lib/googleSheetsApi';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content'>('overview');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newUser, setNewUser] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    gender: 'Male',
    age: 25,
    height_cm: 170,
    starting_weight: 70,
    current_weight: 70,
    goal_weight: 65,
    membership_type: 'Standard',
    membership_duration: '3 months',
    calorie_target: 2000,
    protein_target: 150,
    carbs_target: 200,
    fats_target: 65,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (username === 'iamcap' && password === 'Sunshine@123') {
      setIsAuthenticated(true);
      setError('');
      toast({ title: 'Welcome Admin', description: 'Successfully logged in.' });
    } else {
      setError('Invalid credentials');
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    setLoading(true);
    const fetchedUsers = await adminGetAllUsers(username, password);
    if (fetchedUsers) {
      setUsers(fetchedUsers);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'users') {
      loadUsers();
    }
  }, [isAuthenticated, activeTab]);

  const handleCreateUser = async () => {
    setLoading(true);
    const result = await adminCreateUser(username, password, newUser);
    if (result?.ok) {
      toast({ title: 'User Created', description: `User created successfully. Generated password: ${result.generated_password || 'Check email'}` });
      setIsCreating(false);
      setNewUser({
        name: '',
        email: '',
        gender: 'Male',
        age: 25,
        height_cm: 170,
        starting_weight: 70,
        current_weight: 70,
        goal_weight: 65,
        membership_type: 'Standard',
        membership_duration: '3 months',
        calorie_target: 2000,
        protein_target: 150,
        carbs_target: 200,
        fats_target: 65,
      });
      loadUsers();
    } else {
      toast({ title: 'Error', description: 'Failed to create user.', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    setLoading(true);
    const result = await adminUpdateUser(username, password, selectedUser.user_id, selectedUser);
    if (result?.ok) {
      toast({ title: 'User Updated', description: 'User profile updated successfully.' });
      setIsUserDialogOpen(false);
      loadUsers();
    } else {
      toast({ title: 'Error', description: 'Failed to update user.', variant: 'destructive' });
    }
    setLoading(false);
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold text-white">ADMIN <span className="text-red-500">PANEL</span></h1>
            <p className="text-muted-foreground">Content management system.</p>
          </div>
          <Button variant="outline" onClick={() => setIsAuthenticated(false)} className="border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white">
            Logout
          </Button>
        </div>

        <div className="flex gap-2 border-b border-white/10 pb-4">
          <Button 
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('overview')}
            className={activeTab === 'overview' ? 'bg-red-600 text-white' : ''}
          >
            <FileText className="w-4 h-4 mr-2" /> Overview
          </Button>
          <Button 
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('users')}
            className={activeTab === 'users' ? 'bg-red-600 text-white' : ''}
          >
            <Users className="w-4 h-4 mr-2" /> Users
          </Button>
          <Button 
            variant={activeTab === 'content' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('content')}
            className={activeTab === 'content' ? 'bg-red-600 text-white' : ''}
          >
            <Dumbbell className="w-4 h-4 mr-2" /> Content
          </Button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card/40 border-white/5 p-6 hover:border-red-500/50 transition-all cursor-pointer group" onClick={() => setActiveTab('content')}>
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Upload Exercise</h3>
              <p className="text-muted-foreground text-sm mt-2">Add new exercises to the global repository via Google Sheets.</p>
            </Card>

            <Card className="bg-card/40 border-white/5 p-6 hover:border-red-500/50 transition-all cursor-pointer group" onClick={() => setActiveTab('content')}>
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Upload Plan</h3>
              <p className="text-muted-foreground text-sm mt-2">Push new training blocks and weekly schedules.</p>
            </Card>

            <Card className="bg-card/40 border-white/5 p-6 hover:border-red-500/50 transition-all cursor-pointer group" onClick={() => setActiveTab('users')}>
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Manage Users</h3>
              <p className="text-muted-foreground text-sm mt-2">Create, edit, and manage member accounts.</p>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              <Button onClick={() => setIsCreating(true)} className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" /> Add User
              </Button>
            </div>

            {isCreating && (
              <Card className="bg-card/40 border-white/5 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">Create New User</h3>
                  <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}><X className="w-4 h-4" /></Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={newUser.name || ''} onChange={(e) => setNewUser({...newUser, name: e.target.value})} className="bg-black/20 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={newUser.email || ''} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="bg-black/20 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select value={newUser.gender} onValueChange={(v) => setNewUser({...newUser, gender: v})}>
                      <SelectTrigger className="bg-black/20 border-white/10"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-card border-white/10">
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input type="number" value={newUser.age || ''} onChange={(e) => setNewUser({...newUser, age: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input type="number" value={newUser.height_cm || ''} onChange={(e) => setNewUser({...newUser, height_cm: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Weight (kg)</Label>
                    <Input type="number" value={newUser.current_weight || ''} onChange={(e) => setNewUser({...newUser, current_weight: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Goal Weight (kg)</Label>
                    <Input type="number" value={newUser.goal_weight || ''} onChange={(e) => setNewUser({...newUser, goal_weight: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Calorie Target</Label>
                    <Input type="number" value={newUser.calorie_target || ''} onChange={(e) => setNewUser({...newUser, calorie_target: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Protein Target (g)</Label>
                    <Input type="number" value={newUser.protein_target || ''} onChange={(e) => setNewUser({...newUser, protein_target: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                  </div>
                </div>
                <Button onClick={handleCreateUser} disabled={loading} className="mt-4 bg-red-600 hover:bg-red-700">
                  <Save className="w-4 h-4 mr-2" /> Create User
                </Button>
              </Card>
            )}

            <Card className="bg-card/40 border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-black/40">
                    <tr>
                      <th className="text-left p-4 text-muted-foreground font-medium">Name</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Email</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Membership</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Plan</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 && (
                      <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">{loading ? 'Loading users...' : 'No users found. Users will appear here when loaded from Google Sheets.'}</td></tr>
                    )}
                    {users.map((user) => (
                      <tr key={user.user_id} className="border-t border-white/5 hover:bg-white/5">
                        <td className="p-4 text-white font-medium">{user.name}</td>
                        <td className="p-4 text-muted-foreground">{user.email}</td>
                        <td className="p-4"><span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">{user.membership_type}</span></td>
                        <td className="p-4 text-muted-foreground">{user.plan_assigned || 'None'}</td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(user); setIsUserDialogOpen(true); }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'content' && (
          <Card className="bg-card/40 border-white/5 p-8">
            <h3 className="text-xl font-bold text-white mb-6">Quick Upload</h3>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:border-red-500/50 transition-colors cursor-pointer bg-black/20">
              <Upload className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-white font-medium">Drag & Drop files here</p>
              <p className="text-muted-foreground text-sm mt-1">Supported formats: CSV, JSON, PDF</p>
              <Button variant="secondary" className="mt-6">BROWSE FILES</Button>
            </div>
          </Card>
        )}

        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="max-w-2xl bg-card border-white/10 text-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display font-bold">Edit User</DialogTitle>
              <DialogDescription>Update user profile and targets.</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={selectedUser.name} onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})} className="bg-black/20 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={selectedUser.email} onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})} className="bg-black/20 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input type="number" value={selectedUser.age} onChange={(e) => setSelectedUser({...selectedUser, age: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <Input type="number" value={selectedUser.height_cm} onChange={(e) => setSelectedUser({...selectedUser, height_cm: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Current Weight (kg)</Label>
                  <Input type="number" value={selectedUser.current_weight} onChange={(e) => setSelectedUser({...selectedUser, current_weight: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Goal Weight (kg)</Label>
                  <Input type="number" value={selectedUser.goal_weight} onChange={(e) => setSelectedUser({...selectedUser, goal_weight: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Calorie Target</Label>
                  <Input type="number" value={selectedUser.calorie_target} onChange={(e) => setSelectedUser({...selectedUser, calorie_target: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Protein Target (g)</Label>
                  <Input type="number" value={selectedUser.protein_target} onChange={(e) => setSelectedUser({...selectedUser, protein_target: Number(e.target.value)})} className="bg-black/20 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Plan Assigned</Label>
                  <Input value={selectedUser.plan_assigned || ''} onChange={(e) => setSelectedUser({...selectedUser, plan_assigned: e.target.value})} className="bg-black/20 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Membership Type</Label>
                  <Select value={selectedUser.membership_type} onValueChange={(v) => setSelectedUser({...selectedUser, membership_type: v})}>
                    <SelectTrigger className="bg-black/20 border-white/10"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={handleUpdateUser} disabled={loading} className="bg-red-600 hover:bg-red-700">
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
