# Donor Announcements Implementation Plan

## Overview

This plan outlines the implementation of the Announcements feature for donors in the PCMC Pediatric Blood Center portal. Donors will be able to view announcements that are either:

-   **Public announcements** (visible to all donors)
-   **Agency-specific announcements** (visible only to donors of that specific agency)

## Current State Analysis

### Existing Infrastructure

-   ✅ Donor model has `agency_id` relationship with Agency
-   ✅ `fetchAnnouncements()` action already supports donor access (shows public + agency-specific)
-   ✅ Donor dashboard has good layout with metrics and event sections
-   ✅ Existing announcement components (ViewAnnouncementModal, etc.) can be reused
-   ✅ Role-based access control already implemented in announcement actions

### Current Donor Dashboard Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Metrics Cards (3)                        │
│  [Blood Type] [Successful Donations] [Next Eligible Date]   │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    Main Content Area                        │
│  ┌─────────────────────┐  ┌─────────────────────────────┐   │
│  │   Event Calendar    │  │    Blood Donation Drives    │   │
│  │   (2/3 width)       │  │    (1/3 width)              │   │
│  │                     │  │  • Ongoing Drives           │   │
│  │                     │  │  • Upcoming Drives          │   │
│  └─────────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Options

### Option 1: Dashboard Integration (Recommended)

**Add announcements as a new section in the existing dashboard**

**Pros:**

-   Keeps all important information in one place
-   Follows current dashboard pattern
-   Reduces navigation complexity
-   Better user experience for quick access

**Cons:**

-   Dashboard might become crowded
-   Limited space for detailed announcement content

### Option 2: Separate Announcements Page

**Create a dedicated announcements page with tab navigation**

**Pros:**

-   More space for detailed content
-   Better for users who want to browse all announcements
-   Cleaner separation of concerns

**Cons:**

-   Additional navigation step
-   Less discoverable
-   Requires additional routing setup

### Option 3: Hybrid Approach (Best Solution)

**Dashboard preview + dedicated page for full browsing**

**Pros:**

-   Best of both worlds
-   Dashboard shows recent/important announcements
-   Dedicated page for full browsing and search
-   Follows modern UX patterns (like Facebook feed)

**Cons:**

-   More complex implementation
-   Requires careful content curation

## Recommended Implementation: Hybrid Approach

### Phase 1: Dashboard Integration

#### 1.1 Create Donor Announcements Action

**File:** `app/action/donorAction.js`

```javascript
export async function getDonorAnnouncements(limit = 5) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    const { user } = session;
    const donor = await Donor.findOne({
        where: { user_id: user.id, status: "activated" },
    });

    if (!donor) {
        return {
            success: false,
            message: "Donor profile not found.",
        };
    }

    try {
        const announcements = await Announcement.findAll({
            where: {
                [Op.or]: [{ agency_id: donor.agency_id }, { is_public: true }],
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "first_name", "last_name", "full_name"],
                },
                {
                    model: Agency,
                    as: "agency",
                    attributes: ["id", "name", "file_url"],
                },
            ],
            order: [["createdAt", "DESC"]],
            limit: limit,
        });

        return { success: true, data: formatSeqObj(announcements) };
    } catch (error) {
        console.error(error);
        return { success: false, message: extractErrorMessage(error) };
    }
}
```

#### 1.2 Create Donor Announcement Card Component

**File:** `components/donors/announcements/AnnouncementCard.jsx`

