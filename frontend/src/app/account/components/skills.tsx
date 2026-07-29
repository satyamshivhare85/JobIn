"use client"
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { useAppData } from '@/context/AppContext';
import { AccountProps } from '@/type';
import { Button, Input } from '@base-ui/react';
import { Award, Plus, Sparkle, X } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const Skills:React.FC<AccountProps>= ({user,isYourAccount}) => {
    const {addSkill,removeSkill,btnLoading}=useAppData();
    const[skill,setSkill]=useState("");

    const addSkillHandler=()=>{
        if(!skill.trim()){
            alert("please enter a skill");
            return;
        }
        addSkill(skill,setSkill);
       
    }
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>)=>{
  if(e.key === "Enter"){
    addSkillHandler()
  }
}

// const removeSkillHandler = (skillToRemove: string) => {
//   if (confirm(`Are you sure you want to remove ${skillToRemove} ?`)) {
//     removeSkill(skillToRemove);
//   }
// };

const removeSkillHandler = (skillToRemove: string) => {
  toast((t) => (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">
        Remove <b>{skillToRemove}</b> from your skills?
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
            removeSkill(skillToRemove);
          }}
          className="px-3 py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600"
        >
          Remove
        </button>
      </div>
    </div>
  ), { duration: 6000 });
};
  return (
    


    <div className="max-w-5xl mx-auto px-4 py-6">
  <Card className="shadow-lg border-2 overflow-hidden">
    <div className="bg-blue-500 p-6 border-b">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <Award size={20} className="text-blue-600" />
        </div>
         <CardTitle className="text-2xl text-white">
  {isYourAccount ? "Your Skills" : `${user.name}'s Skills`}
</CardTitle>
{isYourAccount && (
  <CardDescription className="text-sm mt-1 text-white">
    Showcase your expertise and abilities
  </CardDescription>
)}
      </div>
     


    </div>

  {/* Add skills input */}
{isYourAccount && (
  <div className="p-6">
    <div className="flex gap-3 flex-col sm:flex-row">

      <div className="relative flex-1">
        <Sparkle
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
        />

        <Input
          type="text"
          placeholder="e.g. React, Node.js, Python..."
          className="h-11 pl-10"
          value={skill}
          onChange={(e)=>setSkill(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>


      <Button
        onClick={addSkillHandler}
        className="h-11 gap-2 px-6"
        disabled={!skill.trim() || btnLoading}
      >
        <Plus size={18}/>
        {btnLoading ? "Adding..." : "Add Skill"}
      </Button>

    </div>
  </div>
)}


{/* Skills Display */}
<CardContent className="p-6">
  {user.skills && user.skills.length > 0 ? <div className="flex flex-wrap
gap-3">{user.skills.map((e,i)=>(
    <div className="group relative inline-flex items-center gap-2
border-2 rounded-full hover:shadow-sm duration-200 transition-all pl-4 pr-3 py-2"
    key={i}>
      <span className='font-medium text-sm'>{e}</span>
    {isYourAccount && (
  <button
    onClick={() => removeSkillHandler(e)}
    disabled={btnLoading}
    className="h-6 w-6 rounded-full text-red-500 flex items-center justify-evenly transition-all hover:bg-gray-600 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <X size={14} />
  </button>
)}
    </div>
  ))}</div>:<>
  <div className="flex items-center justify-center py-10">
  <p className="text-gray-500 text-lg font-medium">
    {isYourAccount ? "No skills added yet." : "This user hasn't added any skills yet."}
  </p>
</div>
  </>}
</CardContent>

  </Card>
</div>
  )
}

export default Skills;