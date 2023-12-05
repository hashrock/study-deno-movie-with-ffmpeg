import { ImageResponse } from "https://deno.land/x/og_edge@0.0.6/mod.ts";

const res = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 128,
        background: "lavender",
      }}
    >
      Hello!
    </div>,
  );

if(res.body){
  Deno.writeFile("image.png", res.body)
}