```javascript
"use client";

import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { format } from "date-fns";
import { Eye, Calendar, Building, FileText } from "lucide-react";
import Image from "next/image";
import CustomAvatar from "@components/reusable_components/CustomAvatar";

export default function AnnouncementCard({ announcement, onView }) {
    const isPublic = announcement.is_public;
    const hasImage = announcement.file_url;

    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <CustomAvatar
                            avatar={
                                announcement.agency?.file_url ||
                                "/default_company_avatar.png"
                            }
                            className="w-10 h-10"
                        />
                        <div>
                            <h3 className="font-semibold text-lg line-clamp-2">
                                {announcement.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Building className="w-4 h-4" />
                                <span>
                                    {announcement.agency?.name || "System"}
                                </span>
                                {isPublic && (
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        Public
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>
                            {format(new Date(announcement.createdAt), "MMM dd")}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {hasImage && (
                    <div className="mb-3">
                        <Image
                            src={announcement.file_url}
                            alt={announcement.title}
                            width={300}
                            height={200}
                            className="w-full h-32 object-cover rounded-md"
                        />
                    </div>
                )}

                <div
                    className="text-sm text-gray-600 line-clamp-3 mb-3"
                    dangerouslySetInnerHTML={{ __html: announcement.body }}
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FileText className="w-3 h-3" />
                        <span>By {announcement.user?.full_name}</span>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onView(announcement.id)}
                        className="text-xs"
                    >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
```

#### 1.3 Create Donor Announcements Feed Component

**File:** `components/donors/announcements/AnnouncementsFeed.jsx`

```javascript
"use client";

import { useQuery } from "@tanstack/react-query";
import { getDonorAnnouncements } from "@/action/donorAction";
import AnnouncementCard from "./AnnouncementCard";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Bell, ArrowRight } from "lucide-react";
import Link from "next/link";
import Skeleton from "@components/ui/skeleton";

export default function AnnouncementsFeed({ onViewAnnouncement }) {
    const {
        data: announcements,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["donor-announcements"],
        queryFn: () => getDonorAnnouncements(3), // Show latest 3
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Recent Announcements
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Recent Announcements
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4 text-red-500">
                        Failed to load announcements
                    </div>
                </CardContent>
            </Card>
        );
    }

    const announcementsList = announcements?.success ? announcements.data : [];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Recent Announcements
                    </CardTitle>
                    <Link href="/portal/donors/announcements">
                        <Button variant="outline" size="sm">
                            View All
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {announcementsList.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No announcements yet</p>
                        <p className="text-sm">Check back later for updates</p>
                    </div>
                ) : (
                    announcementsList.map((announcement) => (
                        <AnnouncementCard
                            key={announcement.id}
                            announcement={announcement}
                            onView={onViewAnnouncement}
                        />
                    ))
                )}
            </CardContent>
        </Card>
    );
}
```

#### 1.4 Update Donor Dashboard Layout

**File:** `app/(pages)/portal/(role_based)/donors/Dashboard.jsx`

```javascript
// Add new imports
import AnnouncementsFeed from "@components/donors/announcements/AnnouncementsFeed";
import ViewAnnouncementModal from "@components/donors/announcements/ViewAnnouncementModal";

export default function Dashboard() {
    // Add state for announcement modal
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);

    const handleViewAnnouncement = (announcementId) => {
        setSelectedAnnouncementId(announcementId);
        setIsViewModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedAnnouncementId(null);
    };

    return (
        <div className="space-y-6">
            {/* Existing Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* ... existing metrics cards ... */}
            </div>

            {/* Updated Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Calendar - Reduced width */}
                <div className="lg:col-span-2">
                    <Card className="w-full h-full">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                Event Calendar
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AllEventCalendar />
                        </CardContent>
                    </Card>
                </div>

                {/* Announcements Feed - New section */}
                <div className="lg:col-span-1">
                    <AnnouncementsFeed
                        onViewAnnouncement={handleViewAnnouncement}
                    />
                </div>

                {/* Action Panel - Reduced width */}
                <div className="w-full">
                    <Card className="min-h-full">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                Blood Donation Drives
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* ... existing blood drives content ... */}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Announcement View Modal */}
            <ViewAnnouncementModal
                announcementId={selectedAnnouncementId}
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
            />
        </div>
    );
}
```

### Phase 2: Dedicated Announcements Page

#### 2.1 Create Donor Announcements Page

