import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usersApi } from '@/lib/api';
import { User } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, UserX, Shield, Users, Key, Lock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

type UserRole = 'super_admin' | 'moderator';
type DialogMode = 'add' | 'edit' | 'change-password';

const StaffModule = () => {
  const [staff, setStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>('add');
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'moderator' as UserRole,
    is_active: true
  });
  const [passwordData, setPasswordData] = useState({
    new_password: '',
    confirm_password: ''
  });
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const roles = [
    { value: 'super_admin' as UserRole, label: 'Super Admin', color: 'bg-red-100 text-red-800 border-red-200' },
    { value: 'moderator' as UserRole, label: 'Moderator', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  ];

  useEffect(() => {
    fetchStaff();
  }, [roleFilter]);

  const fetchStaff = async () => {
    try {
      const data = await usersApi.list();
      let filteredData = data;
      
      if (roleFilter !== 'all') {
        filteredData = data.filter(user => user.role === roleFilter);
      }
      
      setStaff(filteredData);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast({
        title: "Error",
        description: "Failed to fetch staff members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (dialogMode === 'change-password') {
        // Handle password change
        if (passwordData.new_password !== passwordData.confirm_password) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          });
          return;
        }
        
        if (passwordData.new_password.length < 6) {
          toast({
            title: "Error",
            description: "Password must be at least 6 characters long",
            variant: "destructive",
          });
          return;
        }

        await usersApi.changePassword(passwordData.new_password);
        toast({
          title: "Success",
          description: "Password changed successfully",
        });
      } else if (selectedStaff && dialogMode === 'edit') {
        // Update existing staff member
        const updateData: any = {
          full_name: formData.full_name,
          role: formData.role,
          is_active: formData.is_active,
        };
        
        // Only include password if provided
        if (formData.password.trim()) {
          updateData.password = formData.password;
        }
        
        await usersApi.update(selectedStaff.id, updateData);
        toast({
          title: "Success",
          description: "Staff member updated successfully",
        });
      } else {
        // Create new staff member
        const createData = {
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          is_active: formData.is_active,
        };
        
        await usersApi.create(createData);
        toast({
          title: "Success",
          description: "Staff member created successfully",
        });
      }

      setShowDialog(false);
      setSelectedStaff(null);
      resetForm();
      fetchStaff();
    } catch (error: any) {
      console.error('Error saving staff member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save staff member",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      password: '',
      role: 'moderator' as UserRole,
      is_active: true
    });
    setPasswordData({
      new_password: '',
      confirm_password: ''
    });
  };

  const handleAdd = () => {
    setDialogMode('add');
    setSelectedStaff(null);
    resetForm();
    setShowDialog(true);
  };

  const handleEdit = (member: User) => {
    if (member.is_default_admin) {
      // For default admin, only allow password change
      handleChangePassword(member);
      return;
    }
    
    setDialogMode('edit');
    setSelectedStaff(member);
    setFormData({
      full_name: member.full_name,
      email: member.email,
      password: '', // Don't populate password for security
      role: member.role,
      is_active: member.is_active
    });
    setShowDialog(true);
  };

  const handleChangePassword = (member?: User) => {
    setDialogMode('change-password');
    setSelectedStaff(member || null);
    resetForm();
    setShowDialog(true);
  };

  const toggleActive = async (id: string, active: boolean, member: User) => {
    // Prevent deactivating default admin
    if (member.is_default_admin && !active) {
      toast({
        title: "Error",
        description: "Cannot deactivate the default admin account",
        variant: "destructive",
      });
      return;
    }

    try {
      await usersApi.update(id, { is_active: active });
      
      toast({
        title: "Success",
        description: `Staff member ${active ? 'activated' : 'deactivated'} successfully`,
      });
      
      fetchStaff();
    } catch (error: any) {
      console.error('Error updating active status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update active status",
        variant: "destructive",
      });
    }
  };

  const deleteStaff = async (id: string, member: User) => {
    // Prevent deleting default admin
    if (member.is_default_admin) {
      toast({
        title: "Error",
        description: "Cannot delete the default admin account",
        variant: "destructive",
      });
      return;
    }

    if (!confirm('Are you sure you want to delete this staff member?')) {
      return;
    }
    
    try {
      await usersApi.delete(id);
      
      toast({
        title: "Success",
        description: "Staff member deleted successfully",
      });
      
      fetchStaff();
    } catch (error: any) {
      console.error('Error deleting staff member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete staff member",
        variant: "destructive",
      });
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const roleInfo = roles.find(r => r.value === role);
    return roleInfo?.color || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role: UserRole) => {
    const roleInfo = roles.find(r => r.value === role);
    return roleInfo?.label || role;
  };

  const filteredStaff = staff.filter(member =>
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDialog = () => {
    if (dialogMode === 'change-password') {
      return (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Change Password
                {selectedStaff && ` - ${selectedStaff.full_name}`}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="new_password">New Password</Label>
                <Input
                  id="new_password"
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                  required
                  minLength={6}
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>
              <div>
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                  required
                  minLength={6}
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Change Password
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'edit' ? 'Edit Staff Member' : 'Add New Staff Member'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  disabled={dialogMode === 'edit'}
                />
              </div>
              <div>
                <Label htmlFor="password">
                  Password {dialogMode === 'edit' && '(leave blank to keep current)'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={dialogMode === 'add'}
                  minLength={6}
                  placeholder={dialogMode === 'edit' ? 'Leave blank to keep current' : 'Enter password (min 6 characters)'}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({...formData, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label htmlFor="is_active">Active account</Label>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {dialogMode === 'edit' ? 'Update' : 'Create'} Staff Member
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Manage team members and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleChangePassword()} variant="outline">
            <Key className="w-4 h-4 mr-2" />
            Change My Password
          </Button>
          <Button onClick={handleAdd} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Staff Member
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search staff members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={(value: UserRole | 'all') => setRoleFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Staff Members ({filteredStaff.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading staff...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Details</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((member, index) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                            {member.full_name.charAt(0).toUpperCase()}
                          </div>
                          {member.is_default_admin && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                              <Lock className="w-2 h-2 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {member.full_name}
                            {member.is_default_admin && (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                                <Shield className="w-3 h-3 mr-1" />
                                Protected
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{member.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadge(member.role)}>
                        <Shield className="w-3 h-3 mr-1" />
                        {getRoleLabel(member.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={member.is_active}
                          onCheckedChange={(checked) => toggleActive(member.id, checked, member)}
                          disabled={member.is_default_admin && !member.is_active}
                        />
                        <span className="text-sm">
                          {member.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {member.is_default_admin && (
                          <AlertTriangle className="w-4 h-4 text-yellow-500" title="Protected account" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(member.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(member)} title={member.is_default_admin ? "Change Password" : "Edit User"}>
                          {member.is_default_admin ? <Key className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                        </Button>
                        {!member.is_default_admin && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteStaff(member.id, member)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <UserX className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {renderDialog()}
    </div>
  );
};

export default StaffModule;
