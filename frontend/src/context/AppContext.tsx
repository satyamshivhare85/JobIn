"use client";

import { AppContextType, AppProviderProps, Company, User } from "@/type";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import Cookies from "js-cookie"
import axios from "axios";
export const utils_service = "http://localhost:5001";
export const auth_service = "http://localhost:5000"
export const user_service = "http://localhost:5002"
export const job_service = "http://localhost:5003"

const AppContext = createContext<AppContextType | undefined>(undefined);


export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const token = Cookies.get("token");

  async function fetchUser() {
    try {
      const { data } = await axios.get(`${user_service}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      setUser(data);
      setIsAuth(true);

    }
    catch (error) {
      console.log(error);
      setIsAuth(false);
    }
    finally {
      setLoading(false);
    }
  }

  async function updateProfilePic(fromData: any) {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${user_service}/api/user/updatePic`,
        fromData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message);
      fetchUser();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
    finally {
      setLoading(false);
    }
  }

  async function updateResume(fromData: any) {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${user_service}/api/user/resume`,
        fromData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message);
      fetchUser();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
    finally {
      setLoading(false);
    }
  }

  async function updateUser(name: string, phoneNumber: string, bio: string) {
    try {
      setBtnLoading(true);
      const { data } = await axios.put(
        `${user_service}/api/user/update/profile`,
        { name, phoneNumber, bio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message);
      fetchUser();

    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
    finally {
      setBtnLoading(false);
    }
  }


  async function logoutUser() {
    Cookies.remove("token");
    setUser(null);
    setIsAuth(false);
    toast.success("Logged out successfully");
  }

  async function addSkill(skill: string, setSkill: React.Dispatch<React.SetStateAction<string>>) {
    try {
      setBtnLoading(true);
      const { data } = await axios.post(`${user_service}/api/user/skill/add`,
        { skillName: skill },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message)
      fetchUser()
      setSkill("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
    finally {
      setBtnLoading(false);
    }
  }


  async function removeSkill(skill: string) {
    try {
      setBtnLoading(true);
      const { data } = await axios.put(
        `${user_service}/api/user/skill/delete`,
        { skillName: skill },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message);
      fetchUser();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  }

  async function fetchCompanies() {
    try {
      const { data } = await axios.get(`${job_service}/api/job/company/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCompanies(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function addCompany(formData: FormData): Promise<boolean> {
    try {
      setBtnLoading(true);
      const { data } = await axios.post(
        `${job_service}/api/job/company/new`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message);
      fetchCompanies();
      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return false;
    } finally {
      setBtnLoading(false);
    }
  }

  async function deleteCompany(companyId: number) {
    try {
      setBtnLoading(true);
      const { data } = await axios.delete(
        `${job_service}/api/job/company/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message);
      fetchCompanies();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  }


  useEffect(() => {
    fetchUser()
  }, []);

  return (
    <AppContext.Provider value={{
      user, loading, btnLoading, setUser, isAuth, setIsAuth, setLoading,
      logoutUser, updateProfilePic, updateResume, updateUser,
      addSkill, removeSkill,
      companies, fetchCompanies, addCompany, deleteCompany
    }}>
      {children}
      <Toaster />
    </AppContext.Provider>
  );
};


export const useAppData = (): AppContextType => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppData must be used within AppProvider")
  }
  return context;
}