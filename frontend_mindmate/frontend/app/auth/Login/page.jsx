
"use client";

import { Suspense } from "react";
import LoginContent from "../../../components/LoginContent"; 
export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}