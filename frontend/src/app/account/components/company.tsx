"use client";
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { useAppData } from '@/context/AppContext';
import { Button, Input } from '@base-ui/react';
import { Building2, ImagePlus, Plus, Trash2, X, Globe } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface CompanyProps {
  isYourAccount: boolean;
}

const Company: React.FC<CompanyProps> = ({ isYourAccount }) => {
  const { companies, fetchCompanies, addCompany, deleteCompany, btnLoading } = useAppData();

  const [showDialog, setShowDialog] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setWebsite("");
    setLogo(null);
    setLogoPreview(null);
  };

  const closeDialog = () => {
    setShowDialog(false);
    resetForm();
  };

  const submitHandler = async () => {
    if (!name.trim() || !description.trim() || !website.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    if (!logo) {
      toast.error("Company logo is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("website", website.trim());
    formData.append("file", logo);

    const success = await addCompany(formData);
    if (success) {
      closeDialog();
    }
  };

  const deleteHandler = (companyId: number, companyName: string) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">
          Delete <b>{companyName}</b>? All its jobs will be removed too.
        </span>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-xs rounded-md border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              deleteCompany(companyId);
            }}
            className="px-3 py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 6000 });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Card className="shadow-lg border-2 overflow-hidden">
        <div className="bg-blue-500 p-6 border-b flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Building2 size={20} className="text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl text-white">
                {isYourAccount ? "Your Companies" : "Companies"}
              </CardTitle>
              <CardDescription className="text-sm mt-1 text-white">
                {isYourAccount ? "Manage companies you've registered" : "Companies posting jobs here"}
              </CardDescription>
            </div>
          </div>

          {isYourAccount && (
            <Button
              onClick={() => setShowDialog(true)}
              className="h-10 gap-2 px-4 bg-white text-blue-600 hover:bg-gray-100"
            >
              <Plus size={16} />
              Add Company
            </Button>
          )}
        </div>

        <CardContent className="p-6">
          {companies && companies.length > 0 ? (
            <div className="flex flex-col gap-4">
              {companies.map((company) => (
                <div
                  key={company.company_id}
                  className="flex items-center gap-4 border-2 rounded-xl p-4 hover:shadow-sm transition-all"
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-14 w-14 rounded-lg object-cover border"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">{company.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{company.description}</p>
                    
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 flex items-center gap-1 mt-1 hover:underline w-fit"
                    >
                      <Globe size={12} />
                      {company.website}
                    </a>
                  </div>

                  {isYourAccount && (
                    <button
                      onClick={() => deleteHandler(company.company_id, company.name)}
                      disabled={btnLoading}
                      className="h-9 w-9 rounded-full text-red-500 flex items-center justify-center transition-all hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 gap-2">
              <Building2 size={32} className="opacity-30" />
              <p className="text-gray-500 text-base font-medium">No companies added yet.</p>
              {isYourAccount && (
                <p className="text-gray-400 text-sm">Add a company to start posting jobs.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      {isYourAccount && showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeDialog}
          />

          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h2 className="text-lg font-semibold">Add Company</h2>
              <button
                onClick={closeDialog}
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">

              <div className="flex flex-col items-center gap-3">
                <label
                  htmlFor="logo-upload"
                  className="h-24 w-24 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-500 transition-all"
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="logo preview" className="h-full w-full object-cover" />
                  ) : (
                    <ImagePlus size={24} className="opacity-50" />
                  )}
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                <span className="text-xs text-gray-500">Upload company logo</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Company Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  className="h-11"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Website</label>
                <Input
                  type="text"
                  placeholder="e.g. https://acme.com"
                  className="h-11"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  placeholder="What does your company do?"
                  className="min-h-[100px] rounded-md border p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex gap-3 mt-2">
                <Button
                  onClick={closeDialog}
                  className="h-11 flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitHandler}
                  className="h-11 flex-1 gap-2"
                  disabled={btnLoading}
                >
                  {btnLoading ? "Creating..." : "Create Company"}
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Company;