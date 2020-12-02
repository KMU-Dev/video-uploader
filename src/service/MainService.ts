import { VideoStatus } from "../entity/Video";
import VideoResolver from "../util/VideoResolver";
import ConfigurationService from "./ConfigurationService";
import GoogleAPIService from "./GoogleAPIService";
import TargetService from "./TargetService";
import UploadService from "./UploadService";
import VideoService from "./VideoService";


export default class MainService {
    private static instance: MainService;

    private configurationService: ConfigurationService;
    private targetService: TargetService;
    private videoService: VideoService;
    private uploadService: UploadService;
    private googleAPIService: GoogleAPIService;

    private constructor() {
        this.configurationService = ConfigurationService.getInstance();
        this.targetService = TargetService.getInstance();
        this.videoService = VideoService.getInstance();
        this.uploadService = UploadService.getInstance();
        this.googleAPIService = GoogleAPIService.getInstance();
    }

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    async start() {
        console.log('MainService start.');

        // check if client authorized
        if (!this.googleAPIService.isClientAuthorized()) throw new ClientNotAuthenticatedError();

        const targetConfigs = await this.configurationService.getConfig('targets');
        await this.targetService.updateTargets(targetConfigs);
        
        const targets = await this.targetService.getTargets();

        for (const target of targets) {
            const videoInfoArray = await new VideoResolver(target.sourceUrl).resolve()
            const uploadVideos = await this.videoService.updateIndices(target, videoInfoArray);

            // set video status to pending
            for (const uploadVideo of uploadVideos) await this.videoService.updateStatus(uploadVideo.id, VideoStatus.PENDING);

            // upload video
            for (const uploadVideo of uploadVideos) await this.uploadService.uploadVideo(uploadVideo);
            
        }
    }
}

export class ClientNotAuthenticatedError extends Error {
    constructor() {
        super("Google OAuth2 client hasn't been initialized. Please go to home page to login.");
    }
}
