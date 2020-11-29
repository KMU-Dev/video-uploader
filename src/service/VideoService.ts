import { getRepository, Repository } from "typeorm";
import { Target } from "../entity/Target";
import { Video, VideoStatus } from "../entity/Video";
import { VideoInfo } from "../model/video";
import { ModelMapper } from "../util/mapper";

export default class VideoService {
    private static instance: VideoService;

    private videoRepository: Repository<Video>;

    private constructor() {
        this.videoRepository = getRepository(Video);
    }

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    async updateIndices(target: Target, videoInfoArray: VideoInfo[]) {
        const uploadVideos: Video[] = [];

        for (const videoInfo of videoInfoArray) {
            const video = await this.videoRepository.findOne(videoInfo.id);
            if (video) {
                if (video.status === VideoStatus.FAILED || video.status === VideoStatus.DISCOVERED) uploadVideos.push(video);
            } else {
                const mapper = new ModelMapper<VideoInfo, Video>()
                        .excludeFields("status")
                        .addField("status", () => VideoStatus.DISCOVERED)
                        .addField("target", () => target);
                const video = mapper.map(videoInfo);
                
                const savedVideo = await this.videoRepository.save(video);
                uploadVideos.push(savedVideo);
            }
        }

        return uploadVideos;
    }
}
