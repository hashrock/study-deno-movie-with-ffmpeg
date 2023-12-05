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

const images = [
  await imageToBase64("./walk-deno-1.png"),
  await imageToBase64("./walk-deno-2.png"),
  await imageToBase64("./walk-deno-3.png"),
  await imageToBase64("./walk-deno-2.png"),
];

function render(index: number) {
  const jumpHeightMax = 96;
  const y = Math.abs(Math.sin(index * Math.PI * 2 / 16)) * jumpHeightMax;
  const transform = `translateY(${-16 - y}px) scale(${
    y / jumpHeightMax / 5 + 1
  })`;

  const imageIndex = Math.floor(index / 4) % images.length;

  const textTransform = `translateY(${
    Math.sin(index * Math.PI * 2 / 64) * 10
  }px)`;

  return new ImageResponse(
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
          transform: textTransform,
          marginTop: 64,
          fontSize: 64,
        }}
      >
        Hello Deno!
      </div>
      <img
        style={{
          transform,
          width: imageSize.width * imageScale,
          height: imageSize.height * imageScale,
        }}
        src={images[imageIndex]}
      />
    </div>,
  );
}

console.time("render");
for (let i = 0; i < 64; i++) {
  const res = await render(i);
  Deno.mkdir("images", { recursive: true });
  if (res.body) {
    await Deno.writeFile(
      `images/image_${i.toString().padStart(2, "0")}.png`,
      res.body,
    );
  }
}

console.timeEnd("render");
