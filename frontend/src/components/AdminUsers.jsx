import { useEffect, useState } from "react";
import api from '../app/axios'
import { useSelector } from "react-redux";


const AdminUsers = () => {
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  
  console.log("AdminUsers mounted, user:", user);
  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data.users);
    } catch (error) {
      setError("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  // Повысить до админа
  const promoteToAdmin = async (id) => {
    try {
      await api.patch("/api/admin/check", { userId: id });
      setMessage("User promoted successfully");
      fetchUsers(); // обновим список
    } catch (error) {
      setError("Failed to promote user", error);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers();
    } else {
      setError("Access denied: Admin only");
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel – Users</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}

      {!loading && users.length > 0 && (
        <table className="table w-full border mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                <td>
                  {u.role !== "admin" ? (
                    <button
                      onClick={() => promoteToAdmin(u.id)}
                      className="btn btn-sm btn-success"
                    >
                      Promote
                    </button>
                  ) : (
                    <span className="text-gray-500">Already Admin</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
