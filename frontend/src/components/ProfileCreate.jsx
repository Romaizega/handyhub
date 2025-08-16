import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewProfile } from "../features/profiles/profileThunk";

const ProfileCreate = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((s) => s.profile);
  const [display_name, setDisplayName] = useState("");
  const [city, setCity] = useState("");
  const [about, setAbout] = useState("");
  const [avatar_url, setAvatarUrl] = useState("");
  const [skills, setSkills] = useState("");
  const [hourly_rate, setHourlyRate] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createNewProfile({
        display_name,
        city,
        about,
        avatar_url,
        skills,
        hourly_rate: Number(hourly_rate) || null,
      })
    );
  };
  return (
    <div className="max-w-lg mx-auto mt-10">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-xl font-bold mb-4">Create your profile</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Display name"
              className="input input-bordered w-full"
              value={display_name}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <input
              type="text"
              placeholder="City"
              className="input input-bordered w-full"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <textarea
              placeholder="About"
              className="textarea textarea-bordered w-full"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
            <input
              type="text"
              placeholder="Avatar URL"
              className="input input-bordered w-full"
              value={avatar_url}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
            <input
              type="text"
              placeholder="Skills (comma separated)"
              className="input input-bordered w-full"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
            <input
              type="number"
              placeholder="Hourly rate"
              className="input input-bordered w-full"
              value={hourly_rate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error.message || String(error)}</p>}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Saving..." : "Create Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


export default ProfileCreate