**File:** `app/(pages)/portal/(role_based)/donors/announcements/page.jsx`

```javascript
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Bell, Filter, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDonorAnnouncements } from "@/action/donorAction";
import AnnouncementCard from "@components/donors/announcements/AnnouncementCard";
import ViewAnnouncementModal from "@components/donors/announcements/ViewAnnouncementModal";
import { Input } from "@components/ui/input";
import { Badge } from "@components/ui/badge";
import Skeleton from "@components/ui/skeleton";

export default function DonorAnnouncementsPage() {
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all"); // all, public, agency

    const {
        data: announcements,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["donor-announcements-all"],
        queryFn: () => getDonorAnnouncements(50), // Get more announcements
        staleTime: 1000 * 60 * 5,
    });

    const handleViewAnnouncement = (announcementId) => {
        setSelectedAnnouncementId(announcementId);
        setIsViewModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedAnnouncementId(null);
    };

    // Filter and search announcements
    const filteredAnnouncements = announcements?.success
        ? announcements.data.filter((announcement) => {
              const matchesSearch =
                  announcement.title
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  announcement.body
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());

              const matchesFilter =
                  filterType === "all" ||
                  (filterType === "public" && announcement.is_public) ||
                  (filterType === "agency" && !announcement.is_public);

              return matchesSearch && matchesFilter;
          })
        : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Bell className="w-8 h-8" />
                        Announcements
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Stay updated with the latest news and information
                    </p>
                </div>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search announcements..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={
                                    filterType === "all" ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setFilterType("all")}
                            >
                                All
                            </Button>
                            <Button
                                variant={
                                    filterType === "public"
                                        ? "default"
                                        : "outline"
                                }
                                size="sm"
                                onClick={() => setFilterType("public")}
                            >
                                Public
                            </Button>
                            <Button
                                variant={
                                    filterType === "agency"
                                        ? "default"
                                        : "outline"
                                }
                                size="sm"
                                onClick={() => setFilterType("agency")}
                            >
                                Agency
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Announcements List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-48 w-full" />
                        ))}
                    </div>
                ) : error ? (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-8 text-red-500">
                                Failed to load announcements
                            </div>
                        </CardContent>
                    </Card>
                ) : filteredAnnouncements.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-12">
                                <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-semibold mb-2">
                                    {searchTerm || filterType !== "all"
                                        ? "No matching announcements"
                                        : "No announcements yet"}
                                </h3>
                                <p className="text-gray-500">
                                    {searchTerm || filterType !== "all"
                                        ? "Try adjusting your search or filters"
                                        : "Check back later for updates"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Showing {filteredAnnouncements.length}{" "}
                                announcement
                                {filteredAnnouncements.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                        <div className="space-y-4">
                            {filteredAnnouncements.map((announcement) => (
                                <AnnouncementCard
                                    key={announcement.id}
                                    announcement={announcement}
                                    onView={handleViewAnnouncement}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Announcement View Modal */}
            <ViewAnnouncementModal
                announcementId={selectedAnnouncementId}
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
            />
        </div>
    );
}
```

#### 2.2 Create Donor View Announcement Modal

**File:** `components/donors/announcements/ViewAnnouncementModal.jsx`

