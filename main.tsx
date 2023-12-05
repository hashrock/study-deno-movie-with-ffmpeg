import { ImageResponse } from "https://deno.land/x/og_edge@0.0.6/mod.ts";

async function imageToBase64(image: string) {
  const data = await Deno.readFile(image);
  const base64 = btoa(String.fromCharCode(...data));
  const mimeType = image.split(".").pop();
  return `data:image/${mimeType};base64,${base64}`;
}

const imageSize = {
  width: 633,
  height: 488,
};
const imageScale = 0.8;
const image1 = await imageToBase64("./walk-deno-1.png");
const res = new ImageResponse(
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 64,
      background: "#f5dd42",
    }}
  >
    <div
      style={{
        marginTop: 64,
        fontSize: 64,
      }}
    >
      Hello Deno!
    </div>
    <img
      style={{
        transform: `translateY(-64px)`,
        width: imageSize.width * imageScale,
        height: imageSize.height * imageScale,
      }}
      src={image1}
    />
  </div>,
);

if (res.body) {
  Deno.writeFile("image.png", res.body);
}
