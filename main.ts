import { ffmpeg } from "https://deno.land/x/fast_forward/mod.ts";


await ffmpeg(new URL("https://www.w3schools.com/html/mov_bbb.mp4"))
  // Global encoding options (applied to all outputs).
  .audioBitrate("192k")
  .videoBitrate("1M")
  .width(480)
  .height(640)
  // Ouput 1.
  .output("output.mp4")
  .audioCodec("aac")
  .videoCodec("libx264")
  // Ouput 2.
  .output("output.webm")
  .audioCodec("libvorbis")
  .videoCodec("libvpx-vp9")
  // Start encoding.
  .encode();

console.log("All encodings done!");


// import * as ffmpeg from "https://esm.sh/@ffmpeg/ffmpeg@0.12.7"
// import {FFmpeg} from 'https://unpkg.com/@ffmpeg/ffmpeg/dist/esm/index.js';
// import ffmpegCore from 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/esm/ffmpeg-core.js';

// const ctx =  new ffmpeg.FFmpeg()

// console.log(ctx.load())

// const ins = await ffmpeg()
// await ins.load({
//   coreURL: "/packages/core/dist/esm/ffmpeg-core.js",
// });
// await ins.writeFile('input.webm', await fetch('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm'));


// const f = new FFmpeg()
// console.log(f.load(ffmpegCore))