"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type User = {
  id: string
  name: string
  email: string
  password: string
}

export function SettingsForm() {
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "Admin User", email: "admin@aryanproducts.com", password: "admin123" },
    { id: "2", name: "John Doe", email: "john@aryanproducts.com", password: "john123" },
  ])
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "" })

  const [companyInfo, setCompanyInfo] = useState({
    name: "Aryan Products",
    address: "123 Business Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    phone: "+91 98765 43210",
    email: "info@aryanproducts.com",
    gstin: "27AABCU9603R1ZX",
    pan: "AABCU9603R",
  })

  const [bankInfo, setBankInfo] = useState({
    bankName: "HDFC Bank",
    accountNumber: "1234567890",
    ifsc: "HDFC0001234",
    branch: "Mumbai Main Branch",
  })

  const [invoiceSettings, setInvoiceSettings] = useState({
    invoicePrefix: "INV",
    termsAndConditions: "Payment due within 30 days. Late payments may incur charges.",
    footer: "Thank you for your business!",
    taxType: "GST",
  })

  const handleSave = () => {
    console.log("[v0] Settings saved", { companyInfo, bankInfo, invoiceSettings })
    alert("Settings saved successfully!")
  }

  const handleAddUser = () => {
    setEditingUser(null)
    setUserForm({ name: "", email: "", password: "" })
    setUserDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setUserForm({ name: user.name, email: user.email, password: user.password })
    setUserDialogOpen(true)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== userId))
    }
  }

  const handleSaveUser = () => {
    if (!userForm.name || !userForm.email || !userForm.password) {
      alert("Please fill all fields")
      return
    }

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...editingUser, ...userForm } : u))
    } else {
      const newUser: User = {
        id: String(Date.now()),
        ...userForm
      }
      setUsers([...users, newUser])
    }
    setUserDialogOpen(false)
    setUserForm({ name: "", email: "", password: "" })
  }

  return (
    <Tabs defaultValue="company" className="space-y-4">
      <TabsList>
        <TabsTrigger value="company">Company Information</TabsTrigger>
        <TabsTrigger value="bank">Bank Details</TabsTrigger>
        <TabsTrigger value="invoice">Invoice Settings</TabsTrigger>
        <TabsTrigger value="users">User Management</TabsTrigger>
      </TabsList>

      <TabsContent value="company">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Update your company details that appear on invoices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name*</Label>
              <Input
                id="companyName"
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address*</Label>
              <Textarea
                id="address"
                value={companyInfo.address}
                onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City*</Label>
                <Input
                  id="city"
                  value={companyInfo.city}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State*</Label>
                <Input
                  id="state"
                  value={companyInfo.state}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, state: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode*</Label>
                <Input
                  id="pincode"
                  value={companyInfo.pincode}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, pincode: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone*</Label>
                <Input
                  id="phone"
                  value={companyInfo.phone}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gstin">GSTIN*</Label>
                <Input
                  id="gstin"
                  value={companyInfo.gstin}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, gstin: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan">PAN*</Label>
                <Input
                  id="pan"
                  value={companyInfo.pan}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, pan: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="bank">
        <Card>
          <CardHeader>
            <CardTitle>Bank Account Details</CardTitle>
            <CardDescription>Configure bank account information for payment processing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name*</Label>
                <Input
                  id="bankName"
                  value={bankInfo.bankName}
                  onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch*</Label>
                <Input
                  id="branch"
                  value={bankInfo.branch}
                  onChange={(e) => setBankInfo({ ...bankInfo, branch: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number*</Label>
                <Input
                  id="accountNumber"
                  value={bankInfo.accountNumber}
                  onChange={(e) => setBankInfo({ ...bankInfo, accountNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifsc">IFSC Code*</Label>
                <Input
                  id="ifsc"
                  value={bankInfo.ifsc}
                  onChange={(e) => setBankInfo({ ...bankInfo, ifsc: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="invoice">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Settings</CardTitle>
            <CardDescription>Customize invoice templates and numbering</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoicePrefix">Invoice Number Prefix*</Label>
                <Input
                  id="invoicePrefix"
                  value={invoiceSettings.invoicePrefix}
                  onChange={(e) => setInvoiceSettings({ ...invoiceSettings, invoicePrefix: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxType">Tax Type*</Label>
                <Select
                  value={invoiceSettings.taxType}
                  onValueChange={(value) => setInvoiceSettings({ ...invoiceSettings, taxType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GST">GST</SelectItem>
                    <SelectItem value="VAT">VAT</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="terms">Terms and Conditions</Label>
              <Textarea
                id="terms"
                value={invoiceSettings.termsAndConditions}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, termsAndConditions: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="footer">Invoice Footer Text</Label>
              <Input
                id="footer"
                value={invoiceSettings.footer}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, footer: e.target.value })}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="users">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </div>
              <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAddUser}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
                    <DialogDescription>
                      {editingUser ? "Update user information" : "Create a new user account"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="userName">Name*</Label>
                      <Input
                        id="userName"
                        value={userForm.name}
                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userEmail">Email*</Label>
                      <Input
                        id="userEmail"
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        placeholder="Enter email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userPassword">Password*</Label>
                      <Input
                        id="userPassword"
                        type="password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                        placeholder="Enter password"
                      />
                    </div>
                    <div className="flex gap-4 justify-end pt-4">
                      <Button variant="outline" onClick={() => setUserDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveUser}>
                        {editingUser ? "Update User" : "Add User"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditUser(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
