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
const imageScale = 0.6;

const images = [
  await imageToBase64("./walk-deno-1.png"),
  await imageToBase64("./walk-deno-2.png"),
  await imageToBase64("./walk-deno-3.png"),
  await imageToBase64("./walk-deno-2.png"),
];

const sabotainImage = await imageToBase64("./sabotain.png");

const pallete = [
  "#2855ff",
  "#da7dff",
  "#fffd70",
  "#ff52aa",
];
function easeInOutQuint(x: number): number {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

const interBold = await (await fetch(
  "https://cdn.jsdelivr.net/npm/inter-font@3.19.0/ttf/Inter-Bold.ttf",
)).arrayBuffer();

const FRAMERATE = 64;
const FRAME_16 = FRAMERATE / 2;
const FRAME_4 = FRAMERATE / 8;
const LENGTH = 2;

function render(index: number) {
  const width = 1200;
  const height = 630;
  const jumpHeightMax = 96;
  const y = Math.abs(Math.sin(index * Math.PI * 2 / FRAME_16)) * jumpHeightMax;
  const transform = `translateY(${-y + 64}px)`;

  const imageIndex = Math.floor(index / FRAME_4) % images.length;

  const colorIndex = Math.floor(index / FRAME_16) % pallete.length;
  const beforeColor = pallete[colorIndex];
  const afterColor = pallete[(colorIndex + 1) % pallete.length];
  const bgCircleRadius = easeInOutQuint((index % FRAME_16) / FRAME_16) * width /
    2 * 1.5;

  const tick = index % FRAMERATE;
  const tickStd = tick / FRAMERATE;

  const sabotains = [];
  const gridSize = 200;
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 9; x++) {
      sabotains.push({
        x: x * gridSize - gridSize / 2 + y * gridSize / 2 - gridSize * 2 +
          (tickStd * gridSize),
        y: y * gridSize - gridSize / 2,
        scale: 1,
        rotation: 0,
      });
    }
  }

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
      {
        <div
          style={{
            position: "absolute",
            display: "flex",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {sabotains.map((sabotain) => {
            return (
              <img
                width={95}
                height={115}
                src={sabotainImage}
                style={{
                  transform:
                    `translate(${sabotain.x}px, ${sabotain.y}px) scale(${sabotain.scale}) rotate(${sabotain.rotation}deg)`,
                  position: "absolute",
                  left: 0,
                  top: 0,
                }}
              />
            );
          })}
        </div>
      }

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
for (let i = 0; i < FRAMERATE * LENGTH; i++) {
  const res = await render(i);
  Deno.mkdir("images", { recursive: true });
  if (res.body) {
    await Deno.writeFile(
      `images/image_${i.toString().padStart(2, "0")}.png`,
      res.body,
    );
    console.log(`rendered ${i}`);
  }
}

console.timeEnd("render");
