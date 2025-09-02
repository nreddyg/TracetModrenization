
import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAppSelector } from '@/store/reduxStore';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Home, MapPin, User, Settings, LogOut, Bell, ChevronDown, Building2, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const FixedHeader: React.FC = () => {
  const breadcrumbs = useAppSelector(state => state.ui.currentBreadcrumb);
  const [selectedLocation, setSelectedLocation] = useState('Mumbai Office');
  const [selectedCompany, setSelectedCompany] = useState('Tracet Technologies');

  const companyOptions = [
    { value: 'Tracet Technologies', label: 'Tracet Technologies' },
    { value: 'Tracet Solutions', label: 'Tracet Solutions' },
    { value: 'Tracet Consulting', label: 'Tracet Consulting' },
    { value: 'Tracet Innovations', label: 'Tracet Innovations' }
  ];

  const locationOptions = [
    { value: 'Mumbai Office', label: 'Mumbai Office' },
    { value: 'Delhi Office', label: 'Delhi Office' },
    { value: 'Bangalore Office', label: 'Bangalore Office' },
    { value: 'Chennai Office', label: 'Chennai Office' },
    { value: 'Hyderabad Office', label: 'Hyderabad Office' }
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoutFunction = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between gap-2 px-4 lg:px-6 py-3">
        {/* Left Section - Sidebar Trigger + Company Logo + Breadcrumbs */}
        <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
          <SidebarTrigger />
          
          {/* Company Branding */}
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            <div className="flex items-center gap-2 px-2 lg:px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-white rounded flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xs lg:text-sm">T</span>
              </div>
              <span className="hidden sm:block text-white font-semibold text-xs lg:text-sm">Tracet</span>
            </div>
            <div className="hidden md:block h-6 w-px bg-gray-300"></div>
          </div>
          
          {/* Breadcrumbs - Hidden on mobile */}
          <div className="hidden lg:block flex-1 min-w-0">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                      <Home className="h-3 w-3 lg:h-4 lg:w-4" />
                      <span className="text-xs lg:text-sm">Dashboard</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                
                {breadcrumbs.map((breadcrumb, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {breadcrumb.href ? (
                        <BreadcrumbLink asChild>
                          <Link to={breadcrumb.href} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                            {breadcrumb.icon}
                            <span className="text-xs lg:text-sm">{breadcrumb.label}</span>
                          </Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="flex items-center gap-1">
                          {breadcrumb.icon}
                          <span className="text-xs lg:text-sm">{breadcrumb.label}</span>
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Right Section - Company + Location + Notifications + Profile */}
        <div className="flex items-center gap-1 lg:gap-3 shrink-0">
          {/* Mobile Menu Trigger */}
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <ReusableDropdown
                    label="Company"
                    options={companyOptions}
                    value={selectedCompany}
                    onChange={(value) => setSelectedCompany(value as string)}
                    placeholder="Select company"
                    size="middle"
                  />
                  
                  <ReusableDropdown
                    label="Location"
                    options={locationOptions}
                    value={selectedLocation}
                    onChange={(value) => setSelectedLocation(value as string)}
                    placeholder="Select location"
                    size="middle"
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Dropdowns */}
          <div className="hidden lg:flex items-center gap-3">
            <ReusableDropdown
              options={companyOptions}
              value={selectedCompany}
              onChange={(value) => setSelectedCompany(value as string)}
              placeholder="Select company"
              size="small"
              className="min-w-[120px]"
            />
            
            <ReusableDropdown
              options={locationOptions}
              value={selectedLocation}
              onChange={(value) => setSelectedLocation(value as string)}
              placeholder="Select location"
              size="small"
              className="min-w-[120px]"
            />
          </div>

          {/* Notifications */}
          <Button variant="outline" size="sm" className="relative h-8 w-8 lg:h-9 lg:w-9 p-0">
            <Bell className="h-3 w-3 lg:h-4 lg:w-4" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 lg:h-5 lg:w-5 text-xs p-0 flex items-center justify-center">
              3
            </Badge>
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 lg:h-9 lg:w-9 rounded-full p-0">
                <Avatar className="h-8 w-8 lg:h-9 lg:w-9">
                  <AvatarImage src="/avatars/01.png" alt="Profile" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xs lg:text-sm">
                    JD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    john.doe@tracet.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600" onClick={logoutFunction}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Breadcrumbs */}
      <div className="lg:hidden px-4 pb-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <Home className="h-3 w-3" />
                  <span className="text-xs">Dashboard</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            {breadcrumbs.slice(-2).map((breadcrumb, index) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {breadcrumb.href ? (
                    <BreadcrumbLink asChild>
                      <Link to={breadcrumb.href} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        {breadcrumb.icon}
                        <span className="text-xs truncate max-w-24">{breadcrumb.label}</span>
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="flex items-center gap-1">
                      {breadcrumb.icon}
                      <span className="text-xs truncate max-w-24">{breadcrumb.label}</span>
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default FixedHeader;
