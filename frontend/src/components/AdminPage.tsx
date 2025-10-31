import { useEffect, useMemo, useState } from "react";
import { Download, Loader2, LogIn, ShieldAlert, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { apiUrl } from "../lib/api";

type EarlyAccessEntry = {
  id: string;
  email: string;
  consent: boolean;
  created_at?: string | null;
};

type UserEntry = {
  id?: string;
  username?: string;
  email?: string;
  role?: string;
  created_at?: string;
};

type ImageEntry = {
  filename: string;
  created_at?: string;
  source_url: string;
};

function formatDate(value?: string | null): string {
  if (!value) return "--";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function buildAuthHeaders(token?: string): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface AdminUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  token?: string;
  onUploadSuccess: (img: ImageEntry) => void;
}

const AdminUploadModal = ({ isOpen, onClose, token, onUploadSuccess }: AdminUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedBodyShape, setSelectedBodyShape] = useState("");
  const [selectedWeather, setSelectedWeather] = useState("");

  // Style and body shape options from StyleDiscovery
  const styleOptions = ["Casual", "Sporty", "Formal", "Party"];
  const bodyShapeOptions = ["Rectangle", "Hourglass", "Pear", "Round", "Inverted Triangle"];
  const weatherOptions = ["Hot", "Cold"];

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");
    if (!filename) return alert("Enter a filename");
    if (!file.name.endsWith(".png")) return alert("Only PNG files allowed");
    if (!selectedStyle) return alert("Please select a style");
    if (!selectedBodyShape) return alert("Please select a body shape");
    if (!selectedWeather) return alert("Please select weather type");

    const formData = new FormData();
    const finalFilename = filename.endsWith(".png") ? filename : filename + ".png";
    const tags = `${selectedStyle}, ${selectedBodyShape}, ${selectedWeather}`;
    
    formData.append("image", file);
    formData.append("filename", finalFilename);
    formData.append("tags", tags);

    try {
      const res = await fetch(apiUrl("/api/admin/images/upload/"), {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

      const data: ImageEntry = await res.json();
      onUploadSuccess(data);
      setFile(null);
      setFilename("");
      setSelectedStyle("");
      setSelectedBodyShape("");
      setSelectedWeather("");
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to upload");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-gray-900 text-white rounded-xl p-8 shadow-xl relative">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Upload Image</h2>
        
        <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-300">
            Select tags to categorize this outfit image. The combination of style, body shape, and weather type will help the recommendation system match this outfit to users with similar preferences.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <input type="file" accept="image/png" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full border border-gray-700 rounded px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input type="text" placeholder="Filename" value={filename} onChange={(e) => setFilename(e.target.value)} className="w-full border border-gray-700 rounded px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300 mb-2">Style *</label>
              <select 
                value={selectedStyle} 
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full border border-gray-700 rounded px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select style...</option>
                {styleOptions.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300 mb-2">Body Shape *</label>
              <select 
                value={selectedBodyShape} 
                onChange={(e) => setSelectedBodyShape(e.target.value)}
                className="w-full border border-gray-700 rounded px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select body shape...</option>
                {bodyShapeOptions.map(shape => (
                  <option key={shape} value={shape}>{shape}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300 mb-2">Weather *</label>
              <select 
                value={selectedWeather} 
                onChange={(e) => setSelectedWeather(e.target.value)}
                className="w-full border border-gray-700 rounded px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select weather...</option>
                {weatherOptions.map(weather => (
                  <option key={weather} value={weather}>{weather}</option>
                ))}
              </select>
            </div>
          </div>

          {(selectedStyle || selectedBodyShape || selectedWeather) && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-300 mb-2">Tag Preview:</p>
              <p className="text-green-400 font-mono text-sm">
                {[selectedStyle, selectedBodyShape, selectedWeather].filter(Boolean).join(", ") || "No tags selected"}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded text-white font-semibold transition" onClick={onClose}>Cancel</button>
          <button className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded text-white font-semibold transition" onClick={handleUpload}>Upload</button>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl font-bold">×</button>
      </div>
    </div>
  );
};

interface AdminInstantUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  token?: string;
  onUploadSuccess?: (res: any) => void;
}

const AdminInstantUploadModal = ({ isOpen, onClose, token, onUploadSuccess }: AdminInstantUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState("");
  const [tag, setTag] = useState("");

  const allowedTags = ["sunny", "cloudy", "cold", "casual", "work", "date"];

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");
    if (!filename) return alert("Enter a filename");
    if (!file.name.endsWith(".png")) return alert("Only PNG files allowed");
    if (!tag) return alert("Please select a tag");

    const formData = new FormData();
    const finalFilename = filename.endsWith(".png") ? filename : filename + ".png";
    formData.append("image", file);
    formData.append("filename", finalFilename);
    formData.append("tag", tag);

    try {
      const res = await fetch(apiUrl("/api/admin/instantoutfit/upload/"), {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Upload failed: ${res.status} ${txt}`);
      }

      const data = await res.json();
      onUploadSuccess?.(data);
      setFile(null);
      setFilename("");
      setTag("");
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to upload");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-gray-900 text-white rounded-xl p-8 shadow-xl relative">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-400">Upload Instant Outfit</h2>

        <div className="flex flex-col gap-4">
          <input type="file" accept="image/png" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full border border-gray-700 rounded px-4 py-3 bg-gray-800 text-white" />
          <input type="text" placeholder="Filename" value={filename} onChange={(e) => setFilename(e.target.value)} className="w-full border border-gray-700 rounded px-4 py-3 bg-gray-800 text-white" />

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-300 mb-2">Tag (select one)</label>
            <select value={tag} onChange={(e) => setTag(e.target.value)} className="w-full border border-gray-700 rounded px-4 py-3 bg-gray-800 text-white">
              <option value="">Select a tag...</option>
              {allowedTags.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button className="px-4 py-2 bg-gray-700 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-green-600 rounded" onClick={handleUpload}>Upload</button>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 text-white text-2xl">×</button>
      </div>
    </div>
  );
};

export default function AdminPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<EarlyAccessEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const [users, setUsers] = useState<UserEntry[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [exportingUsers, setExportingUsers] = useState(false);

  // ----- Sections -----
  const [showEarlyAccess, setShowEarlyAccess] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [showInstantOutfits, setShowInstantOutfits] = useState(false);

  // ----- Images -----
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [imageSearch, setImageSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const IMAGES_PAGE_SIZE = 10;
  const [imagesPage, setImagesPage] = useState(1);
  const [imagesTotal, setImagesTotal] = useState(0);

  // ----- Instant Outfits -----
  const [instantOutfits, setInstantOutfits] = useState<ImageEntry[]>([]);
  const [loadingInstantOutfits, setLoadingInstantOutfits] = useState(false);
  const [instantOutfitSearch, setInstantOutfitSearch] = useState("");
  const [isInstantModalOpen, setInstantModalOpen] = useState(false);
  const INSTANT_OUTFITS_PAGE_SIZE = 10;
  const TABLE_PAGE_SIZE = 5;
  const [instantOutfitsPage, setInstantOutfitsPage] = useState(1);
  const [instantOutfitsTotal, setInstantOutfitsTotal] = useState(0);
  const USERS_PAGE_SIZE = TABLE_PAGE_SIZE;
  const [usersPage, setUsersPage] = useState(1);
  const [usersRefreshToken, setUsersRefreshToken] = useState(0);
  const [usersTotal, setUsersTotal] = useState(0);
  const EARLY_PAGE_SIZE = TABLE_PAGE_SIZE;
  const [earlyPage, setEarlyPage] = useState(1);
  const [earlyRefreshToken, setEarlyRefreshToken] = useState(0);
  const [earlyTotal, setEarlyTotal] = useState(0);

  const isAdmin = user?.isAdmin === true;

  const earlySummary = useMemo(() => {
    if (!entries.length) return "No registrations found.";
    const start = (earlyPage - 1) * EARLY_PAGE_SIZE + 1;
    const end = Math.min(start + entries.length - 1, earlyTotal);
    return `Showing ${start} to ${end} of ${earlyTotal}`;
  }, [entries.length, earlyPage, earlyTotal]);

  const usersSummary = useMemo(() => {
    if (!users.length) return "No users found.";
    const start = (usersPage - 1) * USERS_PAGE_SIZE + 1;
    const end = Math.min(start + users.length - 1, usersTotal);
    return `Showing ${start} to ${end} of ${usersTotal}`;
  }, [users.length, usersPage, usersTotal]);

  const imagesSummary = useMemo(() => {
    if (!images.length) return "No images found.";
    const start = (imagesPage - 1) * IMAGES_PAGE_SIZE + 1;
    const end = start + images.length - 1;
    return `Showing ${start} to ${end} of ${imagesTotal}`;
  }, [images.length, imagesPage, imagesTotal]);

  const instantOutfitsSummary = useMemo(() => {
    if (!instantOutfits.length) return "No instant outfits found.";
    const start = (instantOutfitsPage - 1) * INSTANT_OUTFITS_PAGE_SIZE + 1;
    const end = start + instantOutfits.length - 1;
    return `Showing ${start} to ${end} of ${instantOutfitsTotal}`;
  }, [instantOutfits.length, instantOutfitsPage, instantOutfitsTotal]);

  // === Fetch Images ===
  useEffect(() => {
    if (!isAdmin) return;

    const controller = new AbortController();
    setLoadingImages(true);

    async function fetchImages() {
      try {
        const res = await fetch(
          apiUrl(`/api/admin/images/search/?q=${encodeURIComponent(imageSearch)}&page=${imagesPage}&page_size=${IMAGES_PAGE_SIZE}`),
          { headers: buildAuthHeaders(user?.token), signal: controller.signal },
        );
        if (!res.ok) throw new Error("Failed to load images");

        const payload = await res.json();
        setImages(payload.items || []);
        setImagesTotal(payload.total || 0);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setImages([]);
        setImagesTotal(0);
      } finally {
        setLoadingImages(false);
      }
    }

    fetchImages();

    return () => controller.abort();
  }, [isAdmin, imageSearch, imagesPage, user?.token]);

  // === Fetch Instant Outfits ===
  useEffect(() => {
    if (!isAdmin) return;

    const controller = new AbortController();
    setLoadingInstantOutfits(true);

    async function fetchInstantOutfits() {
      try {
        const res = await fetch(
          apiUrl(`/api/admin/instantoutfit/search/?q=${encodeURIComponent(instantOutfitSearch)}&page=${instantOutfitsPage}&page_size=${INSTANT_OUTFITS_PAGE_SIZE}`),
          { headers: buildAuthHeaders(user?.token), signal: controller.signal },
        );
        if (!res.ok) throw new Error("Failed to load instant outfits");

        const payload = await res.json();
        setInstantOutfits(payload.items || []);
        setInstantOutfitsTotal(payload.total || 0);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setInstantOutfits([]);
      } finally {
        setLoadingInstantOutfits(false);
      }
    }

    fetchInstantOutfits();

    return () => controller.abort();
  }, [isAdmin, instantOutfitSearch, instantOutfitsPage, user?.token]);

  useEffect(() => {
    if (!isAdmin) {
      setEntries([]);
      setEarlyTotal(0);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    async function fetchEntries() {
      try {
        const response = await fetch(
          apiUrl(`/api/early_access/list/?page=${earlyPage}&page_size=${EARLY_PAGE_SIZE}`),
          {
            headers: buildAuthHeaders(user?.token),
            signal: controller.signal,
          }
        );

        if (!response.ok) throw new Error("Unable to load registrations.");

        const payload = await response.json();
        setEntries(Array.isArray(payload.items) ? payload.items : []);
        setEarlyTotal(typeof payload.total === "number" ? payload.total : 0);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(err.message || "Unable to load registrations.");
        setEntries([]);
        setEarlyTotal(0);
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
    return () => controller.abort();
  }, [earlyPage, earlyRefreshToken, isAdmin]);

  const handleSearchImages = async () => {
    const query = imageSearch.trim();
    if (!query) return;

    // Reset to first page when searching
    setImagesPage(1);
    setLoadingImages(true);

    try {
      const res = await fetch(
        apiUrl(`/api/admin/images/search/?q=${encodeURIComponent(query)}&page=1&page_size=${IMAGES_PAGE_SIZE}`),
        { headers: buildAuthHeaders(user?.token) }
      );

      if (!res.ok) throw new Error("Failed to load images");

      const payload: { items: ImageEntry[]; total?: number } = await res.json();
      let items = payload.items || [];

      // Prioritise exact filename match
      const exactMatch = items.find((img) => img.filename === query);
      if (exactMatch) {
        // Move exact match to the top
        items = [exactMatch, ...items.filter((img) => img.filename !== query)];
      }

      setImages(items);
      setImagesTotal(payload.total || 0);
    } catch (err: any) {
      setImages([]);
      setImagesTotal(0);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleSearchInstantOutfits = async () => {
    const query = instantOutfitSearch.trim();
    if (!query) return;

    // Reset to first page when searching
    setInstantOutfitsPage(1);
    setLoadingInstantOutfits(true);

    try {
      const res = await fetch(
        apiUrl(`/api/admin/instantoutfit/search/?q=${encodeURIComponent(query)}&page=1&page_size=${INSTANT_OUTFITS_PAGE_SIZE}`),
        { headers: buildAuthHeaders(user?.token) }
      );

      if (!res.ok) throw new Error("Failed to load instant outfits");

      const payload: { items: ImageEntry[]; total?: number } = await res.json();
      let items = payload.items || [];

      // Prioritise exact filename match
      const exactMatch = items.find((img) => img.filename === query);
      if (exactMatch) {
        // Move exact match to the top
        items = [exactMatch, ...items.filter((img) => img.filename !== query)];
      }

      setInstantOutfits(items);
      setInstantOutfitsTotal(payload.total || 0);
    } catch (err: any) {
      setInstantOutfits([]);
      setInstantOutfitsTotal(0);
    } finally {
      setLoadingInstantOutfits(false);
    }
  };

  // Fetch users (paginated)
  useEffect(() => {
    if (!isAdmin) return;

    const controller = new AbortController();
    setLoadingUsers(true);
    setUsersError(null);

    async function fetchUsers() {
      try {
        const res = await fetch(apiUrl(`/api/users/?page=${usersPage}&page_size=${USERS_PAGE_SIZE}`), {
          headers: buildAuthHeaders(user?.token),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Unable to load users");

        const payload = await res.json();
        setUsers(payload.items || []);
        setUsersTotal(typeof payload.total === "number" ? payload.total : payload.items.length);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setUsersError(err.message || "Error fetching users");
        setUsers([]);
        setUsersTotal(0);
      } finally {
        setLoadingUsers(false);
      }
    }

    fetchUsers();
    return () => controller.abort();
  }, [isAdmin, usersPage, usersRefreshToken]);

  const handleDeleteImage = async (name: string) => {
    if (!confirm(`Delete image "${name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(apiUrl(`/api/admin/images/delete/${encodeURIComponent(name)}/`), { method: "DELETE", headers: buildAuthHeaders(user?.token) });

      if (!res.ok) throw new Error("Failed to delete image");

      setImages((prev) => prev.filter((img) => img.filename !== name));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete image");
    }
  };

  const handleDeleteInstantOutfit = async (name: string) => {
    if (!confirm(`Delete instant outfit "${name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(apiUrl(`/api/admin/instantoutfit/delete/${encodeURIComponent(name)}/`), { 
        method: "DELETE", 
        headers: buildAuthHeaders(user?.token) 
      });

      if (!res.ok) throw new Error("Failed to delete instant outfit");

      setInstantOutfits((prev) => prev.filter((outfit) => outfit.filename !== name));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete instant outfit");
    }
  };

  const handleDeleteEarlyAccess = async (entry: EarlyAccessEntry) => {
    const targetEmail = entry.email?.trim();
    const identifier = entry.id || targetEmail;
    if (!identifier) {
      alert("Unable to delete this registration. Missing identifier.");
      return;
    }

    if (!confirm(`Delete early-access registration ${identifier}?`)) return;

    try {
      const response = await fetch(apiUrl(`/api/early_access/delete/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...buildAuthHeaders(user?.token),
        },
        body: JSON.stringify({ id: entry.id, email: targetEmail }),
      });

      if (!response.ok) {
        let message = "Failed to delete registration";
        try {
          const payload = await response.json();
          message = payload?.error || payload?.detail || message;
        } catch {
          // ignore parse errors
        }
        throw new Error(message);
      }

      setEntries((prev) => prev.filter((item) => item.id !== entry.id));
      setEarlyTotal((prev) => Math.max(prev - 1, 0));

      setTimeout(() => {
        setEntries((current) => {
          if (current.length === 0 && earlyPage > 1) {
            setEarlyPage((p) => Math.max(1, p - 1));
          }
          return current;
        });
      }, 0);
      setEarlyRefreshToken((token) => token + 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting registration");
    }
  };

  const handleDeleteUser = async (identifier?: string) => {
    const target = identifier?.trim();
    if (!target) return;

    const normalizedTarget = target.toLowerCase();
    const normalizedAdminEmail = user?.email ? user.email.trim().toLowerCase() : undefined;
    if (normalizedAdminEmail && normalizedTarget === normalizedAdminEmail) {
      alert("You cannot delete the account you are currently signed in with.");
      return;
    }

    if (!confirm(`Delete user ${target}?`)) return;

    try {
      const response = await fetch(apiUrl(`/api/users/delete/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...buildAuthHeaders(user?.token),
        },
        body: JSON.stringify({ email: target }),
      });

      if (!response.ok) {
        let message = "Failed to delete user";
        try {
          const payload = await response.json();
          message = payload?.error || payload?.detail || message;
        } catch {
          // ignore JSON parsing errors
        }
        throw new Error(message);
      }

      setUsers((prev) => prev.filter((u) => u.email !== target && u.username !== target));
      setUsersTotal((prev) => Math.max(prev - 1, 0));

      // If the current page becomes empty after deletion, go back a page (unless already on first)
      setTimeout(() => {
        setUsers((current) => {
          if (current.length === 0 && usersPage > 1) {
            setUsersPage((p) => Math.max(1, p - 1));
          }
          return current;
        });
      }, 0);
      setUsersRefreshToken((token) => token + 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting user");
    }
  };

  const handleExport = async () => {
    if (!isAdmin || exporting) return;

    setExporting(true);
    try {
      const response = await fetch(apiUrl("/api/early_access/export/"), {
        headers: buildAuthHeaders(user?.token),
      });

      if (!response.ok) throw new Error("Export failed.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `early-access-${timestamp}.xlsx`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  };

  const handleExportUsers = async () => {
    if (!isAdmin || exportingUsers) return;

    setExportingUsers(true);
    try {
      const response = await fetch(apiUrl("/api/users/export/"), {
        headers: buildAuthHeaders(user?.token),
      });

      if (!response.ok) throw new Error("Export failed.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `registered-users-${timestamp}.xlsx`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setExportingUsers(false);
    }
  };

  if (!user) {
    return (
      <section className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-[#04030f] px-6 py-12 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-[0_40px_120px_rgba(6,5,15,0.45)] backdrop-blur">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-500/30">
            <LogIn className="h-8 w-8 text-pink-200" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold">Admin access only</h1>
          <p className="mt-2 text-sm text-white/70">
            Sign in with the administrator account to view admin data.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-linear-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Go to login
          </Link>
        </div>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-[#04030f] px-6 py-12 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-rose-500/10 p-10 text-center shadow-[0_40px_120px_rgba(80,10,40,0.45)] backdrop-blur">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/30">
            <ShieldAlert className="h-8 w-8 text-rose-100" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold">Access denied</h1>
          <p className="mt-2 text-sm text-white/70">
            You are signed in, but this area is restricted to the administrator.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-3.5rem)] bg-[#04030f] px-6 py-12 text-white">
      {/* === Modals at top level === */}
      {isModalOpen && (
        <AdminUploadModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          token={user?.token}
          onUploadSuccess={(img) => {
            setImages((prev) => [img, ...prev]);
            setImagesTotal((prev) => prev + 1);
          }}
        />
      )}
      {isInstantModalOpen && (
        <AdminInstantUploadModal
          isOpen={isInstantModalOpen}
          onClose={() => setInstantModalOpen(false)}
          token={user?.token}
          onUploadSuccess={() => {
            // Add uploaded instant outfit to the list (need to refresh to get proper format)
            setInstantOutfitsTotal((prev) => prev + 1);
            // Optionally refresh the list
            handleSearchInstantOutfits();
          }}
        />
      )}
      <div className="mx-auto w-full max-w-6xl space-y-12">
        {/* === Early Access Section === */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(6,5,15,0.4)] backdrop-blur">
          <header
            className="flex cursor-pointer items-center justify-between"
            onClick={() => setShowEarlyAccess((s) => !s)}
          >
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Early-access registrations
              </h1>
              <p className="mt-2 text-sm text-white/70">
                Monitor signups collected from the early-access modal.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting || !earlyTotal}
              className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export to Excel
            </button>
            {showEarlyAccess ? (
              <ChevronUp className="h-6 w-6 text-white/60" />
            ) : (
              <ChevronDown className="h-6 w-6 text-white/60" />
            )}
          </header>

          {showEarlyAccess && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow">
              <table className="min-w-full divide-y divide-white/10 text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.2em] text-white/50">
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Consent</th>
                    <th className="px-6 py-4 font-semibold">Created</th>
                    <th className="px-6 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-white/70">
                        Loading registrations...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-rose-300">
                        {error}
                      </td>
                    </tr>
                  ) : entries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-white/70">
                        No registrations found.
                      </td>
                    </tr>
                  ) : (
                    entries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 font-medium">{entry.email}</td>
                        <td className="px-6 py-4 text-white/70">
                          {entry.consent ? "Yes" : "No"}
                        </td>
                        <td className="px-6 py-4 text-white/70">
                          {formatDate(entry.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteEarlyAccess(entry)}
                            className="rounded-full border border-rose-400/50 px-3 py-1 text-sm text-rose-300 hover:bg-rose-400/20 transition flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {/* Pagination controls */}
              {entries.length > 0 && (
                <div className="mt-4 flex justify-between items-center text-white/70 text-sm">
                  <span>{earlySummary}</span>
                  <div className="flex gap-2">
                    <button
                      disabled={earlyPage <= 1}
                      onClick={() => setEarlyPage((p) => p - 1)}
                      className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      disabled={earlyPage >= Math.ceil(earlyTotal / EARLY_PAGE_SIZE)}
                      onClick={() => setEarlyPage((p) => p + 1)}
                      className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* === Users Section === */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(6,5,15,0.4)] backdrop-blur">
          <header
            className="flex cursor-pointer items-center justify-between"
            onClick={() => setShowUsers((s) => !s)}
          >
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Registered Users</h1>
              <p className="mt-2 text-sm text-white/70">
                Manage registered users and remove unwanted accounts.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportUsers}
              disabled={exportingUsers || !usersTotal}
              className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exportingUsers ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export to Excel
            </button>
            {showUsers ? (
              <ChevronUp className="h-6 w-6 text-white/60" />
            ) : (
              <ChevronDown className="h-6 w-6 text-white/60" />
            )}
          </header>

          {showUsers && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow">
              <table className="min-w-full divide-y divide-white/10 text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.2em] text-white/50">
                    <th className="px-6 py-4 font-semibold">Username</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Created</th>
                    <th className="px-6 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loadingUsers ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-white/70">
                        Loading users...
                      </td>
                    </tr>
                  ) : usersError ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-rose-300">
                        {usersError}
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-white/70">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((u, i) => {
                      const entryEmail = u.email?.trim();
                      const normalizedEntryEmail = entryEmail?.toLowerCase();
                      const normalizedAdminEmail = user?.email ? user.email.trim().toLowerCase() : undefined;
                      const isSelf = Boolean(
                        normalizedEntryEmail &&
                          normalizedAdminEmail &&
                          normalizedEntryEmail === normalizedAdminEmail,
                      );

                      return (
                        <tr key={i} className="hover:bg-white/5">
                          <td className="px-6 py-4 font-medium">{u.username || "--"}</td>
                          <td className="px-6 py-4">{entryEmail || "--"}</td>
                          <td className="px-6 py-4 text-white/70">{u.role || "User"}</td>
                          <td className="px-6 py-4 text-white/70">{formatDate(u.created_at)}</td>
                          <td className="px-6 py-4">
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.email)}
                              disabled={isSelf}
                              title={
                                isSelf ? "You cannot delete the account you are signed in with." : undefined
                              }
                              className={`rounded-full px-3 py-1 text-sm transition ${
                                isSelf
                                  ? "border border-white/20 text-white/60 cursor-not-allowed"
                                  : "border border-rose-400/50 text-rose-300 hover:bg-rose-400/20"
                              }`}
                            >
                              {isSelf ? (
                                <>
                                  <ShieldAlert className="inline h-4 w-4 mr-1" /> Protected
                                </>
                              ) : (
                                <>
                                  <Trash2 className="inline h-4 w-4 mr-1" /> Delete
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
              {/* Pagination controls */}
              {/* Pagination summary */}
              <div className="mt-4 flex justify-between items-center text-white/70 text-sm">
                <span>{usersSummary}</span>
                <div className="flex gap-2">
                  <button
                    disabled={usersPage <= 1}
                    onClick={() => setUsersPage((p) => p - 1)}
                    className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    disabled={usersPage >= Math.ceil(usersTotal / USERS_PAGE_SIZE)}
                    onClick={() => setUsersPage((p) => p + 1)}
                    className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* === Images Section === */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(6,5,15,0.4)] backdrop-blur">
          <header
            className="flex cursor-pointer items-center justify-between"
            onClick={() => setShowImages((s) => !s)}
          >
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Images</h1>
              <p className="mt-2 text-sm text-white/70">
                Search and delete images from the database and Cloudflare.
              </p>
            </div>
            {showImages ? (
              <ChevronUp className="h-6 w-6 text-white/60" />
            ) : (
              <ChevronDown className="h-6 w-6 text-white/60" />
            )}
          </header>
          {showImages && (
            <>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Type image name and press Enter or click Search"
                  value={imageSearch}
                  onChange={(e) => setImageSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchImages();
                  }}
                  className="rounded-md px-4 py-3 flex-1 border border-white/30 bg-[#04030f] text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <div className="mt-4 flex items-center gap-2">
                  <button
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                    onClick={() => setModalOpen(true)}
                  >
                    <Download className="h-4 w-4" /> Upload Image
                  </button>
                </div>
                <button
                  className="px-6 py-3 bg-pink-500 rounded-full text-white font-semibold hover:bg-pink-600 transition"
                  onClick={handleSearchImages}
                >
                  Search Images
                </button>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow">
                <table className="min-w-full divide-y divide-white/10 text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-[0.2em] text-white/50">
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Created</th>
                      <th className="px-6 py-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loadingImages ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-10 text-center text-white/70">
                          Loading images...
                        </td>
                      </tr>
                    ) : images.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-10 text-center text-white/70">
                          No images found.
                        </td>
                      </tr>
                    ) : (
                      images.map((image) => (
                        <tr key={image.filename} className="hover:bg-white/5">
                          <td className="px-6 py-4 font-medium">{image.filename}</td>
                          <td className="px-6 py-4 text-white/70">{formatDate(image.created_at)}</td>
                          <td className="px-6 py-4 flex items-center gap-4">
                            <img
                              src={image.source_url} // use the field from the backend
                              alt={image.filename}
                              className="h-12 w-12 object-cover rounded-md border border-white/20"
                            />
                            <button
                              className="rounded-full border border-rose-400/50 px-3 py-1 text-sm text-rose-300 hover:bg-rose-400/20 transition flex items-center gap-1"
                              onClick={() => handleDeleteImage(image.filename)}
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Images Pagination */}
              <div className="mt-6 flex items-center justify-between text-sm text-white/70">
                <p>{imagesSummary}</p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={imagesPage === 1}
                    onClick={() => setImagesPage(Math.max(1, imagesPage - 1))}
                    className="rounded border border-white/20 px-3 py-1 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1">Page {imagesPage}</span>
                  <button
                    disabled={images.length < IMAGES_PAGE_SIZE}
                    onClick={() => setImagesPage(imagesPage + 1)}
                    className="rounded border border-white/20 px-3 py-1 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* === Instant Outfits Section === */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(6,5,15,0.4)] backdrop-blur">
          <header
            className="flex cursor-pointer items-center justify-between"
            onClick={() => setShowInstantOutfits((s) => !s)}
          >
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Instant Outfits</h1>
              <p className="mt-2 text-sm text-white/70">
                Search and manage instant outfit images with tags (sunny, cloudy, cold, casual, work, date).
              </p>
            </div>
            {showInstantOutfits ? (
              <ChevronUp className="h-6 w-6 text-white/60" />
            ) : (
              <ChevronDown className="h-6 w-6 text-white/60" />
            )}
          </header>
          {showInstantOutfits && (
            <>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Type instant outfit name and press Enter or click Search"
                  value={instantOutfitSearch}
                  onChange={(e) => setInstantOutfitSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchInstantOutfits();
                  }}
                  className="rounded-md px-4 py-3 flex-1 border border-white/30 bg-[#04030f] text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <div className="mt-4 flex items-center gap-2">
                  <button
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    onClick={() => setInstantModalOpen(true)}
                  >
                    <Download className="h-4 w-4" /> Upload Instant Outfit
                  </button>
                </div>
                <button
                  className="px-6 py-3 bg-pink-500 rounded-full text-white font-semibold hover:bg-pink-600 transition"
                  onClick={handleSearchInstantOutfits}
                >
                  Search Instant Outfits
                </button>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow">
                <table className="min-w-full divide-y divide-white/10 text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-[0.2em] text-white/50">
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Vibe/Tags</th>
                      <th className="px-6 py-4 font-semibold">Created</th>
                      <th className="px-6 py-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loadingInstantOutfits ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-white/70">
                          Loading instant outfits...
                        </td>
                      </tr>
                    ) : instantOutfits.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-white/70">
                          No instant outfits found.
                        </td>
                      </tr>
                    ) : (
                      instantOutfits.map((outfit) => (
                        <tr key={outfit.filename} className="hover:bg-white/5">
                          <td className="px-6 py-4 font-medium">{outfit.filename}</td>
                          <td className="px-6 py-4 text-white/70">
                            {/* Show vibe and tags */}
                            <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs mr-2">
                              {(outfit as any).vibe || "No vibe"}
                            </span>
                            {(outfit as any).tags && Array.isArray((outfit as any).tags) && 
                              (outfit as any).tags.map((tag: string, i: number) => (
                                <span key={i} className="inline-block px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs mr-1">
                                  {tag}
                                </span>
                              ))
                            }
                          </td>
                          <td className="px-6 py-4 text-white/70">{formatDate(outfit.created_at)}</td>
                          <td className="px-6 py-4 flex items-center gap-4">
                            <img
                              src={outfit.source_url}
                              alt={outfit.filename}
                              className="h-12 w-12 object-cover rounded-md border border-white/20"
                            />
                            <button
                              className="rounded-full border border-rose-400/50 px-3 py-1 text-sm text-rose-300 hover:bg-rose-400/20 transition flex items-center gap-1"
                              onClick={() => handleDeleteInstantOutfit(outfit.filename)}
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Instant Outfits Pagination */}
              <div className="mt-6 flex items-center justify-between text-sm text-white/70">
                <p>{instantOutfitsSummary}</p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={instantOutfitsPage === 1}
                    onClick={() => setInstantOutfitsPage(Math.max(1, instantOutfitsPage - 1))}
                    className="rounded border border-white/20 px-3 py-1 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1">Page {instantOutfitsPage}</span>
                  <button
                    disabled={instantOutfits.length < INSTANT_OUTFITS_PAGE_SIZE}
                    onClick={() => setInstantOutfitsPage(instantOutfitsPage + 1)}
                    className="rounded border border-white/20 px-3 py-1 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
