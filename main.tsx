import { ImageResponse } from "https://deno.land/x/og_edge@0.0.6/mod.ts";

async function imageToBase64(image: string) {
  const data = await Deno.readFile(image);
  const base64 = btoa(String.fromCharCode(...data));
  const mimeType = image.split(".").pop();
  return `data:image/${mimeType};base64,${base64}`;
}

const base64 = await imageToBase64("./walk-deno-1.png");
const res = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 128,
        background: "#f5dd42",
      }}
    >
      Hello Deno!
      <img style={
        {
          
        }
      } src={base64} width={633} height={488} />
    </div>,
  );

if(res.body){
  Deno.writeFile("image.png", res.body)
}
