import VideoResolver from "../util/VideoResolver";
import ConfigurationService from "./ConfigurationService";
import TargetService from "./TargetService";
import VideoService from "./VideoService";


export default class MainService {
    private static instance: MainService;

    private configurationService: ConfigurationService;
    private targetService: TargetService;
    private videoService: VideoService;

    private constructor() {
        this.configurationService = ConfigurationService.getInstance();
        this.targetService = TargetService.getInstance();
        this.videoService = VideoService.getInstance();
    }

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    async start() {
        console.log('MainService start.');
        const targetConfigs = await this.configurationService.getTargets();
        await this.targetService.updateTargets(targetConfigs);
        
        const targets = await this.targetService.getTargets();

        for (const target of targets) {
            new VideoResolver(target.sourceUrl).resolve().then(async videoInfoArray => {
                const uploadVideos = await this.videoService.updateIndices(target, videoInfoArray);
                
            });
        }
    }
}