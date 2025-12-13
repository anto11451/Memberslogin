import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockProfile } from '@/lib/mockData';
import { Save } from 'lucide-react';

export default function ProfilePage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-white">USER <span className="text-primary">PROFILE</span></h1>
          <p className="text-muted-foreground">Manage your personal stats and preferences.</p>
        </div>

        <Card className="bg-card/40 border-white/5 p-8 backdrop-blur-xl">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue={mockProfile.name} className="bg-black/20 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <Input defaultValue={mockProfile.age} className="bg-black/20 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input defaultValue={mockProfile.weight} className="bg-black/20 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Height (cm)</Label>
                <Input defaultValue={mockProfile.height} className="bg-black/20 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Primary Goal</Label>
                <select className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>Muscle Gain</option>
                  <option>Fat Loss</option>
                  <option>Endurance</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <select className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <h3 className="text-lg font-bold text-white mb-4">Connected Accounts</h3>
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/5">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center text-green-500 font-bold">G</div>
                   <div>
                     <p className="font-bold text-white">Google Drive</p>
                     <p className="text-xs text-muted-foreground">Connected for backups</p>
                   </div>
                 </div>
                 <Button variant="outline" size="sm" className="border-green-500/50 text-green-500 hover:bg-green-500/10">
                   SYNC NOW
                 </Button>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button className="bg-primary text-black hover:bg-primary/90 font-bold">
                <Save className="w-4 h-4 mr-2" /> SAVE CHANGES
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
