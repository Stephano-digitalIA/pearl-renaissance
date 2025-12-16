import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users, Eye, Clock, MousePointer, ArrowLeft, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

// Simulated analytics data (replace with actual API call to your analytics service)
const mockAnalyticsData = {
  visitors: 2,
  pageviews: 78,
  viewsPerVisit: 39,
  visitDuration: '1h 49m 13s',
  bounceRate: '0%',
  chartData: [
    { date: '8 Dec', visitors: 0 },
    { date: '10 Dec', visitors: 0 },
    { date: '12 Dec', visitors: 0 },
    { date: '14 Dec', visitors: 2 },
  ],
  sources: [
    { name: 'Direct', visitors: 2 }
  ],
  pages: [
    { path: '/', visitors: 2 },
    { path: '/profile', visitors: 1 }
  ],
  countries: [
    { code: 'PF', name: 'Polynésie Française', visitors: 2 }
  ],
  devices: [
    { type: 'desktop', visitors: 2 }
  ]
};

const AdminAnalytics = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [analytics] = useState(mockAnalyticsData);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <Shield className="w-16 h-16 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-serif font-bold mb-2">Accès Refusé</h2>
            <p className="text-muted-foreground mb-6">
              Cette page est réservée aux administrateurs.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <h1 className="text-xl font-serif font-bold">Analytics Admin</h1>
          </div>
          <span className="text-sm text-muted-foreground">7 derniers jours</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-primary border-l-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-primary flex items-center gap-2">
                <Users className="w-4 h-4" />
                Visiteurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.visitors}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Pages vues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.pageviews}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">
                Vues/Visite
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.viewsPerVisit}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Durée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{analytics.visitDuration}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground flex items-center gap-2">
                <MousePointer className="w-4 h-4" />
                Rebond
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.bounceRate}</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Lists */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Source</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.sources.map((source, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex-1 bg-primary/20 rounded px-3 py-2">
                    <span className="text-sm">{source.name}</span>
                  </div>
                  <span className="ml-4 text-sm font-medium">{source.visitors}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.pages.map((page, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div 
                    className="bg-primary/20 rounded px-3 py-2"
                    style={{ width: `${(page.visitors / analytics.visitors) * 100}%`, minWidth: '60px' }}
                  >
                    <span className="text-sm">{page.path}</span>
                  </div>
                  <span className="ml-4 text-sm font-medium">{page.visitors}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Countries */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pays</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.countries.map((country, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex-1 bg-primary/20 rounded px-3 py-2">
                    <span className="text-sm">{country.name}</span>
                  </div>
                  <span className="ml-4 text-sm font-medium">{country.visitors}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Devices */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Appareils</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.devices.map((device, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex-1 bg-primary/20 rounded px-3 py-2">
                    <span className="text-sm capitalize">{device.type}</span>
                  </div>
                  <span className="ml-4 text-sm font-medium">{device.visitors}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
