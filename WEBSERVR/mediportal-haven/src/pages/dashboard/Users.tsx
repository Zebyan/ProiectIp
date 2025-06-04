import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  frontendRoleToBackend,
  backendRoleToFrontend,
  UserRole,
} from "@/utils/permissions";

type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  status: "Active" | "Inactive";
};

// Updated sample users with permissions
const SAMPLE_USERS: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@biomedbot.hospital",
    role: "Administrator",
    permissions: [
      "manage_users",
      "manage_patients",
      "manage_medications",
      "manage_transports",
      "view_logs",
    ],
    status: "Active",
  },
  {
    id: 2,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@biomedbot.hospital",
    role: "Doctor",
    permissions: ["manage_patients", "manage_medications", "view_logs"],
    status: "Active",
  },
  {
    id: 3,
    name: "Robert Chen",
    email: "robert.chen@biomedbot.hospital",
    role: "Pharmacist",
    permissions: ["manage_medications", "view_logs"],
    status: "Active",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@biomedbot.hospital",
    role: "Nurse",
    permissions: ["view_patients", "view_medications", "view_logs"],
    status: "Inactive",
  },
  {
    id: 5,
    name: "Michael Thompson",
    email: "michael.thompson@biomedbot.hospital",
    role: "Transport Tech",
    permissions: ["manage_transports", "view_logs"],
    status: "Active",
  },
  {
    id: 6,
    name: "Lisa Carter",
    email: "lisa.carter@biomedbot.hospital",
    role: "Receptionist",
    permissions: ["add_patients", "assign_beds", "view_patients"],
    status: "Active",
  },
];

// Predefined roles with their permissions
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  Administrator: [
    "manage_users",
    "manage_patients",
    "manage_medications",
    "manage_transports",
    "view_logs",
  ],
  Doctor: ["manage_patients", "manage_medications", "view_logs"],
  Nurse: ["view_patients", "view_medications", "view_logs"],
  Pharmacist: ["manage_medications", "view_logs"],
  "Transport Tech": ["manage_transports", "view_logs"],
  Receptionist: ["add_patients", "assign_beds", "view_patients"],
};

const getCurrentUserRole = (): UserRole | undefined => {
  // Try to get the role from localStorage (set at login)
  const role = localStorage.getItem("userRole");
  if (!role) return undefined;
  return role as UserRole;
};

const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<
    Partial<User> & { nume?: string; prenume?: string }
  >({
    nume: "",
    prenume: "",
    email: "",
    role: "Nurse",
    status: "Active",
  });
  const currentUserRole = getCurrentUserRole();

  React.useEffect(() => {
    type BackendUser = {
      rol: string;
      nume: string;
      prenume: string;
      email: string;
    };
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      const authToken = localStorage.getItem("authToken");
      const tokenType = localStorage.getItem("tokenType") || "Bearer";
      const finalToken = authToken || token;
      if (!finalToken) return;
      try {
        const response = await fetch("http://132.220.27.51/angajati", {
          headers: {
            Authorization: `${tokenType} ${finalToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        const data: BackendUser[] = await response.json();
        // data is an array of { rol, nume, prenume, email }
        const mappedUsers: User[] = data.map((u, idx) => {
          const role = backendRoleToFrontend(u.rol) || "Receptionist";
          return {
            id: idx + 1,
            name: `${u.nume} ${u.prenume}`,
            email: u.email,
            role,
            permissions: ROLE_PERMISSIONS[role] || [],
            status: "Active",
          };
        });
        setUsers(mappedUsers);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
      }
    };
    fetchUsers();
  }, [toast]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusToggle = (userId: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === userId) {
          const newStatus = user.status === "Active" ? "Inactive" : "Active";
          toast({
            title: `User ${newStatus}`,
            description: `${user.name} is now ${newStatus.toLowerCase()}`,
          });
          return { ...user, status: newStatus };
        }
        return user;
      })
    );
  };

  const handleAddUser = async () => {
    if (!newUser.nume || !newUser.prenume || !newUser.email || !newUser.role) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    try {
      const backendRole = frontendRoleToBackend(newUser.role as UserRole);
      if (!backendRole) throw new Error("Invalid role");
      const token = localStorage.getItem("token");
      const authToken = localStorage.getItem("authToken");
      const tokenType = localStorage.getItem("tokenType") || "Bearer";
      const finalToken = authToken || token;
      if (!finalToken) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You need to be logged in to create users",
        });
        return;
      }
      const response = await fetch("http://132.220.27.51/angajati", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${tokenType} ${finalToken}`,
        },
        body: JSON.stringify({
          rol: backendRole,
          nume: newUser.nume,
          prenume: newUser.prenume,
          email: newUser.email,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to create user");
      }
      const created = await response.json();
      // Add to local state (id is generated locally for FE purposes)
      const newUserId = Math.max(...users.map((u) => u.id)) + 1;
      const userRole = newUser.role as UserRole;
      const createdUser: User = {
        id: newUserId,
        name: `${newUser.nume} ${newUser.prenume}`,
        email: newUser.email!,
        role: userRole,
        permissions: ROLE_PERMISSIONS[userRole] || [],
        status: (newUser.status as "Active" | "Inactive") || "Active",
      };
      setUsers([...users, createdUser]);
      setNewUser({
        nume: "",
        prenume: "",
        email: "",
        role: "Nurse",
        status: "Active",
      });
      setIsAddUserModalOpen(false);
      toast({
        title: "User Created",
        description: `${createdUser.name} has been added as a ${createdUser.role}`,
      });
    } catch (err: unknown) {
      let message = "Failed to create user";
      if (err instanceof Error) message = err.message;
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setNewUser((prev) => ({ ...prev, role: value as UserRole }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
        <p className="text-gray-600 mt-1">
          Manage system users and their permissions
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage user accounts and access permissions
              </CardDescription>
            </div>
            {currentUserRole === "Administrator" && (
              <div className="flex-shrink-0">
                <Button onClick={() => setIsAddUserModalOpen(true)}>
                  Add New User
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="search">Search Users</Label>
            <Input
              id="search"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Role</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            user.role === "Administrator"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "Doctor"
                              ? "bg-blue-100 text-blue-800"
                              : user.role === "Pharmacist"
                              ? "bg-green-100 text-green-800"
                              : user.role === "Nurse"
                              ? "bg-pink-100 text-pink-800"
                              : user.role === "Transport Tech"
                              ? "bg-yellow-100 text-yellow-800"
                              : user.role === "Receptionist"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Edit User",
                                description: `Editing ${user.name} will be available soon.`,
                              });
                            }}
                          >
                            Edit
                          </Button>

                          <Button
                            variant={
                              user.status === "Active" ? "outline" : "default"
                            }
                            size="sm"
                            onClick={() => handleStatusToggle(user.id)}
                          >
                            {user.status === "Active"
                              ? "Deactivate"
                              : "Activate"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500">
                      No users found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New User</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nume">Last Name</Label>
                <Input
                  id="nume"
                  name="nume"
                  value={newUser.nume}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <Label htmlFor="prenume">First Name</Label>
                <Input
                  id="prenume"
                  name="prenume"
                  value={newUser.prenume}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role as string}
                  onValueChange={(value) =>
                    setNewUser((prev) => ({ ...prev, role: value as UserRole }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrator">Administrator</SelectItem>
                    <SelectItem value="Doctor">Doctor</SelectItem>
                    <SelectItem value="Nurse">Nurse</SelectItem>
                    <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                    <SelectItem value="Transport Tech">
                      Transport Tech
                    </SelectItem>
                    <SelectItem value="Receptionist">Receptionist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAddUserModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>Add User</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
