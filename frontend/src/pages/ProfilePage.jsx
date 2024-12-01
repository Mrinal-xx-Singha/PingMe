import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, User, Mail, Calendar, Shield } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen bg-base-100 py-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-base-200 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 bg-base-300 border-b border-base-300">
            <h1 className="text-2xl font-semibold tracking-tight text-center">Profile Settings</h1>
            <p className="mt-2 text-center text-base-content/70">Manage your personal information</p>
          </div>

          <div className="p-8 space-y-10">
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div className="size-36 rounded-full overflow-hidden ring-4 ring-base-300 ring-offset-2 ring-offset-base-200">
                  <img
                    src={selectedImage || authUser.profilePic || "/avatar.png"}
                    alt="Profile"
                    className="size-full object-cover"
                  />
                </div>
                <label
                  htmlFor="avatar-upload"
                  className={`
                    absolute bottom-2 right-2
                    size-10 flex items-center justify-center
                    bg-primary hover:bg-primary/90 
                    text-primary-content
                    rounded-full cursor-pointer
                    shadow-lg hover:scale-105
                    transition-all duration-200
                    ${isUpdatingProfile ? "animate-pulse pointer-events-none opacity-70" : ""}
                  `}
                >
                  <Camera className="size-5" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-base-content/70">
                {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your profile picture"}
              </p>
            </div>

            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium tracking-tight">Personal Information</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-base-content/70">
                    <User className="size-4" />
                    Full Name
                  </label>
                  <div className="px-4 py-3 bg-base-300 rounded-lg border border-base-300 text-base-content">
                    {authUser?.fullName}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-base-content/70">
                    <Mail className="size-4" />
                    Email Address
                  </label>
                  <div className="px-4 py-3 bg-base-300 rounded-lg border border-base-300 text-base-content">
                    {authUser?.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium tracking-tight">Account Information</h2>
              <div className="bg-base-300 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-base-content/10">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="size-4 text-base-content/70" />
                    Member Since
                  </div>
                  <span className="text-sm">{authUser.createdAt?.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Shield className="size-4 text-base-content/70" />
                    Account Status
                  </div>
                  <span className="text-sm px-3 py-1 bg-green-500/10 text-green-500 rounded-full font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;