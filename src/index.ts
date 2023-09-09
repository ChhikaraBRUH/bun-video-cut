import { Elysia, t } from "elysia";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const app = new Elysia()
  .get("/", () => "Hello, Crop server running")
  .post(
    "/crop",
    ({ body: { videoUrl, startTime, duration } }) => {
      return new Promise((resolve, reject) => {
        ffmpeg(videoUrl)
          .setStartTime(startTime)
          .setDuration(duration)
          .output("output.webm")
          .on("end", () => resolve("Video processing finished"))
          .on("error", (err) => reject(err.message))
          .run();
      });
    },
    {
      body: t.Object({
        videoUrl: t.String(),
        startTime: t.Number(),
        duration: t.Number(),
      }),
    }
  )
  .listen(8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
