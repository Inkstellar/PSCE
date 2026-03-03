"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string | null;
  order: number;
  active: boolean;
}

interface BannerFormData {
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  active: boolean;
}

const initialFormData: BannerFormData = {
  title: "",
  subtitle: "",
  imageUrl: "",
  linkUrl: "",
  active: true,
};

export function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<BannerFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/admin/banners");
      if (response.ok) {
        const data = await response.json();
        setBanners(data);
      }
    } catch (error) {
      console.error("Failed to fetch banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleAddBanner = async () => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsAddDialogOpen(false);
        setFormData(initialFormData);
        fetchBanners();
      }
    } catch (error) {
      console.error("Failed to add banner:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditBanner = async () => {
    if (!selectedBanner) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/banners/${selectedBanner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order: selectedBanner.order,
        }),
      });

      if (response.ok) {
        setIsEditDialogOpen(false);
        setSelectedBanner(null);
        setFormData(initialFormData);
        fetchBanners();
      }
    } catch (error) {
      console.error("Failed to edit banner:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBanner = async () => {
    if (!selectedBanner) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/banners/${selectedBanner.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsDeleteDialogOpen(false);
        setSelectedBanner(null);
        fetchBanners();
      }
    } catch (error) {
      console.error("Failed to delete banner:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      await fetch(`/api/admin/banners/${banner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...banner,
          active: !banner.active,
        }),
      });
      fetchBanners();
    } catch (error) {
      console.error("Failed to toggle banner:", error);
    }
  };

  const openEditDialog = (banner: Banner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || "",
      active: banner.active,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsDeleteDialogOpen(true);
  };

  const BannerForm = ({ onSubmit, isEdit = false }: { onSubmit: () => void; isEdit?: boolean }) => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter banner title"
          className="bg-background border-border"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="subtitle">Subtitle *</Label>
        <Input
          id="subtitle"
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          placeholder="Enter banner subtitle"
          className="bg-background border-border"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="imageUrl">Image URL *</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="/images/banner.png"
          className="bg-background border-border"
        />
        {formData.imageUrl && (
          <div className="relative h-32 rounded-lg overflow-hidden border border-border">
            <Image
              src={formData.imageUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="linkUrl">Link URL (optional)</Label>
        <Input
          id="linkUrl"
          value={formData.linkUrl}
          onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
          placeholder="https://example.com"
          className="bg-background border-border"
        />
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
        />
        <Label htmlFor="active">Active</Label>
      </div>
      <DialogFooter className="mt-4">
        <Button
          variant="outline"
          onClick={() => isEdit ? setIsEditDialogOpen(false) : setIsAddDialogOpen(false)}
        >
          Cancel
        </Button>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={onSubmit}
          disabled={submitting || !formData.title || !formData.subtitle || !formData.imageUrl}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? "Updating..." : "Adding..."}
            </>
          ) : (
            isEdit ? "Update Banner" : "Add Banner"
          )}
        </Button>
      </DialogFooter>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Banner Management</h2>
          <p className="text-sm text-muted-foreground">Manage homepage carousel banners</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => {
            setFormData(initialFormData);
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Banner
        </Button>
      </div>

      {/* Banners List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-12">
          <Image
            src="/images/banner1.png"
            alt="No banners"
            width={100}
            height={60}
            className="mx-auto rounded-lg opacity-50 mb-4"
          />
          <p className="text-muted-foreground">No banners found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {banners.map((banner, index) => (
            <Card key={banner.id} className="bg-card border-border overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="relative w-40 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{banner.title}</h3>
                        <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
                      </div>
                      <Badge
                        className={
                          banner.active
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {banner.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(banner)}
                      >
                        {banner.active ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(banner)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDeleteDialog(banner)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle>Add New Banner</DialogTitle>
            <DialogDescription>
              Create a new banner for the homepage carousel
            </DialogDescription>
          </DialogHeader>
          <BannerForm onSubmit={handleAddBanner} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>
              Update the banner details
            </DialogDescription>
          </DialogHeader>
          <BannerForm onSubmit={handleEditBanner} isEdit />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedBanner?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleDeleteBanner}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
