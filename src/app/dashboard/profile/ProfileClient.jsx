"use client";

import { useEffect, useState } from "react";
import { FaUserEdit, FaSave, FaEnvelope, FaCamera } from "react-icons/fa";

export default function ProfileClient() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    bio: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`,
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || "",
            email: data.email || "",
            image: data.image || "",
            bio: data.bio || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: body,
        }
      );
      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({ ...prev, image: data.data.url }));
      } else {
        alert("Failed to upload image to ImgBB");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: formData.name,
            image: formData.image,
            bio: formData.bio,
          }),
        }
      );
      if (res.ok) {
        alert("Profile Updated Successfully!");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong connecting to server!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="text-xl font-black uppercase animate-pulse p-8">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
      {/* Header Section */}
      <div className="mb-8 border-b-4 border-black pb-4">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black flex items-center gap-4">
          <FaUserEdit /> Profile Settings
        </h1>
        <p className="font-medium text-lg text-black mt-2">
          Update your personal information and chef bio.
        </p>
      </div>

      <div className="bg-white border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Profile Avatar Preview */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b-4 border-black border-dashed">
          <div className="w-32 h-32 bg-[#FFC900] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden flex-shrink-0">
            {formData.image ? (
              <img
                src={formData.image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-5xl font-black uppercase">
                {formData.name ? formData.name.charAt(0) : "?"}
              </span>
            )}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-black uppercase text-black">
              {formData.name || "Chef Name"}
            </h2>
            <p className="font-bold text-gray-600 flex items-center justify-center sm:justify-start gap-2 mt-1">
              <FaEnvelope /> {formData.email}
            </p>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-black font-bold uppercase mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border-4 border-black font-medium focus:outline-none focus:ring-4 focus:ring-[#FFC900] bg-[#FFF9E6] text-black"
            />
          </div>

          <div>
            <label className="block text-black font-bold uppercase mb-2">
              Email Address (Read-only)
            </label>
            <input
              type="email"
              readOnly
              value={formData.email}
              className="w-full px-4 py-3 border-4 border-black font-medium bg-gray-200 text-gray-500 cursor-not-allowed"
              title="Email cannot be changed"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-black font-bold uppercase mb-2">
              <FaCamera /> Profile Image (imgbb Upload)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-3 border-4 border-black font-medium focus:outline-none bg-white text-black file:mr-4 file:py-1 file:px-3 file:border-2 file:border-black file:bg-[#FFC900] file:text-black file:font-black file:uppercase hover:file:bg-black hover:file:text-white text-sm"
            />
            {uploading && (
              <p className="text-xs font-bold text-gray-700 mt-2 uppercase animate-pulse">
                Uploading to ImgBB...
              </p>
            )}
          </div>

          <div>
            <label className="block text-black font-bold uppercase mb-2">
              Chef Bio
            </label>
            <textarea
              rows="4"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="w-full px-4 py-3 border-4 border-black font-medium focus:outline-none focus:ring-4 focus:ring-[#FFC900] bg-[#FFF9E6] text-black resize-none"
              placeholder="Tell the community about your cooking journey..."
            ></textarea>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex items-center justify-center gap-3 bg-black text-white font-black uppercase text-lg px-8 py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,201,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-70 cursor-pointer"
            >
              <FaSave className="text-xl text-[#FFC900]" />
              {loading ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
