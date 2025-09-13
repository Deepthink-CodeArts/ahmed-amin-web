import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Layout, Database, Zap } from 'lucide-react';

const Placeholder = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <Layout className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to DeepBase
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your rapid website development platform. Upload your view files and we'll build the backend and CMS in a snap.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Backend Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Complete FastAPI backend with admin management, authentication, and database models.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Layout className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>CMS Included</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Full-featured content management system with role-based access control.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Rapid Development</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Upload your designs and get a complete website with minimal LLM token usage.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="inline-block">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-4">Ready to get started?</h3>
              <p className="text-gray-600 mb-6">
                Access the admin panel to manage your content and configure your site.
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link to="/cms">
                  Open Admin Panel
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Placeholder;
