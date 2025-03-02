
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getTelegramWebApp } from '@/utils/telegramWebApp';

interface SettingsProps {
  onReset: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onReset }) => {
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);
  
  const telegram = getTelegramWebApp();
  
  return (
    <div className="p-4 flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4 sunset-text">Settings</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between dark-glass p-4 rounded-lg">
          <div>
            <h3 className="font-medium">Sound Effects</h3>
            <p className="text-sm text-muted-foreground">Enable game sound effects</p>
          </div>
          <Switch defaultChecked id="sound-mode" />
        </div>
        
        <div className="flex items-center justify-between dark-glass p-4 rounded-lg">
          <div>
            <h3 className="font-medium">Notifications</h3>
            <p className="text-sm text-muted-foreground">Receive game notifications</p>
          </div>
          <Switch id="notification-mode" />
        </div>
        
        <div className="border-t border-white/10 pt-6">
          <h3 className="font-medium mb-2">About Kombat Yoga</h3>
          <p className="text-sm text-muted-foreground mb-4">
            A zen clicker game where you gather energy through yoga poses. Improve your practice, 
            unlock new poses, and reach enlightenment faster than your friends!
          </p>
          <p className="text-xs text-muted-foreground">Version 0.1.0 (Proof of Concept)</p>
        </div>
        
        <div className="border-t border-white/10 pt-6">
          <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">Reset Progress</Button>
            </DialogTrigger>
            <DialogContent className="dark-glass border border-white/10">
              <DialogHeader>
                <DialogTitle>Reset Game Progress</DialogTitle>
                <DialogDescription>
                  This will reset all your progress, including energy, poses, and upgrades. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    onReset();
                    setShowResetConfirm(false);
                  }}
                >
                  Reset
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Settings;
