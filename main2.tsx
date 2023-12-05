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

const pallete = [
  "#ffe2a9",
  "#ff7200",
  "#3335c6",
  "#00af63",
  "#ff7663",
];
function easeInOutQuint(x: number): number {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

const interBold = await (await fetch(
  "https://cdn.jsdelivr.net/npm/inter-font@3.19.0/ttf/Inter-Bold.ttf",
)).arrayBuffer();

function render(index: number) {
  const width = 1200;
  const height = 630;
  const jumpHeightMax = 96;
  const y = Math.abs(Math.sin(index * Math.PI * 2 / 16)) * jumpHeightMax;
  const transform = `translateY(${-y + 32}px) scale(${
    y / jumpHeightMax / 5 + 1
  })`;

  const imageIndex = Math.floor(index / 4) % images.length;

  const colorIndex = Math.floor(index / 16) % pallete.length;
  const beforeColor = pallete[colorIndex];
  const afterColor = pallete[(colorIndex + 1) % pallete.length];
  const bgCircleRadius = easeInOutQuint((index % 16) / 16) * width / 2 * 1.5;

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
        background: beforeColor,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 630"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
        }}
      >
        <circle r={bgCircleRadius} cx={600} cy={315} fill={afterColor} />
      </svg>
      <div
        style={{
          fontSize: 200,
          fontWeight: "bold",
          fontFamily: "Inter",
          color: "black",
          position: "absolute",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
    {
      fonts: [
        {
          name: "Inter",
          data: interBold,
          style: "bold",
        },
      ],
    },
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
