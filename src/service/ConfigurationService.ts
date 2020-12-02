import { path } from "app-root-path";
import { promises as fsPromises} from "fs";
import { ApplicationConfig } from "../model/config";
import { PropType } from "../util/types";

export default class ConfigurationService {
    private static instance: ConfigurationService;

    private config?: ApplicationConfig;

    private constructor() {}

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    async getConfig<K extends keyof ApplicationConfig>(key: K) {
        if (!this.config) {
            const jsonStr = await fsPromises.readFile(path + '/uploaderconfig.json', 'utf-8');
            this.config = JSON.parse(jsonStr) as ApplicationConfig;
        }
        
        return this.config[key] as PropType<ApplicationConfig, K>;
    }
}
