import React, { ReactNode } from "react";

export interface JobOptions {
  title: string;
  responsibilities: string;
  why: string;
}

export interface skillsToLearn {
  title: string;
  why: string;
  how: string;
}

export interface SkillCategory {
  category: string;
  skills: skillsToLearn[];
}

export interface LearningApproach {
  title: string;
  points: string[];
}

export interface CareerGuideResponse {
  summary: string;
  jobOptions: JobOptions[];
  skillsToLearn: SkillCategory[];
 learningApproach: LearningApproach;
}


export interface ScoreBreakdown{
  formatting:{score:number;feedback:string};
  keywords:{score:number;feedback:string};
  structure:{score:number;feedback:string};
  readability:{score:number;feedback:string}; 
}


export interface Suggestion{
category:string;
issue:string;
recommendation:string;
priority:"high" | "medium"| "low";
}

export interface ResumeAnalysisResponse{
  atsScore:number;
 scoreBreakdown:ScoreBreakdown;
 suggestions:Suggestion[];
 strengths:string[];
 summary:string;
}



export interface User{
   user_id: number;
    name: string;
    email: string;
    phone_number: string;
    role: "jobseeker" | "recruiter";
    bio: string | null;
    resume: string | null;
    resume_public_id: string | null;
    profile_pic: string | null;
    profile_pic_public_id: string | null;
    skills: string[];
    subscription: string | null;
}

// export interface AppContextType{
//   user:User|null;
//   loading:boolean;
//   btnLoading:boolean;
//   isAuth:boolean;
//   setUser:React.Dispatch<React.SetStateAction<User|null>>
//   setLoading:React.Dispatch<React.SetStateAction<boolean>>
//   setIsAuth:React.Dispatch<React.SetStateAction<boolean>>
//   logoutUser :() => Promise<void>;
//   updateProfilePic:(FormData:any)=>Promise<void>;
//   updateResume:(FormData:any)=>Promise<void>;
//   updateUser:(name: string, phoneNumber: string, bio: string)=>Promise<void>;
//   addSkill:(skill:string,
//     setSkill:React.Dispatch<React.SetStateAction<string>>
//   )=>Promise<void>;
//   removeSkill:(skill:string)=>Promise<void>;
//    companies: Company[];
//   fetchCompanies: () => Promise<void>;
//   addCompany: (formData: FormData) => Promise<boolean>;
  
// }

export interface AppContextType{
  user:User|null;
  loading:boolean;
  btnLoading:boolean;
  isAuth:boolean;
  setUser:React.Dispatch<React.SetStateAction<User|null>>
  setLoading:React.Dispatch<React.SetStateAction<boolean>>
  setIsAuth:React.Dispatch<React.SetStateAction<boolean>>
  logoutUser :() => Promise<void>;
  updateProfilePic:(FormData:any)=>Promise<void>;
  updateResume:(FormData:any)=>Promise<void>;
  updateUser:(name: string, phoneNumber: string, bio: string)=>Promise<void>;
  addSkill:(skill:string,
    setSkill:React.Dispatch<React.SetStateAction<string>>
  )=>Promise<void>;
  removeSkill:(skill:string)=>Promise<void>;
companies: Company[];
  fetchCompanies: () => Promise<void>;
  addCompany: (formData: FormData) => Promise<boolean>;
  deleteCompany: (companyId: number) => Promise<void>;
}

export interface AppProviderProps{
  children:ReactNode;
}

export interface AccountProps{
  user:User;
  isYourAccount:boolean;
}

export interface Company {
  company_id: number;
  name: string;
  description: string;
  website: string;
  logo: string;
  logo_public_id: string;
  recruiter_id: number;
}