
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { contactSubmissionsApi } from '@/lib/api';
import { ContactSubmission } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Search, Eye, UserCheck, Mail, Phone, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';



const ContactsModule = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const data = await contactSubmissionsApi.list();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contact submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string, read: boolean) => {
    try {
      if (read) {
        await contactSubmissionsApi.markAsRead(id);
      } else {
        await contactSubmissionsApi.update(id, { is_read: false });
      }
      
      toast({
        title: "Success",
        description: `Marked as ${read ? 'read' : 'unread'}`,
      });
      
      fetchSubmissions();
    } catch (error: any) {
      console.error('Error updating read status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update read status",
        variant: "destructive",
      });
    }
  };

  const viewDetails = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
    
    // Mark as read when viewing
    if (!submission.is_read) {
      markAsRead(submission.id, true);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    // Search filter
    const matchesSearch = submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'read' && submission.is_read) ||
      (statusFilter === 'unread' && !submission.is_read);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
        <p className="text-gray-600">View and manage contact form submissions</p>
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
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Submissions</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Submissions ({filteredSubmissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading submissions...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Message Preview</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission, index) => (
                  <motion.tr
                    key={submission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`hover:bg-gray-50 ${!submission.is_read ? 'bg-blue-50' : ''}`}
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          {submission.name}
                          {!submission.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Mail className="w-3 h-3" />
                          {submission.email}
                        </div>
                        {submission.phone && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {submission.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {submission.subject || 'No subject'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-sm truncate text-sm text-gray-600">
                        {submission.message}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={submission.is_read ? "secondary" : "default"}>
                        {submission.is_read ? 'Read' : 'Unread'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        {new Date(submission.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => viewDetails(submission)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => markAsRead(submission.id, !submission.is_read)}
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <div className="font-medium">{selectedSubmission.name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <div className="font-medium">{selectedSubmission.email}</div>
                </div>
                {selectedSubmission.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <div className="font-medium">{selectedSubmission.phone}</div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Date Submitted</label>
                  <div className="font-medium">
                    {new Date(selectedSubmission.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              {selectedSubmission.subject && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Subject</label>
                  <div className="font-medium">{selectedSubmission.subject}</div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-600">Message</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                  {selectedSubmission.message}
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button 
                  variant="outline"
                  onClick={() => markAsRead(selectedSubmission.id, !selectedSubmission.is_read)}
                >
                  Mark as {selectedSubmission.is_read ? 'Unread' : 'Read'}
                </Button>
                <Button onClick={() => setShowDetailModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactsModule;
