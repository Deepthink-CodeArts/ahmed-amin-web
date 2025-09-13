import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import { blogPostsApi, uploadsApi } from '@/lib/api';
import { BlogPost } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Eye, FileText, Trash2, X } from 'lucide-react';
import { motion } from 'framer-motion';

const BlogModule = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    title_bn: '',
    content: '',
    content_bn: '',
    excerpt: '',
    excerpt_bn: '',
    cover_image: '',
    tags: [] as string[],
    is_published: false
  });
  const [newTag, setNewTag] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await blogPostsApi.list();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = selectedPost?.slug || generateSlug(formData.title);
      
      const postData = {
        title: formData.title,
        title_bn: formData.title_bn || null,
        slug: slug,
        content: formData.content,
        content_bn: formData.content_bn || null,
        excerpt: formData.excerpt || null,
        excerpt_bn: formData.excerpt_bn || null,
        cover_image: formData.cover_image || null,
        tags: formData.tags && formData.tags.length > 0 ? formData.tags : [],
        is_published: formData.is_published
      };

      if (selectedPost) {
        await blogPostsApi.update(selectedPost.id, postData);
        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
      } else {
        await blogPostsApi.create(postData);
        toast({
          title: "Success",
          description: "Blog post created successfully",
        });
      }

      setShowAddForm(false);
      setSelectedPost(null);
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        title: "Error",
        description: "Failed to save blog post",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      title_bn: '',
      content: '',
      content_bn: '',
      excerpt: '',
      excerpt_bn: '',
      cover_image: '',
      tags: [],
      is_published: false
    });
    setNewTag('');
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const response = await uploadsApi.uploadImage(file);
      setFormData({ ...formData, cover_image: response.url });
      
      // Show WebP conversion information
      const originalSize = uploadsApi.formatFileSize(response.original_size);
      const webpSize = uploadsApi.formatFileSize(response.size);
      const compression = response.compression_ratio;
      
      toast({
        title: "Success",
        description: `Cover image uploaded and converted to WebP successfully! 
                     Original: ${originalSize} → WebP: ${webpSize} (${compression}% smaller)`,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      title_bn: post.title_bn || '',
      content: post.content,
      content_bn: post.content_bn || '',
      excerpt: post.excerpt || '',
      excerpt_bn: post.excerpt_bn || '',
      cover_image: post.cover_image || '',
      tags: post.tags || [],
      is_published: post.is_published
    });
    setShowAddForm(true);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: newTags });
  };

  const togglePublished = async (id: string, published: boolean) => {
    try {
      await blogPostsApi.update(id, { is_published: published });
      
      toast({
        title: "Success",
        description: `Post ${published ? 'published' : 'unpublished'} successfully`,
      });
      
      fetchPosts();
    } catch (error) {
      console.error('Error updating publish status:', error);
      toast({
        title: "Error",
        description: "Failed to update publish status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (post: BlogPost) => {
    setPostToDelete(post);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    
    try {
      await blogPostsApi.delete(postToDelete.id);
      
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      
      fetchPosts();
    } catch (error: any) {
      console.error('Error deleting blog post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      });
    } finally {
      setShowDeleteConfirm(false);
      setPostToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setPostToDelete(null);
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600">Create and publish blog posts</p>
        </div>
        <Button onClick={() => { setShowAddForm(true); resetForm(); setSelectedPost(null); }} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Blog Post
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search by title or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blog Posts ({filteredPosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading posts...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post Details</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post, index) => (
                  <motion.tr
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <div className="font-medium">{post.title}</div>
                          {post.excerpt && (
                            <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {post.excerpt}
                            </div>
                          )}
                          <div className="text-xs text-gray-400 mt-1">
                            Slug: /{post.slug}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.tags?.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={post.is_published}
                          onCheckedChange={(checked) => togglePublished(post.id, checked)}
                        />
                        <span className="text-sm">
                          {post.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(post)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
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

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPost ? 'Edit Blog Post' : 'Create New Blog Post'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title (English)</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="title_bn">Title (Bengali)</Label>
                <Input
                  id="title_bn"
                  value={formData.title_bn}
                  onChange={(e) => setFormData({...formData, title_bn: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="excerpt">Excerpt (English)</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  placeholder="Brief description of the post..."
                  rows={2}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="excerpt_bn">Excerpt (Bengali)</Label>
                <Textarea
                  id="excerpt_bn"
                  value={formData.excerpt_bn}
                  onChange={(e) => setFormData({...formData, excerpt_bn: e.target.value})}
                  placeholder="পোস্টের সংক্ষিপ্ত বিবরণ..."
                  rows={2}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="content">Content (English) - Markdown Supported</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Write your blog post content here... Markdown is supported."
                  rows={10}
                  required
                  className="min-h-[200px] font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Markdown supported. Use formatting like **bold**, *italic*, ## headings, - bullet points, etc.
                </p>
              </div>
              <div className="col-span-2">
                <Label htmlFor="content_bn">Content (Bengali) - Markdown Supported</Label>
                <Textarea
                  id="content_bn"
                  value={formData.content_bn}
                  onChange={(e) => setFormData({...formData, content_bn: e.target.value})}
                  placeholder="এখানে আপনার ব্লগ পোস্টের বিষয়বস্তু লিখুন... Markdown সমর্থিত।"
                  rows={10}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
              <div>
                <Label htmlFor="cover_image">Cover Image</Label>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-600">Image URL</Label>
                    <Input
                      id="cover_image"
                      value={formData.cover_image}
                      onChange={(e) => setFormData({...formData, cover_image: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">OR</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Upload Image</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file);
                          }
                        }}
                        disabled={uploading}
                        className="flex-1"
                      />
                      {uploading && (
                        <div className="text-sm text-blue-600">Uploading...</div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports: JPG, PNG, GIF, WebP (max 5MB)
                    </p>
                  </div>
                  {formData.cover_image && (
                    <div className="mt-2">
                      <Label className="text-sm text-gray-600">Preview</Label>
                      <div className="mt-1 p-2 border rounded-md">
                        <img
                          src={formData.cover_image}
                          alt="Preview"
                          className="max-h-32 max-w-full object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Tags - same UX pattern as VisaModule */}
              <div className="col-span-2">
                <Label>Tags</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Add Tag
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => removeTag(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-2 flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({...formData, is_published: checked})}
                />
                <Label htmlFor="is_published">Publish immediately</Label>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {selectedPost ? 'Update' : 'Create'} Post
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete the blog post <strong>"{postToDelete?.title}"</strong>?
            </p>
            <p className="text-sm text-gray-500">
              This action cannot be undone. All post data, content, and images will be permanently removed.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Blog Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogModule;
