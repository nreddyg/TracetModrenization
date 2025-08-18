import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Ticket, 
  Plus, 
  BarChart3, 
  Building2, 
  Package, 
  TrendingUp, 
  AlertTriangle,
  Users,
  DollarSign,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Activity,
  Headphones,
  Settings,
  Bell
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Enterprise Dashboard
                </h1>
                <p className="text-sm text-gray-500">Welcome back, John Doe</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              <Badge variant="destructive" className="ml-2">3</Badge>
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Quick Settings
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer hover:shadow-xl transition-shadow" onClick={() => window.location.href = '/tickets/dashboard'}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Active Tickets</CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">247</span>
                  <Ticket className="h-8 w-8 opacity-80" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <ArrowUp className="h-4 w-4" />
                  <span>+12% from last week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Resolved Today</CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">34</span>
                  <CheckCircle className="h-8 w-8 opacity-80" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <ArrowUp className="h-4 w-4" />
                  <span>+8% efficiency</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">SLA Violations</CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">7</span>
                  <AlertTriangle className="h-8 w-8 opacity-80" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <ArrowDown className="h-4 w-4" />
                  <span>-15% from yesterday</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Assets Tracked</CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">1,247</span>
                  <Package className="h-8 w-8 opacity-80" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>System healthy</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>Streamline your workflow with one-click actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/tickets/dashboard">
                  <Button className="w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                    <div className="flex flex-col items-center gap-1">
                      <BarChart3 className="h-5 w-5" />
                      <span className="text-sm">Tickets Dashboard</span>
                    </div>
                  </Button>
                </Link>
                
                <Link to="/tickets/create">
                  <Button variant="outline" className="w-full h-16 border-2 hover:bg-blue-50 shadow-md">
                    <div className="flex flex-col items-center gap-1">
                      <Plus className="h-5 w-5 text-blue-600" />
                      <span className="text-sm">New Ticket</span>
                    </div>
                  </Button>
                </Link>
                
                <Link to="/timesheet">
                  <Button variant="outline" className="w-full h-16 border-2 hover:bg-blue-50 shadow-md">
                    <div className="flex flex-col items-center gap-1">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="text-sm">Log Time</span>
                    </div>
                  </Button>
                </Link>
                
                <Link to="/service-desk/new-request">
                  <Button variant="outline" className="w-full h-16 border-2 hover:bg-emerald-50 shadow-md">
                    <div className="flex flex-col items-center gap-1">
                      <Headphones className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm">Service Request</span>
                    </div>
                  </Button>
                </Link>
                
                <Link to="/fixed-assets/asset-management">
                  <Button variant="outline" className="w-full h-16 border-2 hover:bg-purple-50 shadow-md">
                    <div className="flex flex-col items-center gap-1">
                      <Package className="h-5 w-5 text-purple-600" />
                      <span className="text-sm">Manage Assets</span>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    System Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Ticket Resolution Rate</span>
                        <span className="text-sm font-semibold text-emerald-600">94.2%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full" style={{width: '94.2%'}}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">System Uptime</span>
                        <span className="text-sm font-semibold text-blue-600">99.8%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '99.8%'}}></div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">User Satisfaction</span>
                        <span className="text-sm font-semibold text-purple-600">4.7/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{width: '94%'}}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Asset Utilization</span>
                        <span className="text-sm font-semibold text-orange-600">87.3%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full" style={{width: '87.3%'}}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Module Access */}
            <div>
              <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Enterprise Modules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/service-desk" className="block">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Headphones className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Service Desk</span>
                      </div>
                      <Badge variant="secondary">247</Badge>
                    </div>
                  </Link>
                  
                  <Link to="/masters/organization" className="block">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-emerald-50 transition-colors border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium">Organization</span>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </Link>
                  
                  <Link to="/fixed-assets" className="block">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-purple-50 transition-colors border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">Asset Management</span>
                      </div>
                      <Badge variant="outline">1.2K</Badge>
                    </div>
                  </Link>
                  
                  <Link to="/procurement" className="block">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-orange-50 transition-colors border border-gray-100">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">Procurement</span>
                      </div>
                      <Badge variant="outline">New</Badge>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer Stats */}
          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">8.5h</div>
                  <div className="text-sm text-gray-600">Hours Today</div>
                  <div className="text-xs text-emerald-600">+0.5h from avg</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-sm text-gray-600">Open Tickets</div>
                  <div className="text-xs text-orange-600">3 high priority</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-emerald-600">1,247</div>
                  <div className="text-sm text-gray-600">Total Assets</div>
                  <div className="text-xs text-blue-600">5 pending verification</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-600">$47.2K</div>
                  <div className="text-sm text-gray-600">Monthly Savings</div>
                  <div className="text-xs text-emerald-600">+12% from target</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;