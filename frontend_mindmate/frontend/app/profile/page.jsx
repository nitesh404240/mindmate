"use client";

import { useEffect, useRef, useState } from "react";
import { axiosinstance } from "@/app/lib/axios";
import { useAuthStore } from "../store/useAuthStore";

export default function ProfilePage() {

const fileInputRef = useRef(null);

const { checkAuth, authUser } = useAuthStore();

const [loading,setLoading] = useState(true);

const [username,setUsername] = useState("");
const [avatar,setAvatar] = useState(null);
const [avatarPreview,setAvatarPreview] = useState("");

const [address,setAddress] = useState({
fullName:"",
phone:"",
street:"",
city:"",
state:"",
pincode:""
});

const [passwordData,setPasswordData] = useState({
oldpassword:"",
newpassword:""
});


// FETCH USER

useEffect(()=>{

checkAuth();

},[]);


useEffect(()=>{

if(authUser){

setUsername(authUser.Username || "");
setAvatarPreview(authUser.Avatar || "");

if(authUser.address){
setAddress(authUser.address);
}

setLoading(false);

}

},[authUser]);



// PROFILE UPDATE

const handleProfileUpdate = async()=>{

const formData = new FormData();

formData.append("Username",username);

if(avatar){
formData.append("Avatar",avatar);
}

await axiosinstance.patch(
"/users/update-profile",
formData,
{withCredentials:true}
);

alert("Profile Updated");

};



// ADDRESS UPDATE

const handleAddressUpdate = async()=>{

await axiosinstance.patch(
"/users/change-address",
address,
{withCredentials:true}
);

alert("Address Updated");

};



// PASSWORD CHANGE

const handlePasswordChange = async()=>{

await axiosinstance.patch(
"/users/change-password",
passwordData,
{withCredentials:true}
);

alert("Password Changed");

};



if(loading){
return(
<div className="h-screen flex items-center justify-center text-white">
Loading Profile...
</div>
);
}



return(

<div className="min-h-screen bg-[#0d1117] text-white pt-28 px-6">

<div className="max-w-5xl mx-auto space-y-12">

<h1 className="text-4xl font-bold">Profile Settings</h1>


{/* PROFILE */}

<div className="bg-[#151921] p-8 rounded-xl">

<h2 className="text-xl font-semibold mb-6">Profile</h2>

<div className="flex items-center gap-6 mb-6">

<div
className="relative group cursor-pointer"
onClick={()=>fileInputRef.current.click()}
>

<img
src={avatarPreview || "/avatar.png"}
className="w-24 h-24 rounded-full object-cover border-2 border-slate-700 shadow-lg"
/>

<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition">

<span className="text-sm">Change</span>

</div>

</div>


<input
type="file"
ref={fileInputRef}
className="hidden"
onChange={(e)=>{

const file = e.target.files[0];

setAvatar(file);

if(file){
setAvatarPreview(URL.createObjectURL(file));
}

}}
/>

</div>


<input
type="text"
placeholder="Username"
className="w-full p-3 bg-[#0d1117] border border-slate-700 rounded"
value={username}
onChange={(e)=>setUsername(e.target.value)}
/>

<button
onClick={handleProfileUpdate}
className="mt-4 bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg"
>
Update Profile
</button>

</div>



{/* ADDRESS */}

<div className="bg-[#151921] p-8 rounded-xl">

<h2 className="text-xl font-semibold mb-6">Address</h2>

<div className="grid md:grid-cols-2 gap-4">

<input
placeholder="Full Name"
className="p-3 bg-[#0d1117] border border-slate-700 rounded"
value={address.fullName}
onChange={(e)=>setAddress({...address,fullName:e.target.value})}
/>

<input
placeholder="Phone"
className="p-3 bg-[#0d1117] border border-slate-700 rounded"
value={address.phone}
onChange={(e)=>setAddress({...address,phone:e.target.value})}
/>

<input
placeholder="Street"
className="p-3 bg-[#0d1117] border border-slate-700 rounded md:col-span-2"
value={address.street}
onChange={(e)=>setAddress({...address,street:e.target.value})}
/>

<input
placeholder="City"
className="p-3 bg-[#0d1117] border border-slate-700 rounded"
value={address.city}
onChange={(e)=>setAddress({...address,city:e.target.value})}
/>

<input
placeholder="State"
className="p-3 bg-[#0d1117] border border-slate-700 rounded"
value={address.state}
onChange={(e)=>setAddress({...address,state:e.target.value})}
/>

<input
placeholder="Pincode"
className="p-3 bg-[#0d1117] border border-slate-700 rounded"
value={address.pincode}
onChange={(e)=>setAddress({...address,pincode:e.target.value})}
/>

</div>

<button
onClick={handleAddressUpdate}
className="mt-5 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg"
>
Save Address
</button>

</div>



{/* PASSWORD */}

<div className="bg-[#151921] p-8 rounded-xl">

<h2 className="text-xl font-semibold mb-6">Change Password</h2>

<div className="grid md:grid-cols-2 gap-4">

<input
type="password"
placeholder="Old Password"
className="p-3 bg-[#0d1117] border border-slate-700 rounded"
value={passwordData.oldpassword}
onChange={(e)=>setPasswordData({
...passwordData,
oldpassword:e.target.value
})}
/>

<input
type="password"
placeholder="New Password"
className="p-3 bg-[#0d1117] border border-slate-700 rounded"
value={passwordData.newpassword}
onChange={(e)=>setPasswordData({
...passwordData,
newpassword:e.target.value
})}
/>

</div>

<button
onClick={handlePasswordChange}
className="mt-5 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg"
>
Change Password
</button>

</div>

</div>

</div>

);

}