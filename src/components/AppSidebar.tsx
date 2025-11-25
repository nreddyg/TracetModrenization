import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarGroup, SidebarGroupContent, useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Headphones, Settings, Building2, Package, ChevronRight, ChevronDown, Search, Eye, Home, } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RxDotFilled } from 'react-icons/rx';

interface NavItem {
  label: string;
  icon?: React.ComponentType<any>;
  link: string;
  children?: NavItem[];
}


type MyComponentProps = {
  navigation: NavItem[];
};
const alwaysOpendata=["Masters","Dashboard"]

const AppSidebar: React.FC<MyComponentProps> = ({navigation}) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const isActive = (link: string) => location.pathname.includes(link);

  const isItemOrDescendantActive = (item: NavItem): boolean => {
    if (isActive(item.link)) return true;
    if (!item.children) return false;
    return item.children.some(child => isItemOrDescendantActive(child));
  };

  const isChildOrHasActiveGrandchild = (child: NavItem) =>
    isActive(child.link) || !!child.children?.some(gc => isActive(gc.link));

  const isParentOrHasActiveDescendant = (item: NavItem) =>
    isActive(item?.link) || !!item.children?.some(c => isChildOrHasActiveGrandchild(c));

  const toggleMenu = (label: string) =>
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));

  useEffect(() => {
    const newOpen: Record<string, boolean> = {};
    navigation.filter(f=>f).forEach(p => {
      if (isParentOrHasActiveDescendant(p)) {
        newOpen[p.label] = true;
        p.children?.forEach(c => {
          if (isChildOrHasActiveGrandchild(c)) newOpen[c.label] = true;
        });
      }
    });
    setOpenMenus(newOpen);
  }, [location]);

  const filteredNavigation = React.useMemo(() => {
    if (!searchTerm) return navigation;
    const q = searchTerm.toLowerCase();
    return navigation
      .filter(item =>
        item.label.toLowerCase().includes(q) ||
        item.children?.some(
          c =>
            c.label.toLowerCase().includes(q) ||
            c.children?.some(gc => gc.label.toLowerCase().includes(q))
        )
      )
      .map(item => ({
        ...item,
        children: item.children
          ?.filter(
            c =>
              c.label.toLowerCase().includes(q) ||
              c.children?.some(gc => gc.label.toLowerCase().includes(q))
          )
          .map(c => ({
            ...c,
            children: c.children?.filter(gc => gc.label.toLowerCase().includes(q)),
          })),
      }));
  }, [searchTerm]);

  const hasAnyOpenDescendant = (item: NavItem): boolean => {
    if (!item.children) return false;
    for (const c of item.children) {
      if (openMenus[c.label]) return true;
      if (c.children && hasAnyOpenDescendant(c)) return true;
    }
    return false;
  };

  const renderGrandChild = (grandChild: NavItem) => {
    const isGrandchildActive = isActive(grandChild.link);
    const highlight = isGrandchildActive || hoveredLabel === grandChild.label;

    return (
      <SidebarMenuSubItem
        key={grandChild.label}
        onMouseEnter={() => setHoveredLabel(grandChild.label)}
        onMouseLeave={() => setHoveredLabel(null)}
      >
        <SidebarMenuSubButton asChild isActive={isGrandchildActive} >
          {/* <Link
            to={grandChild.link}
            className={cn(
              "flex items-center space-x-2 transition-colors duration-200 my-1",
              highlight ? "text-white" : "text-[#a4bbdc]"
            )}
          >
            {grandChild.icon ? (
              // <grandChild.icon
              //   className={cn(
              //     "h-3 w-3 transition-colors duration-200",
              //     highlight ? "text-white" : "text-[#a4bbdc]"
              //   )}
              // />
              <Eye className='text-black' style={{color:'red'}}
              // className={cn(
                  // "h-3 w-3 transition-colors duration-200",
                  // highlight ? "text-white" : "text-[#a4bbdc]"
                // )}
                />
            ) : (
              <pre />
            )}
            <span
              className={cn(
                "truncate transition-colors duration-200",
                highlight ? "text-white [font-weight:350]" : "text-[#a4bbdc]"
              )}
              title={grandChild.label}
            >
              {grandChild.label}
            </span>
          </Link> */}
          <Link
            to={`/layout/${grandChild.link}`}
            className={cn(
              "flex items-center space-x-2 transition-colors  my-[2px]",
              highlight ? "text-white" : "text-[#a4bbdc]"
            )}
          >
            {grandChild.icon ? (
              <grandChild.icon 
                className={cn(
                  "h-3 w-3 transition-colors duration-20",
                  highlight ? "text-white" : "!text-[#a4bbdc]"
                )}
              />
            ) : (
              <pre />
            )}
            <span
              className={cn(
                "truncate transition-colors duration-200",
                highlight ? "text-white " : "text-[#a4bbdc]"
              )}
              title={grandChild.label}
            >
              {grandChild.label}
            </span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  };

  const renderChild = (child: NavItem) => {
    const isChildActive = isActive(child.link);
    const hasActive = isChildOrHasActiveGrandchild(child);
    const childOpen = openMenus[child.label] ?? false;
    const highlight = isChildActive || hasActive || childOpen || hoveredLabel === child.label;

    if (child.children && !collapsed) {
      return (
        <Collapsible
          key={child.label}
          className="w-full"
          open={childOpen}
          onOpenChange={() => toggleMenu(child.label)}
        >
          <SidebarMenuSubItem
            onMouseEnter={() => setHoveredLabel(child.label)}
            onMouseLeave={() => setHoveredLabel(null)}
          >
            <SidebarMenuSubButton asChild>
              <CollapsibleTrigger className="flex items-center justify-between w-full ps-2  transition-colors duration-200 rounded-md my-[2px]">
                <div className="flex items-center space-x-2" title={child.label}>
                  {child.icon? (
                  
                    <child.icon
                      className={cn(
                        "h-4 w-4 transition-colors duration-200",
                        highlight ? "text-white" : "text-[#a4bbdc]"
                      )}
                    />
                    
                  ) : (
                    <pre />
                  )}
                  <span
                    className={cn(
                      "truncate transition-colors duration-200",
                      highlight ? "text-white " : "text-[#a4bbdc]"
                    )}
                  >
                    {child.label}
                  </span>
                </div>
                {childOpen ? (
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform transition-colors duration-200",
                      highlight ? "text-white" : "!text-[#a4bbdc]"
                    )}
                  />
                ) : (
                  <ChevronRight
                    className={cn(
                      "h-3 w-3 transition-transform transition-colors duration-200",
                      highlight ? "text-white" : "!text-[#a4bbdc]"
                    )}
                  />
                )}
              </CollapsibleTrigger>
            </SidebarMenuSubButton>
            <CollapsibleContent>
              <SidebarMenuSub className="ml-0">
                {child.children.map(gc => renderGrandChild(gc))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuSubItem>
        </Collapsible>
      );
    }

    return (
      <SidebarMenuSubItem
        key={child.label}
        onMouseEnter={() => setHoveredLabel(child.label)}
        onMouseLeave={() => setHoveredLabel(null)}
      >
        <SidebarMenuSubButton asChild isActive={isChildActive} >
          <Link
            to={`/layout/${child.link}`}
            className={cn(
              "flex items-center space-x-0 transition-colors duration-200 my-[2px]",
              highlight ? "text-white" : "text-[#a4bbdc]"
            )}
            title={child.label}
          >
            {child.icon ? (
               <child.icon
                className={cn(
                  "h-3 w-3 transition-colors duration-200",
                  highlight ? "text-white" : "!text-[#a4bbdc]"
                )}
              />
            ) : (
              <pre />
            )}
            <span
              className={cn(
                "truncate transition-colors duration-200",
                highlight ? "text-white " : "text-[#a4bbdc]"
              )}
            >
              {child.label}
            </span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  };

  const renderMenuItem = (item: NavItem) => {
    const isParentActive = isParentOrHasActiveDescendant(item);
    const isParentOpen = openMenus[item.label] ?? false;

    const hasOpenDescendant = hasAnyOpenDescendant(item);

    const shouldHighlight =
      isParentActive || isParentOpen || hasOpenDescendant || hoveredLabel === item.label;
    if (item.children && !collapsed) {
      return (
        <Collapsible
          key={item.label}
          open={alwaysOpendata.includes(item.label)?true:isParentOpen}
          onOpenChange={() => toggleMenu(item.label)}
          className={cn("w-full",)}
        >
          <SidebarMenuItem
            onMouseEnter={() => setHoveredLabel(item.label)}
            onMouseLeave={() => setHoveredLabel(null)}
          >
            <SidebarMenuButton asChild tooltip={item.label} className={cn(alwaysOpendata.includes(item.label)&&'hover:bg-transparent hover:text-current ',)}>
              <CollapsibleTrigger className={cn("flex items-center justify-between w-full transition-colors duration-200 rounded-md my-[2px]")}>
                <div className="flex items-center space-x-2 " title={item.label}>
                  {!alwaysOpendata.includes(item.label) && (
                    <item.icon
                      className={cn(
                        "h-4 w-4 transition-colors duration-200",
                        shouldHighlight ? "text-white" : "text-[#a4bbdc]"
                      )}
                    />
                  )} 
                  {!collapsed && (
                    <span
                      className={cn(
                      "truncate max-w-[180px] transition-colors font-sans duration-200 uppercase text-xs font-semibold text-sidebar-foreground/60 ",alwaysOpendata.includes(item.label)?"":"",
                        shouldHighlight ? "text-white " : "text-[#a4bbdc]"
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </div>
                {(!alwaysOpendata.includes(item.label)) && (isParentOpen  ? (
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform transition-colors duration-200",
                      shouldHighlight ? "text-white" : "!text-[#a4bbdc]"
                    )}
                  />
                ) : (
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform transition-colors duration-200",
                      shouldHighlight ? "text-white" : "!text-[#a4bbdc]"
                    )}
                  />
                )
    )}
              </CollapsibleTrigger>
            </SidebarMenuButton>
            <CollapsibleContent>
              <SidebarMenuSub className={cn(alwaysOpendata.includes(item.label)?'m-0 p-0':"")}>{item.children.map(c => renderChild(c))}</SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    const isItemActive = isActive(item.link);
    const showHighlight = isItemActive || hoveredLabel === item.label;

    return (
      <SidebarMenuItem
        key={item.label}
        onMouseEnter={() => setHoveredLabel(item.label)}
        onMouseLeave={() => setHoveredLabel(null)}
      >
        <SidebarMenuButton asChild isActive={isItemActive}>
         {

             item.label !== "Dashboard"? <Link
            to={`/layout/${item.link}`}
            className={cn(
              "flex items-center space-x-1 transition-colors duration-200 rounded-md my-1",
              showHighlight ? "text-white" : "text-[#a4bbdc]"
            )}
          >
            <item.icon
              className={cn(
                "h-4 w-4 transition-colors duration-200",
                showHighlight ? "text-white" : "!text-[#a4bbdc]"
              )}
            />
            {!collapsed && (
              <span
                className={cn(
                  "truncate max-w-[180px] transition-colors duration-200",
                  showHighlight ? "text-white" : "text-[#a4bbdc]"
                )}
              >
                {item.label}
              </span>
            )}
          </Link>:<div 
           className={cn(
              "flex items-center space-x-1 transition-colors duration-200 rounded-md my-1",
              showHighlight ? "text-white" : "text-[#a4bbdc]"
            )}>
           <item.icon
              className={cn(
                "h-4 w-4 transition-colors duration-200",
                showHighlight ? "text-white" : "!text-[#a4bbdc]"
              )}
            />
            {!collapsed && (
              <span
                className={cn(
                  "truncate max-w-[180px] transition-colors duration-200",
                  showHighlight ? "text-white" : "text-[#a4bbdc]"
                )}
              >
                {item.label}
              </span>
            )}
          </div>
 
         }
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-[16px] h-16 shadow-[0_2px_8px_0_rgba(0,0,0,0.05)]">
        <div className={"flex items-center  space-x-2 pt-1"}>
          {!collapsed ?<div className='ps-1'> <img src="\tracet-logo.png" alt="T" className="w-100 h-6 " /></div> : <img src="\tarcet-t-logo.png" alt="T" className="w-10 h-6 " />}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className={cn(collapsed && "mt-2")}>      
          {filteredNavigation.map(item => renderMenuItem(item))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            {!collapsed && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a7aedd] h-4 w-4" />
                <Input
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 h-9 text-white bg-[#5d6bba] border-[#37469d] border-[1px] placeholder:text-[#a7aedd]"
                />
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
        {!collapsed && (
          <div className="text-xs text-[#a7aedd] text-center  pt-2">
            <div>&copy; {new Date().getFullYear()} Tracet Enterprise</div>
            <div className="text-[#a7aedd] [font-weight:350]">v2.0.1</div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;