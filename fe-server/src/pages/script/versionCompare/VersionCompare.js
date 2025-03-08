import React, { useState, useEffect, useRef } from 'react';
// Component
import {
    Grid, Box, Menu, MenuItem,
    Typography,
    Button,
} from '@mui/material';
import Editor from "@monaco-editor/react"; // Code Editor
import * as monaco from "monaco-editor";
import { diffLines } from "diff";
// Icon
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
// Translation
import { useTranslation } from 'react-i18next';
// Theme
import { useTheme } from "@mui/material/styles";
// Hooks
import { useFetchScriptFile, useFetchScriptInfo } from '../../../hooks/useFetchScript';
// Router
import { useParams } from 'react-router-dom';
import './VersionCompare.css';


const VesionCompare = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const { userId, scriptId } = useParams();
    const leftEditorRef = useRef(null);
    const rightEditorRef = useRef(null);

    // Fetch version
    const { data: scriptInfo, setData: setScriptInfo, loading: scriptInfoLoading, error: scriptInfoError } = useFetchScriptInfo(userId, scriptId);
    const [version1, setVersion1] = useState(-1.0);
    const [version2, setVersion2] = useState(-1.0);
    useEffect(() => {
        const fetchData = async () => {
            //setVersion1(scriptInfo?.version[1] ? scriptInfo.version[1] : -1.0);
            setVersion2(scriptInfo?.version[0] ? scriptInfo.version[0] : -1.0);
        };
        fetchData();
        //if (version1 != -1.0 && version2 != -1.0) compareTexts();
    }, [scriptInfo]);

    // Fetch file data
    const { data: fileData1, setData: setFileData1, reload: reloadFileData1 } = useFetchScriptFile(userId, scriptId, version1);
    const { data: fileData2, setData: setFileData2, reload: reloadFileData2 } = useFetchScriptFile(userId, scriptId, version2);

    const [decorations, setDecorations] = useState([]);

    const normalizeText = (text) => {
        return text
            .replace(/\r\n/g, "\n") // Chuyển CRLF -> LF
            .split("\n")
            .map(line => line.trim().replace(/,$/, ""))
            .filter(line => line !== "")
            .join("\n")
            .trim();
    };

    // Hàm so sánh và highlight sự khác biệt
    const compareTexts = () => {
        if (!leftEditorRef.current || !rightEditorRef.current) return;
        //console.log("Last character ASCII - File 1:", fileData1.charCodeAt(fileData1.length - 1));
        //console.log("Last character ASCII - File 2:", fileData2.charCodeAt(fileData2.length - 1));
        
        const normalizedFileData1 = normalizeText(fileData1);
        const normalizedFileData2 = normalizeText(fileData2);
        const diffResult = diffLines(normalizedFileData1, normalizedFileData2);
        //console.log("Diff: ", diffResult);
        let leftDecorations = [];
        let rightDecorations = [];
        let lineNumber1 = 1;
        let lineNumber2 = 1;

        diffResult.forEach((part) => {
            let lines = part.value.split("\n").length;
            //console.log(part, lines);

            if (part.removed) {
                leftDecorations.push({
                    range: new monaco.Range(lineNumber1, 1, lineNumber1 + lines - 1, 1),
                    options: { className: "removed-line" },
                });
                //console.log("Remove: ", lineNumber1, 1, lineNumber1 + lines - 1, 1);
            } else if (part.added) {
                rightDecorations.push({
                    range: new monaco.Range(lineNumber2, 1, lineNumber2 + lines - 1, 1),
                    options: { className: "added-line" },
                });
                //console.log("Add: ", lineNumber2, 1, lineNumber2 + lines - 1, 1);
            }
            lineNumber1 += (!part.added && !part.removed) ? lines - 1 : (!part.added ? lines - 1 : 0);
            lineNumber2 += (!part.removed && !part.added) ? lines - 1 : (!part.removed ? lines - 1 : 0);
            console.log(lineNumber1, lineNumber2);
        });

        leftEditorRef.current.deltaDecorations([], leftDecorations);
        rightEditorRef.current.deltaDecorations([], rightDecorations);
        //console.log("Left: ", leftDecorations);
        //console.log("Right: ", rightDecorations);
    };

    useEffect(() => {
        if (fileData1 && fileData2) compareTexts();
    }, [fileData1, fileData2]);

    // Hanle Version Menu 1
    const [anchorElVersionMenu1, setAnchorElVersionMenu1] = useState(null);
    const openVersionMenu1 = Boolean(anchorElVersionMenu1);
    const handleClickVersionMenu1 = (e) => {
        setAnchorElVersionMenu1(e.currentTarget);
    };
    const handleCloseVersionMenu1 = () => {
        setAnchorElVersionMenu1(null);
    };

    // Hanle Version Menu 2
    const [anchorElVersionMenu2, setAnchorElVersionMenu2] = useState(null);
    const openVersionMenu2 = Boolean(anchorElVersionMenu2);
    const handleClickVersionMenu2 = (e) => {
        setAnchorElVersionMenu2(e.currentTarget);
    };
    const handleCloseVersionMenu2 = () => {
        setAnchorElVersionMenu2(null);
    };

    return (
        <Box
            display="flex"
            flexDirection="column" // Stack children vertically
            alignItems="flex-start" // Align items at the top
            justifyContent="flex-start" // Ensure content starts at the top
            sx={{ minHeight: '100vh' }}
        >
            <Grid container justifyContent="center">
                <Grid container spacing={2} xs={11} md={11}>
                    <Grid item xs={12}>
                        <Typography variant="h6" fontWeight="bold">{t("compare-version.title")}</Typography>
                    </Grid>
                    
                    <Grid container item xs={12} spacing={1}>
                        <Grid item xs={6}>
                            {/* Version Button */}
                            <Button
                                variant="contained"
                                size="small"
                                color="success"
                                startIcon={<BookOutlinedIcon />}
                                onClick={handleClickVersionMenu1}
                            >
                                {t("common.version")} {version1 == -1.0 ? null : version1.toFixed(1)}
                            </Button>
                            {/* Version Menu */}
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorElVersionMenu1}
                                open={openVersionMenu1}
                                onClose={handleCloseVersionMenu1}
                                MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                                PaperProps={{ sx: { minWidth: "200px" } }}
                            >
                                {scriptInfo?.version
                                    ?.slice() // Create a copy before sorting to prevent modifying the original data
                                    .sort((a, b) => b - a)
                                    .map((version, index) => (
                                        <MenuItem key={index}
                                            onClick={() => {
                                                setVersion1(version);
                                                reloadFileData1();
                                            }}
                                            disabled={version === version1 || version === version2}
                                        >
                                            {`${t("common.version")} ${version.toFixed(1)}`}
                                        </MenuItem>
                                    ))
                                }
                            </Menu>
                            {/* Text Editor */}
                            <Editor
                                height="700px"
                                width="100%"
                                language="json"
                                theme={theme.palette.mode === "dark" ? "vs-dark" : "light"}
                                value={fileData1 || "{}"}
                                options={{
                                    inlineSuggest: true,
                                    fontSize: "16px",
                                    formatOnType: true,
                                    autoClosingBrackets: true,
                                    minimap: { enabled: false },
                                    readOnly: true,
                                }}
                                onMount={(editor) => leftEditorRef.current = editor}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            {/* Version Button */}
                            <Button
                                variant="contained"
                                size="small"
                                color="success"
                                startIcon={<BookOutlinedIcon />}
                                onClick={handleClickVersionMenu2}
                            >
                                {t("common.version")} {version2 == -1.0 ? null : version2.toFixed(1)}
                            </Button>
                            {/* Version Menu */}
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorElVersionMenu2}
                                open={openVersionMenu2}
                                onClose={handleCloseVersionMenu2}
                                MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                                PaperProps={{ sx: { minWidth: "200px" } }}
                            >
                                {scriptInfo?.version
                                    ?.slice() // Create a copy before sorting to prevent modifying the original data
                                    .sort((a, b) => b - a)
                                    .map((version, index) => (
                                        <MenuItem key={index}
                                            onClick={() => {
                                                setVersion2(version);
                                                reloadFileData2();
                                            }}
                                            disabled={version === version1 || version === version2}
                                        >
                                            {`${t("common.version")} ${version.toFixed(1)}`}
                                        </MenuItem>
                                    ))
                                }
                            </Menu>
                            {/* Text Editor */}
                            <Editor
                                height="700px"
                                width="100%"
                                language="json"
                                theme={theme.palette.mode === "dark" ? "vs-dark" : "light"}
                                value={fileData2 || "{}"}
                                options={{
                                    inlineSuggest: true,
                                    fontSize: "16px",
                                    formatOnType: true,
                                    autoClosingBrackets: true,
                                    minimap: { enabled: false },
                                    readOnly: true,
                                }}
                                onMount={(editor) => rightEditorRef.current = editor}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default VesionCompare;