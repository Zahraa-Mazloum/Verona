import React, { useEffect, useState } from "react";
import { CssBaseline, Box, Typography } from "@mui/material";
import Sidebar from '../components/sidebar/Sidebar';
import Header from './Header';
import "../App.css";

function Layout({ children }) {
  const [userRole, setUserRole] = useState(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar open={open} setOpen={setOpen} userRole={userRole} />
      <Box sx={{ flexGrow: 2, paddingLeft: open ? '240px' : '40px', transition: 'padding-left 0.9s' }}>
        <Header open={open} />
        <Box sx={{ mt: 8 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
