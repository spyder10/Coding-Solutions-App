import React from "react";
import { useState } from "react";
import AdminStriverPage from "./adminPages/AdminStriverPage";
import AdminLoveBabbarPage from "./adminPages/AdminLoveBabbarPage";
import AdminInterviewBitPage from "./adminPages/AdminInterviewBitPage";

export default function AdminPages(props) {
  return (
    <>
      {props.tableName === "1" && <AdminStriverPage></AdminStriverPage>}
      {props.tableName === "2" && <AdminLoveBabbarPage></AdminLoveBabbarPage>}
      {props.tableName === "3" && (
        <AdminInterviewBitPage></AdminInterviewBitPage>
      )}
    </>
  );
}
