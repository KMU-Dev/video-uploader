import { drive_v3, google } from "googleapis";
import fetch from "node-fetch";
import chalk from "chalk";
import { Video, VideoStatus } from "../entity/Video";
import VideoService from "./VideoService";

export default class UploadService {
    private static instance: UploadService;

    private drive: drive_v3.Drive;
    private readonly videoService: VideoService;

    private constructor() {
        this.drive = google.drive({
            version: 'v3'
        });
        this.videoService = VideoService.getInstance();
    }

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    async uploadVideo(video: Video) {
        try {
            // get video target
            let fetchedVideo = await this.videoService.getVideoWithTarget(video.id);
            if (!fetchedVideo) {
                console.error('Cannot find video with id ' + video.id + ' in database.');
                return;
            }

            // set video status to upload
            await this.videoService.updateStatus(fetchedVideo.id, VideoStatus.UPLOADING);
            console.log(chalk.yellowBright("Upload video \"" + fetchedVideo.name + "\" to \"" + fetchedVideo.target.name + "\" folder..."));

            // get readable stream from url
            const videoResponse = await fetch(fetchedVideo.url);

            // upload video file
            await this.drive.files.create({
                requestBody: {
                    name: video.name,
                    parents: [fetchedVideo.target.destinationFolder],
                },
                media: {
                    mimeType: 'video/mp4',
                    body: videoResponse.body,
                },
                supportsAllDrives: true,
            });

            // set video status to uploaded
            await this.videoService.updateStatus(fetchedVideo.id, VideoStatus.UPLOADED);
            console.log(chalk.green("Video \"" + fetchedVideo.name + "\" was successfully uploaded to \"" + fetchedVideo.target.name + "\" folder.\n"));
        } catch(err) {
            console.error(err);
            await this.videoService.updateStatus(video.id, VideoStatus.FAILED);
        }
    }
}
