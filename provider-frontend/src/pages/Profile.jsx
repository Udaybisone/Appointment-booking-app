import { useEffect, useState } from "react";
import api from "../api/axios";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [serviceType, setServiceType] = useState("");

  // common
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // doctor
  const [specialization, setSpecialization] = useState("");
  const [experienceYears, setExperienceYears] = useState("");

  // saloon
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");


  // car rental
  const [carTypes, setCarTypes] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/providers/me");
        const data = res.data.data;


        setServiceType(data.serviceType);
        setName(data.name || "");
        setEmail(data.email || "");

        if (data.serviceType === "DOCTOR") {
          setSpecialization(data.specialization || "");
          setExperienceYears(data.experienceYears || "");
        }

        if (data.serviceType === "SALOON") {
          setLocation(data.location || "");
          setPhoneNumber(data.phoneNumber || "");
        }

        if (data.serviceType === "CAR_RENTAL") {
          setCarTypes((data.carTypes || []).join(", "));
        }
      } catch {
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const saveProfile = async () => {
    try {
      const payload = { name };

      if (serviceType === "DOCTOR") {
        payload.specialization = specialization;
        payload.experienceYears = Number(experienceYears);
      }

      if (serviceType === "SALOON") {
        payload.location = location;
        payload.phoneNumber = phoneNumber;
      }

      if (serviceType === "CAR_RENTAL") {
        payload.carTypes = carTypes.split(",").map((c) => c.trim());
      }

      await api.put("/providers/me", payload);
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">My Profile</h2>
          <p className="text-gray-500">{serviceType}</p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={saveProfile}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* CARD */}
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        {/* COMMON INFO */}
        <section>
          <h3 className="font-semibold mb-3">Basic Information</h3>

          <div className="grid gap-4">
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <input
                className="border w-full p-2 rounded"
                value={name}
                disabled={!isEditing}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                className="border w-full p-2 rounded bg-gray-100"
                value={email}
                disabled
              />
            </div>
          </div>
        </section>

        {/* DOCTOR */}
        {serviceType === "DOCTOR" && (
          <section>
            <h3 className="font-semibold mb-3">Doctor Details</h3>

            <div className="grid gap-4">
              <div>
                <label className="text-sm text-gray-600">
                  Specialization
                </label>
                <input
                  className="border w-full p-2 rounded"
                  value={specialization}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setSpecialization(e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Experience (years)
                </label>
                <input
                  type="number"
                  className="border w-full p-2 rounded"
                  value={experienceYears}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setExperienceYears(e.target.value)
                  }
                />
              </div>
            </div>
          </section>
        )}

        {/* SALOON */}
        {serviceType === "SALOON" && (
          <section>
            <h3 className="font-semibold mb-3">Saloon Details</h3>

            <div className="grid gap-4">
              <div>
                <label className="text-sm text-gray-600">Location</label>
                <input
                  className="border w-full p-2 rounded"
                  value={location}
                  disabled={!isEditing}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Phone Number</label>
                <input
                  className="border w-full p-2 rounded"
                  value={phoneNumber}
                  disabled={!isEditing}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
          </section>
        )}


        {/* CAR RENTAL */}
        {serviceType === "CAR_RENTAL" && (
          <section>
            <h3 className="font-semibold mb-3">
              Car Rental Details
            </h3>

            <div>
              <label className="text-sm text-gray-600">
                Car Types
              </label>
              <input
                className="border w-full p-2 rounded"
                placeholder="SUV, Sedan, Hatchback"
                value={carTypes}
                disabled={!isEditing}
                onChange={(e) =>
                  setCarTypes(e.target.value)
                }
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Profile;
