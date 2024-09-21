export const sanitizeFileName = (fileName: string) => {
  return fileName.replace(/[\s-_]/g, "");
};
