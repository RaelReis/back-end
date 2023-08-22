export const createUrlFromBuffer = (image: Buffer) => {
  const mimeType = "image/png";
  const base64 = Buffer.from(image).toString("base64");
  const url = `data:${mimeType};base64,${base64}`;

  return url;
};
