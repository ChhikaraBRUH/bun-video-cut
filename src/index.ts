import { Elysia, t } from "elysia";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const app = new Elysia()
  .get("/", () => "Hello, Crop server running")
  .post(
    "/cut",
    ({ body: { videoUrl, startTime, duration } }) => {
      const outputPath = "output.webm";
      return new Promise((resolve, reject) => {
        ffmpeg(videoUrl)
          .videoCodec("copy")
          .noAudio()
          .setStartTime(startTime)
          .setDuration(duration)
          .toFormat("webm")
          .output(outputPath)
          .on("end", () => resolve("Video processing finished"))
          .on("error", (err) => reject(err.message))
          .run();
      }).then(() => Bun.file(outputPath));
    },
    {
      body: t.Object({
        videoUrl: t.String(),
        startTime: t.Number(),
        duration: t.Number(),
      }),
    }
  )
  .listen(Bun.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
