import { Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, authenticated } = useContext(AuthContext);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(true);
  }, []);
  if (checked && !authenticated) {
    return <Navigate to={"/"} replace />;
  }
  if (checked && user && allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={"/"} replace />;
  }
  return children;
}

export default ProtectedRoute;
