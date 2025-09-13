import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { projectConfig } from '@/lib/projectConfig';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown,
  Image,
  Palette,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Settings,
  Globe,
  Star,
  Zap,
  Search,
  MessageCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { 
  heroScenesApi, 
  heroContentApi, 
  contactInfoApi, 
  serviceOptionsApi, 
  siteManagementApi,
  uploadsApi
} from '@/lib/api';

interface HeroScene {
  id: string;
  name: string;
  name_bn?: string;
  image_url: string;
  gradient_class: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface HeroContent {
  id: string;
  headline_en: string;
  headline_bn: string;
  subtitle_en: string;
  subtitle_bn: string;
  cta_text_en: string;
  cta_text_bn: string;
  cta_link: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ContactInfo {
  id: string;
  company_name: string;
  company_name_bn: string;
  tagline_en: string;
  tagline_bn: string;
  address_en: string;
  address_bn: string;
  phone: string;
  phone_display_bn?: string;
  email: string;
  working_hours_en: string;
  working_hours_bn: string;
  social_links?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    whatsapp?: string;
  };
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ServiceOption {
  id: string;
  name_en: string;
  name_bn: string;
  description_en?: string;
  description_bn?: string;
  icon?: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

interface Overview {
  total_hero_scenes: number;
  active_hero_scenes: number;
  current_hero_content?: HeroContent;
  current_contact_info?: ContactInfo;
  total_service_options: number;
  active_service_options: number;
}

const SiteManagementModule: React.FC = () => {
  // Set initial tab based on available features
  const getInitialTab = () => {
    if (projectConfig.features.hero_content) return 'hero-content';
    if (projectConfig.features.contact_info) return 'contact-info';
    if (projectConfig.features.hero_scenes) return 'hero-scenes';
    if (projectConfig.features.service_options) return 'service-options';
    return 'hero-content';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [overview, setOverview] = useState<Overview | null>(null);
  const [heroScenes, setHeroScenes] = useState<HeroScene[]>([]);
  const [heroContent, setHeroContent] = useState<HeroContent[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Predefined gradient options
  const gradientOptions = [
    { class: 'from-orange-400 via-pink-500 to-purple-600', name: 'Sunset' },
    { class: 'from-amber-400 via-orange-500 to-red-600', name: 'Fire' },
    { class: 'from-blue-400 via-cyan-500 to-teal-600', name: 'Ocean' },
    { class: 'from-green-400 via-emerald-500 to-teal-600', name: 'Forest' },
    { class: 'from-emerald-400 via-green-500 to-lime-600', name: 'Nature' },
    { class: 'from-purple-400 via-pink-500 to-rose-600', name: 'Mystical' },
    { class: 'from-indigo-400 via-purple-500 to-pink-600', name: 'Galaxy' },
    { class: 'from-yellow-400 via-orange-500 to-red-600', name: 'Sunrise' },
  ];

  const iconOptions = [
    'MapPin', 'Plane', 'Building', 'Star', 'Shield', 'Passport', 
    'Calendar', 'Camera', 'Heart', 'Globe', 'Compass', 'Zap'
  ];

  useEffect(() => {
    fetchOverview();
  }, []);

  useEffect(() => {
    if (activeTab === 'hero-scenes') fetchHeroScenes();
    else if (activeTab === 'hero-content') fetchHeroContent();
    else if (activeTab === 'contact-info') fetchContactInfo();
    else if (activeTab === 'service-options') fetchServiceOptions();
  }, [activeTab]);

  const fetchOverview = async () => {
    try {
      const data = await siteManagementApi.getOverview();
      setOverview(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch overview data",
        variant: "destructive"
      });
    }
  };

  const fetchHeroScenes = async () => {
    setLoading(true);
    try {
      const data = await heroScenesApi.list({ order_by: 'order', order_direction: 'asc' });
      setHeroScenes(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch hero scenes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHeroContent = async () => {
    setLoading(true);
    try {
      const data = await heroContentApi.list();
      setHeroContent(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch hero content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchContactInfo = async () => {
    setLoading(true);
    try {
      const data = await contactInfoApi.list();
      setContactInfo(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch contact info",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceOptions = async () => {
    setLoading(true);
    try {
      const data = await serviceOptionsApi.list({ order_by: 'order', order_direction: 'asc' });
      setServiceOptions(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch service options",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let apiCall;
      const isEditing = editingItem;

      switch (activeTab) {
        case 'hero-scenes':
          apiCall = isEditing 
            ? heroScenesApi.update(editingItem.id, formData)
            : heroScenesApi.create(formData);
          break;
        case 'hero-content':
          apiCall = isEditing 
            ? heroContentApi.update(editingItem.id, formData)
            : heroContentApi.create(formData);
          break;
        case 'contact-info':
          apiCall = isEditing 
            ? contactInfoApi.update(editingItem.id, formData)
            : contactInfoApi.create(formData);
          break;
        case 'service-options':
          apiCall = isEditing 
            ? serviceOptionsApi.update(editingItem.id, formData)
            : serviceOptionsApi.create(formData);
          break;
        default:
          return;
      }

      await apiCall;
      
      toast({
        title: "Success",
        description: `${isEditing ? 'Updated' : 'Created'} successfully`,
      });

      setShowForm(false);
      setEditingItem(null);
      setFormData({});
      
      // Refresh data
      if (activeTab === 'hero-scenes') fetchHeroScenes();
      else if (activeTab === 'hero-content') fetchHeroContent();
      else if (activeTab === 'contact-info') fetchContactInfo();
      else if (activeTab === 'service-options') fetchServiceOptions();
      
      fetchOverview();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      let apiCall;
      switch (activeTab) {
        case 'hero-scenes':
          apiCall = heroScenesApi.delete(id);
          break;
        case 'hero-content':
          apiCall = heroContentApi.delete(id);
          break;
        case 'contact-info':
          apiCall = contactInfoApi.delete(id);
          break;
        case 'service-options':
          apiCall = serviceOptionsApi.delete(id);
          break;
        default:
          return;
      }

      await apiCall;
      
      toast({
        title: "Success",
        description: "Deleted successfully",
      });

      // Refresh data
      if (activeTab === 'hero-scenes') fetchHeroScenes();
      else if (activeTab === 'hero-content') fetchHeroContent();
      else if (activeTab === 'contact-info') fetchContactInfo();
      else if (activeTab === 'service-options') fetchServiceOptions();
      
      fetchOverview();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete",
        variant: "destructive"
      });
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    try {
      let currentList: any[] = [];
      let currentItem: any;

      if (activeTab === 'hero-scenes') {
        currentList = heroScenes;
        currentItem = heroScenes.find(item => item.id === id);
      } else if (activeTab === 'service-options') {
        currentList = serviceOptions;
        currentItem = serviceOptions.find(item => item.id === id);
      }

      const currentIndex = currentList.findIndex(item => item.id === id);
      const newOrder = direction === 'up' 
        ? Math.max(1, currentItem.order - 1)
        : currentItem.order + 1;

      if (activeTab === 'hero-scenes') {
        await heroScenesApi.reorder(id, newOrder);
        fetchHeroScenes();
      } else if (activeTab === 'service-options') {
        await serviceOptionsApi.reorder(id, newOrder);
        fetchServiceOptions();
      }

      toast({
        title: "Success",
        description: "Reordered successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const response = await uploadsApi.uploadImage(file);
      setFormData({ ...formData, image_url: response.url });
      
      // Show WebP conversion information
      const originalSize = uploadsApi.formatFileSize(response.original_size);
      const webpSize = uploadsApi.formatFileSize(response.size);
      const compression = response.compression_ratio;
      
      toast({
        title: "Success",
        description: `Hero scene image uploaded and converted to WebP successfully! 
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

  const openForm = (item?: any) => {
    setEditingItem(item);
    
    if (item) {
      setFormData({ ...item });
    } else {
      // Set default values based on tab
      if (activeTab === 'hero-scenes') {
        setFormData({
          name: '',
          name_bn: '',
          image_url: '',
          gradient_class: gradientOptions[0].class,
          order: heroScenes.length + 1,
          is_active: true
        });
      } else if (activeTab === 'hero-content') {
        setFormData({
          headline_en: '',
          headline_bn: '',
          subtitle_en: '',
          subtitle_bn: '',
          cta_text_en: '',
          cta_text_bn: '',
          cta_link: '',
          is_active: true
        });
      } else if (activeTab === 'contact-info') {
        setFormData({
          company_name: '',
          company_name_bn: '',
          tagline_en: '',
          tagline_bn: '',
          address_en: '',
          address_bn: '',
          phone: '',
          phone_display_bn: '',
          email: '',
          working_hours_en: '',
          working_hours_bn: '',
          facebook_url: '',
          twitter_url: '',
          instagram_url: '',
          youtube_url: '',
          latitude: null,
          longitude: null,
          is_active: true
        });
      } else if (activeTab === 'service-options') {
        setFormData({
          name_en: '',
          name_bn: '',
          description_en: '',
          description_bn: '',
          icon: iconOptions[0],
          order: serviceOptions.length + 1,
          is_active: true
        });
      }
    }
    
    setShowForm(true);
  };



  const renderHeroScenes = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Hero Scenes</h3>
          <p className="text-gray-600">Manage the background scenes for your hero section</p>
        </div>
        <Button onClick={() => openForm()} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Scene
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {heroScenes.map((scene, index) => (
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-xl overflow-hidden">
                <div className={`h-40 bg-gradient-to-br ${scene.gradient_class} relative`}>
                  <img 
                    src={scene.image_url} 
                    alt={scene.name}
                    className="w-full h-full object-cover mix-blend-overlay opacity-70"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge variant={scene.is_active ? "default" : "secondary"} className="bg-white/20 text-white">
                      {scene.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </Badge>
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                      #{scene.order}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <h4 className="text-white font-semibold text-lg drop-shadow-lg">{scene.name}</h4>
                    {scene.name_bn && (
                      <p className="text-white/90 text-sm drop-shadow-lg">{scene.name_bn}</p>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleReorder(scene.id, 'up')} disabled={index === 0}>
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleReorder(scene.id, 'down')} disabled={index === heroScenes.length - 1}>
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openForm(scene)}>
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(scene.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Created: {new Date(scene.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderHeroContent = () => {
    const currentContent = heroContent.find(content => content.is_active) || heroContent[0];
    
    return (
      <div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Hero Content</h3>
          <p className="text-gray-600">Edit the headlines and calls-to-action for your hero section</p>
        </div>

        {currentContent ? (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Hero Content</span>
                <Button onClick={() => openForm(currentContent)} className="bg-blue-600 hover:bg-blue-700">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Content
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Headline (English)</Label>
                  <p className="text-gray-900 font-semibold">{currentContent.headline_en}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Headline (Bengali)</Label>
                  <p className="text-gray-900 font-semibold">{currentContent.headline_bn}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Subtitle (English)</Label>
                  <p className="text-gray-600">{currentContent.subtitle_en}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Subtitle (Bengali)</Label>
                  <p className="text-gray-600">{currentContent.subtitle_bn}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">CTA Text (English)</Label>
                  <p className="text-gray-900">{currentContent.cta_text_en}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">CTA Text (Bengali)</Label>
                  <p className="text-gray-900">{currentContent.cta_text_bn}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">CTA Link</Label>
                <p className="text-blue-600 underline">
                  <a href={currentContent.cta_link} target="_blank" rel="noopener noreferrer">
                    {currentContent.cta_link}
                  </a>
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  Updated: {new Date(currentContent.updated_at).toLocaleDateString()}
                </div>
                <Badge variant={currentContent.is_active ? "default" : "secondary"}>
                  {currentContent.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">No hero content found. Create your first hero content.</p>
              <Button onClick={() => openForm()} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Hero Content
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderContactInfo = () => {
    const currentInfo = contactInfo.find(info => info.is_active) || contactInfo[0];
    
    return (
      <div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Contact Information</h3>
          <p className="text-gray-600">Edit your company's contact details</p>
        </div>

        {currentInfo ? (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Company Contact Information</span>
                <Button onClick={() => openForm(currentInfo)} className="bg-green-600 hover:bg-green-700">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Contact Info
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Company Name (English)</Label>
                  <p className="text-gray-900 font-semibold">{currentInfo.company_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Company Name (Bengali)</Label>
                  <p className="text-gray-900 font-semibold">{currentInfo.company_name_bn}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Tagline (English)</Label>
                  <p className="text-gray-600">{currentInfo.tagline_en}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Tagline (Bengali)</Label>
                  <p className="text-gray-600">{currentInfo.tagline_bn}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Address (English)</Label>
                  <p className="text-gray-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    {currentInfo.address_en}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Address (Bengali)</Label>
                  <p className="text-gray-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    {currentInfo.address_bn}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Phone</Label>
                  <p className="text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {currentInfo.phone}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Phone (Bengali Display)</Label>
                  <p className="text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {currentInfo.phone_display_bn || 'Not set'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <p className="text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    {currentInfo.email}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Working Hours (English)</Label>
                  <p className="text-gray-900 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    {currentInfo.working_hours_en}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Working Hours (Bengali)</Label>
                  <p className="text-gray-900 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    {currentInfo.working_hours_bn}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Social Media Links</Label>
                  <div className="flex gap-2">
                    {currentInfo.social_links?.facebook && (
                      <a href={currentInfo.social_links.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                        <Facebook className="w-4 h-4" />
                      </a>
                    )}
                    {currentInfo.social_links?.twitter && (
                      <a
                        href={(() => {
                          const v = String(currentInfo.social_links.twitter || '').trim();
                          if (!v) return '#';
                          const isLink = v.startsWith('http://') || v.startsWith('https://');
                          const digits = v.replace(/[^0-9]/g, '');
                          return isLink ? v : (digits ? `https://wa.me/${digits}` : '#');
                        })()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                    {currentInfo.social_links?.instagram && (
                      <a href={currentInfo.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600">
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {currentInfo.social_links?.youtube && (
                      <a href={currentInfo.social_links.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600">
                        <Youtube className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  Updated: {new Date(currentInfo.updated_at).toLocaleDateString()}
                </div>
                <Badge variant={currentInfo.is_active ? "default" : "secondary"}>
                  {currentInfo.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">No contact information found. Create your company contact details.</p>
              <Button onClick={() => openForm()} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Contact Info
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderServiceOptions = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Service Options</h3>
          <p className="text-gray-600">Manage the services displayed in contact forms</p>
        </div>
        <Button onClick={() => openForm()} className="bg-orange-600 hover:bg-orange-700">
          <Star className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {serviceOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-800">{option.name_en}</h4>
                    <Badge variant={option.is_active ? "default" : "secondary"} className="bg-white/20 text-white">
                      {option.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-600 mb-2">{option.description_en}</p>
                  <div className="flex items-center mt-4 text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    Updated: {new Date(option.updated_at).toLocaleDateString()}
                  </div>
                </CardContent>
                <CardHeader className="p-4 pt-0 border-t">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                      #{index + 1}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openForm(option)}>
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(option.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderForm = () => {
    if (!showForm) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {editingItem ? 'Edit' : 'Add'} {activeTab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {activeTab === 'hero-scenes' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Scene Name (English)</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Paris"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name_bn">Scene Name (Bengali)</Label>
                    <Input
                      id="name_bn"
                      value={formData.name_bn || ''}
                      onChange={(e) => setFormData({...formData, name_bn: e.target.value})}
                      placeholder="প্যারিস"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="image_url">Hero Scene Image</Label>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-600">Image URL</Label>
                      <Input
                        id="image_url"
                        value={formData.image_url || ''}
                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                        placeholder="https://example.com/hero-scene.jpg"
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
                    {formData.image_url && (
                      <div className="mt-2">
                        <Label className="text-sm text-gray-600">Preview</Label>
                        <div className="mt-1 p-2 border rounded-md">
                          <img
                            src={formData.image_url}
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
                
                <div>
                  <Label htmlFor="gradient_class">Gradient Style</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {gradientOptions.map((gradient) => (
                      <div
                        key={gradient.class}
                        className={`h-12 rounded-md bg-gradient-to-r ${gradient.class} cursor-pointer border-2 ${
                          formData.gradient_class === gradient.class ? 'border-blue-500' : 'border-transparent'
                        }`}
                        onClick={() => setFormData({...formData, gradient_class: gradient.class})}
                        title={gradient.name}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="order">Order</Label>
                    <Input
                      type="number"
                      id="order"
                      value={formData.order || 0}
                      onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="is_active"
                      checked={formData.is_active || false}
                      onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'hero-content' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="headline_en">Headline (English)</Label>
                    <Input
                      id="headline_en"
                      value={formData.headline_en || ''}
                      onChange={(e) => setFormData({...formData, headline_en: e.target.value})}
                      placeholder="Your trusted travel partner for unforgettable journeys"
                    />
                  </div>
                  <div>
                    <Label htmlFor="headline_bn">Headline (Bengali)</Label>
                    <Input
                      id="headline_bn"
                      value={formData.headline_bn || ''}
                      onChange={(e) => setFormData({...formData, headline_bn: e.target.value})}
                      placeholder="অবিস্মরণীয় যাত্রার জন্য আপনার বিশ্বস্ত ভ্রমণ সঙ্গী"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subtitle_en">Subtitle (English)</Label>
                    <Input
                      id="subtitle_en"
                      value={formData.subtitle_en || ''}
                      onChange={(e) => setFormData({...formData, subtitle_en: e.target.value})}
                      placeholder="Discover the world with us"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitle_bn">Subtitle (Bengali)</Label>
                    <Input
                      id="subtitle_bn"
                      value={formData.subtitle_bn || ''}
                      onChange={(e) => setFormData({...formData, subtitle_bn: e.target.value})}
                      placeholder="আমাদের সাথে বিশ্বকে অনুভব করুন"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cta_text_en">CTA Text (English)</Label>
                    <Input
                      id="cta_text_en"
                      value={formData.cta_text_en || ''}
                      onChange={(e) => setFormData({...formData, cta_text_en: e.target.value})}
                      placeholder="Book Now"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cta_text_bn">CTA Text (Bengali)</Label>
                    <Input
                      id="cta_text_bn"
                      value={formData.cta_text_bn || ''}
                      onChange={(e) => setFormData({...formData, cta_text_bn: e.target.value})}
                      placeholder="এখন বুক করুন"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="cta_link">CTA Link</Label>
                  <Input
                    id="cta_link"
                    value={formData.cta_link || '#'}
                    onChange={(e) => setFormData({...formData, cta_link: e.target.value})}
                    placeholder="https://example.com/book"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="order">Order</Label>
                    <Input
                      type="number"
                      id="order"
                      value={formData.order || 0}
                      onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="is_active"
                      checked={formData.is_active || false}
                      onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'contact-info' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name">Company Name (English)</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name || ''}
                      onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                      placeholder="ARO Travels"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_name_bn">Company Name (Bengali)</Label>
                    <Input
                      id="company_name_bn"
                      value={formData.company_name_bn || ''}
                      onChange={(e) => setFormData({...formData, company_name_bn: e.target.value})}
                      placeholder="এআরও ট্রাভেলস"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tagline_en">Tagline (English)</Label>
                    <Input
                      id="tagline_en"
                      value={formData.tagline_en || ''}
                      onChange={(e) => setFormData({...formData, tagline_en: e.target.value})}
                      placeholder="Your trusted travel partner for unforgettable journeys"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagline_bn">Tagline (Bengali)</Label>
                    <Input
                      id="tagline_bn"
                      value={formData.tagline_bn || ''}
                      onChange={(e) => setFormData({...formData, tagline_bn: e.target.value})}
                      placeholder="অবিস্মরণীয় যাত্রার জন্য আপনার বিশ্বস্ত ভ্রমণ সঙ্গী"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address_en">Address (English)</Label>
                    <Input
                      id="address_en"
                      value={formData.address_en || ''}
                      onChange={(e) => setFormData({...formData, address_en: e.target.value})}
                      placeholder="123 Main St, City, Country"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address_bn">Address (Bengali)</Label>
                    <Input
                      id="address_bn"
                      value={formData.address_bn || ''}
                      onChange={(e) => setFormData({...formData, address_bn: e.target.value})}
                      placeholder="১২৩ মেইন স্ট্রেট, শহর, দেশ"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone_display_bn">Phone (Display Bengali)</Label>
                    <Input
                      id="phone_display_bn"
                      value={formData.phone_display_bn || ''}
                      onChange={(e) => setFormData({...formData, phone_display_bn: e.target.value})}
                      placeholder="০১৭১২৩৪৫৬৭৮৯"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="info@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="working_hours_en">Working Hours (English)</Label>
                    <Input
                      id="working_hours_en"
                      value={formData.working_hours_en || ''}
                      onChange={(e) => setFormData({...formData, working_hours_en: e.target.value})}
                      placeholder="Mon - Sat: 9:00 AM - 8:00 PM"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="working_hours_bn">Working Hours (Bengali)</Label>
                    <Input
                      id="working_hours_bn"
                      value={formData.working_hours_bn || ''}
                      onChange={(e) => setFormData({...formData, working_hours_bn: e.target.value})}
                      placeholder="সোম - শনি: সকাল ৯:০০ - রাত ৮:০০"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="is_active"
                      checked={formData.is_active || false}
                      onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-lg font-medium mb-4">Social Media Links</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="facebook">Facebook URL</Label>
                      <Input
                        id="facebook"
                        value={formData.social_links?.facebook || ''}
                        onChange={(e) => setFormData({
                          ...formData, 
                          social_links: {
                            ...formData.social_links,
                            facebook: e.target.value
                          }
                        })}
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter URL</Label>
                      <Input
                        id="twitter"
                        value={formData.social_links?.twitter || ''}
                        onChange={(e) => setFormData({
                          ...formData, 
                          social_links: {
                            ...formData.social_links,
                            twitter: e.target.value
                          }
                        })}
                        placeholder="https://twitter.com/yourprofile"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="instagram">Instagram URL</Label>
                      <Input
                        id="instagram"
                        value={formData.social_links?.instagram || ''}
                        onChange={(e) => setFormData({
                          ...formData, 
                          social_links: {
                            ...formData.social_links,
                            instagram: e.target.value
                          }
                        })}
                        placeholder="https://instagram.com/yourprofile"
                      />
                    </div>
                    <div>
                      <Label htmlFor="youtube">YouTube URL</Label>
                      <Input
                        id="youtube"
                        value={formData.social_links?.youtube || ''}
                        onChange={(e) => setFormData({
                          ...formData, 
                          social_links: {
                            ...formData.social_links,
                            youtube: e.target.value
                          }
                        })}
                        placeholder="https://youtube.com/yourchannel"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="linkedin">LinkedIn URL</Label>
                      <Input
                        id="linkedin"
                        value={formData.social_links?.linkedin || ''}
                        onChange={(e) => setFormData({
                          ...formData, 
                          social_links: {
                            ...formData.social_links,
                            linkedin: e.target.value
                          }
                        })}
                        placeholder="https://linkedin.com/company/yourcompany"
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsapp">WhatsApp Number or Link</Label>
                      <Input
                        id="whatsapp"
                        value={formData.social_links?.whatsapp || ''}
                        onChange={(e) => setFormData({
                          ...formData, 
                          social_links: {
                            ...formData.social_links,
                            whatsapp: e.target.value
                          }
                        })}
                        placeholder="+88017... or https://wa.me/88017..."
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'service-options' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name_en">Service Name (English)</Label>
                    <Input
                      id="name_en"
                      value={formData.name_en || ''}
                      onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                      placeholder="Tour Booking"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name_bn">Service Name (Bengali)</Label>
                    <Input
                      id="name_bn"
                      value={formData.name_bn || ''}
                      onChange={(e) => setFormData({...formData, name_bn: e.target.value})}
                      placeholder="টুর বুকিং"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="description_en">Description (English)</Label>
                    <Textarea
                      id="description_en"
                      value={formData.description_en || ''}
                      onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                      placeholder="Book your dream tour with us"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description_bn">Description (Bengali)</Label>
                    <Textarea
                      id="description_bn"
                      value={formData.description_bn || ''}
                      onChange={(e) => setFormData({...formData, description_bn: e.target.value})}
                      placeholder="আমাদের সাথে আপনার আবাদ্য টুর বুকিং করুন"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="icon">Icon</Label>
                    <Input
                      id="icon"
                      value={formData.icon || ''}
                      onChange={(e) => setFormData({...formData, icon: e.target.value})}
                      placeholder="MapPin, Plane, Building, Star, Shield, Passport, Calendar, Camera, Heart, Globe, Compass, Zap"
                    />
                  </div>
                  <div>
                    <Label htmlFor="order">Order</Label>
                    <Input
                      type="number"
                      id="order"
                      value={formData.order || 0}
                      onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="is_active"
                    checked={formData.is_active || false}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </>
            )}
          </div>
          
          <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Site Management</h1>
          <p className="text-gray-600">Control your website's content and appearance</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid w-full bg-white shadow-lg rounded-xl p-1 ${
          Object.values(projectConfig.features).filter(Boolean).length === 1 ? 'grid-cols-1' :
          Object.values(projectConfig.features).filter(Boolean).length === 2 ? 'grid-cols-2' :
          Object.values(projectConfig.features).filter(Boolean).length === 3 ? 'grid-cols-3' :
          'grid-cols-4'
        }`}>
          {projectConfig.features.hero_scenes && (
            <TabsTrigger value="hero-scenes" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Image className="w-4 h-4 mr-2" />
              Hero Scenes
            </TabsTrigger>
          )}
          {projectConfig.features.hero_content && (
            <TabsTrigger value="hero-content" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Edit2 className="w-4 h-4 mr-2" />
              Hero Content
            </TabsTrigger>
          )}
          {projectConfig.features.contact_info && (
            <TabsTrigger value="contact-info" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Phone className="w-4 h-4 mr-2" />
              Contact Info
            </TabsTrigger>
          )}
          {projectConfig.features.service_options && (
            <TabsTrigger value="service-options" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Star className="w-4 h-4 mr-2" />
              Services
            </TabsTrigger>
          )}
        </TabsList>

        <AnimatePresence mode="wait">
          {projectConfig.features.hero_scenes && (
            <TabsContent value="hero-scenes" className="space-y-6">
              {renderHeroScenes()}
            </TabsContent>
          )}
          
          {projectConfig.features.hero_content && (
            <TabsContent value="hero-content" className="space-y-6">
              {renderHeroContent()}
            </TabsContent>
          )}
          
          {projectConfig.features.contact_info && (
            <TabsContent value="contact-info" className="space-y-6">
              {renderContactInfo()}
            </TabsContent>
          )}
          
          {projectConfig.features.service_options && (
            <TabsContent value="service-options" className="space-y-6">
              {renderServiceOptions()}
            </TabsContent>
          )}
        </AnimatePresence>
      </Tabs>

      {/* Form Modal */}
      <AnimatePresence>
        {renderForm()}
      </AnimatePresence>
    </div>
  );
};

export default SiteManagementModule; 