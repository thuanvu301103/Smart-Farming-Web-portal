import React, { useEffect, useState } from "react";
// Import components
import Tabnav from "../components/Tabnav";
// Import pages
import ScriptCode from "./script/scriptCode/ScriptCode";
import ScriptComment from "./ScriptComment";
import VersionCompare from "./script/versionCompare/VersionCompare";
// Import Icons
import CodeIcon from "@mui/icons-material/Code";
import CommentIcon from "@mui/icons-material/Comment";
import DifferenceOutlinedIcon from '@mui/icons-material/DifferenceOutlined';
// Translation
import { useTranslation } from "react-i18next";
// React Router DOM
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Script = () => {
  const { t } = useTranslation();
  // Get scriptId and userId
  const { userId, scriptId } = useParams();
  // Navigation
  const navigation = useNavigate();

  // Tab data
  const tabdata = [
    {
      icon: <CodeIcon />,
      value: "code",
      path: "./code",
      label: t("tab.code"),
      element: <ScriptCode />,
    },
    {
      icon: <CommentIcon />,
      value: "comment",
      path: "./comment",
      label: t("tab.comment"),
      element: <ScriptComment />,
    },
    {
        icon: <DifferenceOutlinedIcon />,
      value: "compare",
      path: "./compare",
      label: t("tab.compare"),
        element: <VersionCompare />,
    },
  ];

  return (
    <div>
      <Tabnav data={tabdata} />
      <Routes>
        {tabdata
          ? tabdata.map((item, index) => (
              <Route
                key={index}
                path={item?.value ? item.value : null}
                element={item?.element ? item.element : null}
              />
            ))
          : null}
      </Routes>
    </div>
  );
};

export default Script;
