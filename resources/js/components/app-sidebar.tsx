import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { CheckCheck, DockIcon, LayoutGrid, Link2, StepBackIcon, User, UserCheck } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Citoyens',
        href: '/citoyens',
        icon: User,
    },
    {
        title: 'Mariages',
        href: '/mariages',
        icon: UserCheck,
    },
    {
        title: 'Fonctionnaires',
        href: '/fonctionnaires',
        icon: UserCheck,
    },
    {
        title: 'Paiements',
        href: '/paiements',
        icon: CheckCheck,
    },
    {
        title: 'Document Mariages',
        href: '/documents-mariage',
        icon: DockIcon,
    },
   
    {
        title: 'Etapes Mariages',
        href: '/etapes-mariage',
        icon: StepBackIcon,
    },
    {
        title: 'Users',
        href: '/users',
        icon: User,
    },
];



export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