```javascript
"use client";

import { useQuery } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@components/ui/dialog";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { format } from "date-fns";
import { Calendar, Building, FileText, User, X } from "lucide-react";
import { fetchAnnouncement } from "@action/announcementAction";
import Skeleton from "@components/ui/skeleton";
import Image from "next/image";
import CustomAvatar from "@components/reusable_components/CustomAvatar";

export default function ViewAnnouncementModal({
    announcementId,
    isOpen,
    onClose,
}) {
    const { data: announcement, isLoading } = useQuery({
        queryKey: ["announcement", announcementId],
        queryFn: async () => {
            const res = await fetchAnnouncement(announcementId);
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
        enabled: !!announcementId && isOpen,
    });

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold">
                            Announcement Details
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                ) : announcement ? (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-start gap-4">
                            <CustomAvatar
                                avatar={
                                    announcement.agency?.file_url ||
                                    "/default_company_avatar.png"
                                }
                                className="w-16 h-16"
                            />
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-2">
                                    {announcement.title}
                                </h2>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Building className="w-4 h-4" />
                                        <span>
                                            {announcement.agency?.name ||
                                                "System"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {format(
                                                new Date(
                                                    announcement.createdAt
                                                ),
                                                "PPP"
                                            )}
                                        </span>
                                    </div>
                                    {announcement.is_public && (
                                        <Badge variant="secondary">
                                            Public
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Image */}
                        {announcement.file_url && (
                            <div className="relative">
                                <Image
                                    src={announcement.file_url}
                                    alt={announcement.title}
                                    width={800}
                                    height={400}
                                    className="w-full h-auto rounded-lg"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <Card>
                            <CardContent className="pt-6">
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: announcement.body,
                                    }}
                                />
                            </CardContent>
                        </Card>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="w-4 h-4" />
                                <span>
                                    Posted by {announcement.user?.full_name}
                                </span>
                            </div>
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Announcement not found</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
```

### Phase 3: Navigation Integration

#### 3.1 Update Donor Layout Navigation

**File:** `app/(pages)/portal/(role_based)/donors/layout.js`

```javascript
// Add announcements to the navigation menu
const donorMenuItems = [
    // ... existing items ...
    {
        title: "Announcements",
        href: "/portal/donors/announcements",
        icon: Bell,
    },
];
```

## Implementation Checklist

### Phase 1: Dashboard Integration

-   [ ] **Step 1.1**: Create `getDonorAnnouncements()` action in `donorAction.js`
-   [ ] **Step 1.2**: Create `AnnouncementCard` component
-   [ ] **Step 1.3**: Create `AnnouncementsFeed` component
-   [ ] **Step 1.4**: Update donor dashboard layout
-   [ ] **Step 1.5**: Test dashboard integration

### Phase 2: Dedicated Page

-   [ ] **Step 2.1**: Create donor announcements page
-   [ ] **Step 2.2**: Create donor view announcement modal
-   [ ] **Step 2.3**: Add search and filter functionality
-   [ ] **Step 2.4**: Test dedicated page functionality

### Phase 3: Navigation & Polish

-   [ ] **Step 3.1**: Update donor layout navigation
-   [ ] **Step 3.2**: Add loading states and error handling
-   [ ] **Step 3.3**: Test responsive design
-   [ ] **Step 3.4**: Add analytics tracking (optional)

## Technical Considerations

### Performance

-   Use React Query for caching and background updates
-   Implement pagination for large announcement lists
-   Optimize images with Next.js Image component
-   Use skeleton loading states

### Security

-   Leverage existing role-based access control
-   Validate user permissions on server-side
-   Sanitize HTML content in announcements

### UX/UI

-   Follow existing design patterns
-   Ensure responsive design
-   Provide clear visual hierarchy
-   Use consistent spacing and typography

### Accessibility

-   Proper ARIA labels
-   Keyboard navigation support
-   Screen reader compatibility
-   Color contrast compliance

## Future Enhancements

### Phase 4: Advanced Features (Optional)

-   [ ] **Announcement Categories/Tags**
-   [ ] **Push Notifications for New Announcements**
-   [ ] **Announcement Bookmarking**
-   [ ] **Email Digest Options**
-   [ ] **Announcement Analytics**
-   [ ] **Rich Text Editor for Admin/Host Announcements**

## Conclusion

This hybrid approach provides the best user experience by:

1. **Dashboard Integration**: Shows recent announcements prominently
2. **Dedicated Page**: Allows full browsing and search functionality
3. **Consistent Design**: Follows existing patterns and components
4. **Scalable Architecture**: Easy to extend with additional features

The implementation leverages existing infrastructure while providing a modern, user-friendly announcements system for donors.
